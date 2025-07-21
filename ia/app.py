import os  #Usado para acessar variáveis de ambiente ou funções do sistema operacional.
import sys # Usado para interagir com o interpretador Python, como manipular o sys.path, encerrar o script, logar erros, etc.
import numpy as np
from dotenv import load_dotenv
from psycopg2._json import Json
from sentence_transformers import SentenceTransformer
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
#import google.generativeai as genai
import hashlib
from sklearn.preprocessing import normalize
from groq import Groq


def log_stderr(message):
    print(message, file=sys.stderr, flush=True)


load_dotenv()

#GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    log_stderr("ERRO FATAL: A variável de ambiente GROQ_API_KEY não foi encontrada.")
    sys.exit(1)

groq_client = Groq(api_key=GROQ_API_KEY)

print("Carregando o modelo de embedding")
try:
    model_embedding = SentenceTransformer('all-mpnet-base-v2')
    print("Modelo de embedding carregado com sucesso.")
except Exception as e:
    print(f"ERRO: Não foi possível carregar o modelo. Detalhes: {e}")
    sys.exit(1)

app = Flask(__name__)


def conectar_db():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"), user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"), host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        return conn, None
    except Exception as e:
        return None, f"Erro ao conectar ao banco de dados: {e}"


def buscar_melhor_chunk(pergunta, embedding_pergunta, id_subtema, conn):
    try:
        #Pega as palavras da pergunta
        palavras_pergunta = pergunta.lower().split()
        ignorar_palavras = {'o', 'a', 'de', 'para', 'com', 'um', 'uma', 'como', 'qual', 'onde', 'quando', 'quero', 'saber'}
        palavra_chave = [palavra for palavra in palavras_pergunta if palavra not in ignorar_palavras and len(palavra) > 3]
        log_stderr(f"Palavras-chave extraídas da pergunta: {palavra_chave}")

        with conn.cursor() as cur:
            sql_query = """
                SELECT p.id_documento, p.numero_paragrafo, p.conteudo_paragrafo, p.embedding
                FROM documento_paragrafo_embedding p
                JOIN base_conhecimento d ON p.id_documento = d.id_documento
                WHERE d.id_subtema = %s;
            """
            params = [id_subtema]
            if palavra_chave:
                palavra_chave_condicao = " OR ".join([f"d.palavras_chave ILIKE %s" for _ in palavra_chave])
                sql_query += f" AND ({palavra_chave_condicao})"
                params.extend([f"%{kw}%" for kw in palavra_chave])

            cur.execute(sql_query, tuple(params))
            chunks_db = cur.fetchall()

        if not chunks_db:
            return None, None

        melhor_chunk = None
        maior_score = -1

        embedding_pergunta = normalize([embedding_pergunta])[0]

        for doc_id, num_paragrafo, conteudo, embedding_db_json in chunks_db:
            embedding_db = np.array(embedding_db_json, dtype=np.float32)
            embedding_db = normalize([embedding_db])[0]
            score = cosine_similarity([embedding_pergunta], [embedding_db])[0][0]

            if score > maior_score:
                maior_score = score
                melhor_chunk = {
                    "id_documento": doc_id,
                    "numero_paragrafo": num_paragrafo,
                    "conteudo": conteudo,
                    "score": score
                }
        if maior_score > 0.5:
            log_stderr(f"Melhor chunk encontrado com score: {maior_score:.4f}")
            return melhor_chunk, None
        else:
            log_stderr("Nenhum chunk relevante encontrado acima do limiar de 0.5.")
            return None, None

    except Exception as e:
        return None, f"Erro ao buscar chunks: {e}"

# def gerar_resposta_com_gemini(contexto, pergunta):
#     model="llama-3.3-70b-versatile",
#
#     generation_config = genai.types.GenerationConfig(
#         max_output_tokens=250,
#         temperature=0.2
#     )
#
#     prompt = f"""Com base apenas no contexto fornecido abaixo, responda à pergunta do usuário de forma clara e direta em português. Se a resposta não estiver no contexto, diga "Com base nos documentos que tenho acesso, não encontrei uma resposta para a sua pergunta."
#
# Contexto:
# ---
# {contexto}
# ---
# Pergunta do usuário: {pergunta}
# Resposta:"""
#
#     try:
#         response = model.generate_content(prompt, generation_config=generation_config)
#         return response.text, None
#     except Exception as e:
#         return None, f"Erro ao comunicar com a API do Gemini: {e}"

def gerar_resposta_com_groq(contexto, pergunta):
    prompt = f"""Com base no contexto fornecido abaixo, responda à pergunta do usuário de forma clara e direta em português.
Se a resposta não estiver no contexto, diga: "Com base nos documentos que tenho acesso, não encontrei uma resposta para a sua pergunta."

Contexto:
---
{contexto}
---

Pergunta do usuário: {pergunta}
Resposta:"""

    try:
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=300,
            top_p=1,
        )
        return response.choices[0].message.content.strip(), None
    except Exception as e:
        return None, f"Erro ao gerar resposta com GROQ: {e}"

