import os
import sys
import json
import requests
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
import google.generativeai as genai

def log_stderr(message):
    print(message, file=sys.stderr, flush=True)

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    log_stderr("ERRO FATAL: A variável de ambiente GEMINI_API_KEY não foi encontrada.")
    sys.exit(1)

print("Carregando o modelo de embedding")
try:
    model_embedding = SentenceTransformer('all-MiniLM-L6-v2')
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

def buscar_paragrafos_relevantes(embedding_pergunta, id_subtema, conn):
    try:
        with conn.cursor() as cur:
            sql_query = """
                SELECT p.conteudo_paragrafo, p.embedding
                FROM documento_paragrafo_embedding p
                JOIN base_conhecimento d ON p.id_documento = d.id_documento
                WHERE d.id_subtema = %s;
            """
            cur.execute(sql_query, (id_subtema,))
            paragrafos_db = cur.fetchall()

        if not paragrafos_db:
            return [], None

        similaridades = []
        for i, (conteudo, embedding_db_json) in enumerate(paragrafos_db):
            embedding_db = np.array(embedding_db_json, dtype=np.float32)
            score = cosine_similarity([embedding_pergunta], [embedding_db])[0][0]
            log_stderr(f"  -> Parágrafo {i+1}: Score = {score:.4f} | Conteúdo: '{conteudo[:60]}...'")
            if score > 0.35:
                similaridades.append({'score': score, 'conteudo': conteudo})
        log_stderr(f"Encontrados {len(similaridades)} parágrafos relevantes acima do limiar de 0.5.")

        similaridades.sort(key=lambda x: x['score'], reverse=True)
        return [item['conteudo'] for item in similaridades[:3]], None

    except Exception as e:
        return None, f"Erro ao buscar parágrafos: {e}"

def gerar_resposta_com_gemini(contexto, pergunta):
    model = genai.GenerativeModel('gemini-1.5-flash')

    generation_config = genai.types.GenerationConfig(
        max_output_tokens=250,
        temperature=0.2
    )

    prompt = f"""Com base apenas no contexto fornecido abaixo, responda à pergunta do utilizador de forma clara e direta em português. Se a resposta não estiver no contexto, diga "Com base nos documentos que tenho acesso, não encontrei uma resposta para a sua pergunta."

Contexto:
---
{contexto}
---
Pergunta do Utilizador: {pergunta}
Resposta:"""

    try:
        response = model.generate_content(prompt, generation_config=generation_config)
        return response.text, None
    except Exception as e:
        return None, f"Erro ao comunicar com a API do Gemini: {e}"

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
        chunks_relevantes, err = buscar_paragrafos_relevantes(embedding_pergunta, id_subtema, conn)

        if err:
            return jsonify({"error": err}), 500

        if not chunks_relevantes:
            resposta_final = "Desculpe, não encontrei nenhuma informação relevante sobre este assunto nos meus documentos."
        else:
            contexto_formatado = "\n\n".join(chunks_relevantes)
            resposta_final, err = gerar_resposta_com_gemini(contexto_formatado, pergunta)
            if err:
                return jsonify({"error": err}), 500

        return jsonify({"resposta": resposta_final})

    finally:
        if conn:
            conn.close()
# def gerar_resposta_com_llama3(contexto, pergunta):
#     prompt = f"""Com base apenas no contexto fornecido abaixo, responda à pergunta do utilizador de forma clara e direta em português. Se a resposta não estiver no contexto, diga "Com base nos documentos que tenho acesso, não encontrei uma resposta para a sua pergunta."
#
# Contexto:
# ---
# {contexto}
# ---
# Pergunta do Utilizador: {pergunta}
# Resposta:"""
#     try:
#         url_ollama = "http://localhost:11434/api/generate"
#         payload = { "model": "llama3", "prompt": prompt, "stream": False }
#         response = requests.post(url_ollama, json=payload)
#         response.raise_for_status()
#         return response.json()['response'], None
#     except Exception as e:
#         return None, f"Erro ao comunicar com o Llama 3 via Ollama: {e}"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
