import os
import sys
import json
import requests
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity

#logs
def log_stderr(message):
    print(message, file=sys.stderr, flush=True)

def carregar_modelo_ia():
    log_stderr("Carregando o modelo de embedding...")
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        log_stderr("Modelo de embedding carregado com sucesso.")
        return model, None
    except Exception as e:
        return None, f"ERRO ao carregar modelo de embedding: {e}"

def conectar_db():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"), user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"), host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        return conn, None
    except Exception as e:
        return None, f"Erro ao conectar à base de dados: {e}"


def buscar_chunks_relevantes(model_embedding, pergunta, id_subtema, conn):
    try:
        embedding_pergunta = model_embedding.encode(pergunta)
        log_stderr(f"Executando a busca no bd para o subtema ID: {id_subtema}...")
        with conn.cursor() as cur:
            sql_query = """
                SELECT p.conteudo_paragrafo, p.embedding
                FROM documento_paragrafo_embedding p
                JOIN base_conhecimento d ON p.id_documento = d.id_documento
                WHERE d.id_subtema = %s;
            """
            cur.execute(sql_query, (id_subtema,))
            chunks_db = cur.fetchall()

        log_stderr(f"Encontrados {len(chunks_db)} parágrafos no bd para este subtema.")
        if not chunks_db:
            return [], None

        similaridades = []
        for conteudo, embedding_db_json in chunks_db:
            embedding_db = np.array(embedding_db_json, dtype=np.float32)
            score = cosine_similarity([embedding_pergunta], [embedding_db])[0][0]
            if score > 0.5:
                similaridades.append({'score': score, 'conteudo': conteudo})

        log_stderr(f"Encontrados {len(similaridades)} parágrafos relevantes acima do limiar.")
        similaridades.sort(key=lambda x: x['score'], reverse=True)
        return [item['conteudo'] for item in similaridades[:3]], None

    except Exception as e:
        return None, f"Erro ao buscar parágrafos: {e}"


def gerar_resposta_com_llama3(contexto, pergunta):
    prompt = f"""Com base apenas no contexto fornecido abaixo, responda à pergunta do usuário de forma clara e direta em português. Se a resposta não estiver no contexto, diga "Com base nos documentos que tenho acesso, não encontrei uma resposta para a sua pergunta."

Contexto:
---
{contexto}
---
Pergunta do Usuário: {pergunta}
Resposta:"""
    try:
        log_stderr("Enviando o prompt para o Llama 3 via Ollama.")
        url_ollama = "http://localhost:11434/api/generate"
        payload = {"model": "llama3", "prompt": prompt, "stream": False}
        response = requests.post(url_ollama, json=payload)
        response.raise_for_status()
        log_stderr("Resposta recebida com sucesso do Llama 3.")
        return response.json()['response'], None
    except Exception as e:
        return None, f"Erro ao comunicar com o Llama 3 via Ollama: {e}"


def main(pergunta, id_subtema):
    load_dotenv()
    model_embedding, err = carregar_modelo_ia()
    if err: return {"erro": err}

    log_stderr(f"Processando pergunta: '{pergunta}' no subtema ID: {id_subtema} ---")

    conn, err = conectar_db()
    if err: return {"erro": err}

    try:
        chunks_relevantes, err = buscar_chunks_relevantes(model_embedding, pergunta, id_subtema, conn)

        if err: return {"erro": err}

        if not chunks_relevantes:
            log_stderr("Nenhum parágrafo relevante encontrado.")
            return {"resposta": "Desculpe, não foram encontradas informações sobre este assunto."}

        contexto_formatado = "\n\n".join(chunks_relevantes)
        resposta_final, err = gerar_resposta_com_llama3(contexto_formatado, pergunta)

        if err: return {"erro": err}

        return {"resposta": resposta_final, "solucoes": [], "encontrado": True}

    finally:
        if conn:
            conn.close()
            log_stderr("Conexão com a base de dados fechada.")


if __name__ == "__main__":
    try:
        log_stderr("Script iniciado.")
        if len(sys.argv) != 3:
            sys.exit(1)

        pergunta_usuario = sys.argv[1]
        subtema_id = int(sys.argv[2])

        resposta_json = main(pergunta_usuario, subtema_id)

        sys.stdout.write(json.dumps(resposta_json))
        log_stderr("Script finalizado com sucesso.")

    except Exception as e:
        print(json.dumps({f"Erro inesperado no script principal: {e}"}))
        sys.exit(1)