def buscar_resposta_no_cache(embedding_pergunta, conn):
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id_cache, resposta_gerada, embedding_pergunta FROM pergunta_cache;")
            cache_db = cur.fetchall()

        embedding_pergunta = normalize([embedding_pergunta])[0]

        for id_cache, resposta, embedding_db_json in cache_db:
            embedding_db = np.array(embedding_db_json, dtype=np.float32)
            score = cosine_similarity([embedding_pergunta], [embedding_db])[0][0]
            if score > 0.8:
                with conn.cursor() as cur_update:
                    cur_update.execute(
                        "UPDATE pergunta_cache SET contagem_uso = contagem_uso + 1, data_ultimo_uso = NOW() WHERE id_cache = %s;",
                        (id_cache,))
                conn.commit()
                return resposta, None

        return None, None

    except Exception as e:
        return None, f"Erro ao buscar pergunta no cache: {e}"


def salvar_resposta_no_cache(pergunta, embedding_pergunta, resposta, conn):
    try:
        pergunta_hash = hashlib.sha256(pergunta.encode()).hexdigest()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO pergunta_cache (pergunta_hash, pergunta_original, resposta_gerada, embedding_pergunta)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (pergunta_hash) DO NOTHING;
                """,
                (pergunta_hash, pergunta, resposta, Json(embedding_pergunta))
            )
        conn.commit()
        return None
    except Exception as e:
        conn.rollback()
        return f"Erro ao salvar no cache: {e}"


@app.route('/responder', methods=['POST'])
def responder():
    dados = request.json
    pergunta = dados.get('pergunta')
    id_subtema = dados.get('id_subtema')

    if not pergunta or id_subtema is None:
        return jsonify({"error": "Os campos 'pergunta' e 'id_subtema' são obrigatórios."}), 400

    conn, err = conectar_db()
    if err:
        return jsonify({"error": err}), 500
    try:
        embedding_pergunta = model_embedding.encode(pergunta)
        embedding_pergunta = normalize([embedding_pergunta])[0]

        resposta_cache, err = buscar_resposta_no_cache(embedding_pergunta, conn)
        if err:
            log_stderr(f"[CACHE] Erro ao consultar cache: {err}")
            return jsonify({"error": err}), 500

        if resposta_cache:
            log_stderr("[CACHE] Resposta encontrada no cache.")
            return jsonify({"resposta": resposta_cache, "score": "cache"})

        melhor_chunk, err = buscar_melhor_chunk(pergunta, embedding_pergunta, id_subtema, conn)
        if err:
            return jsonify({"error": err}), 500

        if not melhor_chunk:
            resposta_final = "Desculpe, não encontrei nenhuma informação relevante sobre este assunto nos meus documentos."
            score_debug = None
        else:
            try:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT conteudo_paragrafo
                        FROM documento_paragrafo_embedding
                        WHERE id_documento = %s AND numero_paragrafo >= %s AND numero_paragrafo <= %s
                        ORDER BY numero_paragrafo;
                    """, (
                        melhor_chunk['id_documento'],
                        melhor_chunk['numero_paragrafo'] - 1,
                        melhor_chunk['numero_paragrafo'] + 1
                    ))
                    paragrafos = cur.fetchall()
                    contexto_completo = "\n\n".join([p[0] for p in paragrafos])
                    log_stderr("Contexto mínimo obtido com anterior, atual e posterior.")
            except Exception as e:
                return jsonify({"error": f"Erro ao obter parágrafos vizinhos: {e}"}), 500

            #resposta_final, err = gerar_resposta_com_gemini(contexto_completo, pergunta)
            resposta_final, err = gerar_resposta_com_groq(contexto_completo, pergunta)
            if err: return jsonify({"error": err}), 500
            score_debug = melhor_chunk["score"]

        return jsonify({"resposta": resposta_final, "score": score_debug})

    finally:
        if conn:
            conn.close()

@app.route('/salvar_cache', methods=['POST'])
def salvar_cache():
    dados = request.json
    pergunta = dados.get('pergunta')
    resposta = dados.get('resposta')

    if not pergunta or not resposta:
        return jsonify({"error": "Pergunta e resposta são obrigatórias."}), 400

    conn, err = conectar_db()
    if err:
        return jsonify({"error": err}), 500

    try:
        embedding = model_embedding.encode(pergunta)
        embedding = normalize([embedding])[0].tolist()
        err = salvar_resposta_no_cache(pergunta, embedding, resposta, conn)
        if err:
            return jsonify({"error": err}), 500
        return jsonify({"message": "Resposta salva no cache com sucesso."})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
