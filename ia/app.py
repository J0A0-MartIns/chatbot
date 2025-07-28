import os
import sys
import numpy as np
import json
from dotenv import load_dotenv
from psycopg2._json import Json
from sentence_transformers import SentenceTransformer
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
# import google.generativeai as genai
import hashlib
from sklearn.preprocessing import normalize
from groq import Groq


def log_stderr(message):
    print(message, file=sys.stderr, flush=True)


load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
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
        # Pega as palavras da pergunta
        palavras_pergunta = pergunta.lower().split()
        ignorar_palavras = {'o', 'a', 'de', 'para', 'com', 'um', 'uma', 'como', 'qual', 'onde', 'quando', 'quero',
                            'saber'}
        palavra_chave = [palavra for palavra in palavras_pergunta if
                         palavra not in ignorar_palavras and len(palavra) > 3]
        log_stderr(f"Palavras extraídas da pergunta: {palavra_chave}")

        chunks_db = []

        sql_base = """
            SELECT p.id_documento, p.numero_paragrafo, p.conteudo_paragrafo, p.embedding
            FROM documento_paragrafo_embedding p
            JOIN base_conhecimento d ON p.id_documento = d.id_documento
            WHERE d.id_subtema = %s AND d.ativo = true
        """

        params = [id_subtema]

        if palavra_chave:
            log_stderr(f"Etapa 1: Buscando com palavras-chave: {palavra_chave}")
            palavra_chave_condicao = " OR ".join([f"d.palavras_chave ILIKE %s" for _ in palavra_chave])
            sql_query_com_keyword = f"{sql_base} AND ({palavra_chave_condicao});"
            params.extend([f"%{kw}%" for kw in palavra_chave])
            with conn.cursor() as cur:
                cur.execute(sql_query_com_keyword, tuple(params))
                chunks_db = cur.fetchall()
            log_stderr(f"Encontrados {len(chunks_db)} chunks na busca por palavra-chave.")

        if not chunks_db:
            log_stderr("Etapa 2: Nenhuma correspondência de palavra-chave. Fazendo busca semântica completa.")
            with conn.cursor() as cur:
                cur.execute(sql_base + ";", (id_subtema,))
                chunks_db = cur.fetchall()
            log_stderr(f"Encontrados {len(chunks_db)} chunks no total para o subtema.")

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
                    "score": score,
                }
        if maior_score > 0.5:
            log_stderr(f"Melhor chunk encontrado com score: {maior_score:.4f}")
            return melhor_chunk, None
        else:
            log_stderr("Nenhum chunk relevante encontrado acima do limiar de 0.5.")
            return None, None

    except Exception as e:
        return None, f"Erro ao buscar chunks: {e}"

    except Exception as e:
        return None, f"Erro ao buscar chunks: {e}"


def gerar_resposta_com_groq(contexto, pergunta):
    prompt = f"""Com base no contexto fornecido abaixo, responda à pergunta do usuário de forma clara e direta em português.
Se a resposta não estiver no contexto, diga: "Desculpe, não encontrei nenhuma informação relevante sobre este assunto nos meus documentos."

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
            if score > 0.9:
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


def categorizar_pergunta_com_groq(pergunta, categorias_json):
    prompt = f"""
    Você é um assistente de organização de conteúdo. Sua tarefa é categorizar a pergunta de um usuário no tema e subtema mais apropriados a partir de uma lista fornecida.
    Se nenhuma categoria existente parecer adequada, sugira um novo subtema dentro do tema mais relevante. Se nenhum tema for relevante, sugira um novo tema e um novo subtema.

    Responda APENAS com um objeto JSON com as chaves "tema" e "subtema".

    Lista de Categorias Existentes (JSON):
    {categorias_json}

    Pergunta do Usuário: "{pergunta}"

    JSON com a sua sugestão:
    """
    try:
        log_stderr(f"[Categorizador] Prompt: {prompt}")
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=100,
            response_format={"type": "json_object"}
        )

        sugestao_str = response.choices[0].message.content
        sugestao = json.loads(sugestao_str)

        #Verificação para avaliar se a sugestão corresponde a uma categoria existente
        categorias = json.loads(categorias_json)
        tema_sugerido = sugestao.get('tema')
        subtema_sugerido = sugestao.get('subtema')

        tema_existente = any(t['nome'].lower() == tema_sugerido.lower() for t in categorias)
        subtema_existente = any(
            st.lower() == subtema_sugerido.lower()
            for t in categorias if t['nome'].lower() == tema_sugerido.lower()
            for st in t.get('subtemas', [])
        )

        if tema_existente and subtema_existente:
            log_stderr("Sugeriu um tema e subtema existentes.")
        else:
            log_stderr("Sugeriu a criação de um novo tema ou subtema.")

        return sugestao, None
    except Exception as e:
        return None, f"Erro ao categorizar: {e}"


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
            return jsonify({"resposta": resposta_cache, "score": "cache", "solucoes": []})

        melhor_chunk, err = buscar_melhor_chunk(pergunta, embedding_pergunta, id_subtema, conn)
        if err:
            return jsonify({"error": err}), 500

        if not melhor_chunk:
            resposta_final = "Desculpe, não encontrei nenhuma informação relevante sobre este assunto nos meus documentos."
            score_debug = None
            solucoes_finais = []
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

            # resposta_final, err = gerar_resposta_com_gemini(contexto_completo, pergunta)
            resposta_final, err = gerar_resposta_com_groq(contexto_completo, pergunta)
            if err: return jsonify({"error": err}), 500
            score_debug = melhor_chunk["score"]

            solucoes_finais = [{
                "id_documento": melhor_chunk["id_documento"],
                "conteudo": melhor_chunk["conteudo"],
                "score": score_debug
            }]

        return jsonify({"resposta": resposta_final, "score": score_debug, "solucoes": solucoes_finais})

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


@app.route('/categorizar', methods=['POST'])
def categorizar():
    dados = request.json
    pergunta = dados.get('pergunta')
    categorias = dados.get('categorias')
    if not pergunta or not categorias:
        return jsonify({"error": "Os campos 'pergunta' e 'categorias' são obrigatórios."}), 400
    categorias_json = json.dumps(categorias, indent=2, ensure_ascii=False)
    sugestao, err = categorizar_pergunta_com_groq(pergunta, categorias_json)
    if err:
        return jsonify({"error": err}), 500
    return jsonify(sugestao)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
