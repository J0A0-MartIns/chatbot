import os
import sys
import docx
import fitz
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import numpy as np
from sentence_transformers import SentenceTransformer

print("[Python] A iniciar o script de processamento...")
load_dotenv()
try:
    modelo_ia = SentenceTransformer('all-MiniLM-L6-v2')
    print("[Python] Modelo de IA carregado com sucesso.")
except Exception as e:
    print(f"[Python] : Não foi possível carregar o modelo SentenceTransformer. Detalhes: {e}")
    sys.exit(1)

def extrair_texto_docx(caminho_arquivo):
    try:
        print(f"[Python] Extraindo texto do DOCX: {caminho_arquivo}")
        doc = docx.Document(caminho_arquivo)
        texto = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        print("[Python] Extração de texto DOCX bem-sucedida.")
        return texto
    except Exception as e:
        print(f"[Python] Erro ao extrair texto do DOCX: {e}")
        return None

def extrair_texto_pdf(caminho_arquivo):
    try:
        print(f"[Python] Extraindo extrair texto do PDF: {caminho_arquivo}")
        with fitz.open(caminho_arquivo) as doc:
            texto = "".join(page.get_text() for page in doc)
        print("[Python] Extração de texto PDF bem-sucedida.")
        return texto
    except Exception as e:
        print(f"[Python] Erro ao extrair texto do PDF: {e}")
        return None

def dividir_em_paragrafos(texto_completo):
    return [p.strip() for p in texto_completo.split('\n') if len(p.strip()) > 20]

def gerar_embedding(texto):
    try:
        embedding = modelo_ia.encode(texto)
        return embedding.tolist()
    except Exception as e:
        print(f"[Python] Erro ao gerar embedding localmente: {e}")
        return None

def conectar_db():
    try:
        print("[Python] Tentando conectar à base de dados...")
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        print("[Python] Conexão com a base de dados feita com sucesso!.")
        return conn
    except Exception as e:
        print(f"[Python] ERRO ao conectar à base de dados: {e}")
        return None

def salvar_embeddings_db(id_documento, embedding_global, paragrafos_com_embeddings):
    conn = conectar_db()
    if not conn: return
    try:
        print(f"[Python] Salvando {len(paragrafos_com_embeddings)} parágrafos na base de dados...")
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO documento_embedding (id_documento, embedding) VALUES (%s, %s) ON CONFLICT (id_documento) DO UPDATE SET embedding = EXCLUDED.embedding;",
                (id_documento, Json(embedding_global))
            )
            for item in paragrafos_com_embeddings:
                cur.execute(
                    "INSERT INTO documento_paragrafo_embedding (id_documento, numero_paragrafo, conteudo_paragrafo, embedding) VALUES (%s, %s, %s, %s) ON CONFLICT (id_documento, numero_paragrafo) DO NOTHING;",
                    (id_documento, item['numero'], item['conteudo'], Json(item['embedding']))
                )
        conn.commit()
        print("[Python] Embeddings salvos com sucesso.")
    except Exception as e:
        print(f"[Python] ERRO ao salvar embeddings no banco de dados: {e}")
        conn.rollback()
    finally:
        conn.close()

def processar_documento(id_documento, caminho_ficheiro):
    print(f"--- [Python] Iniciando o processamento do documento de ID: {id_documento} ---")

    texto_completo = None
    if caminho_ficheiro.lower().endswith('.docx'):
        texto_completo = extrair_texto_docx(caminho_ficheiro)
    elif caminho_ficheiro.lower().endswith('.pdf'):
        texto_completo = extrair_texto_pdf(caminho_ficheiro)
    else:
        print(f"[Python] Formato de arquivo não suportado: {caminho_ficheiro}")
        return

    if not texto_completo:
        print("[Python] Falha na extração de texto.")
        return

    print("[Python] Gerando embedding global...")
    embedding_global = gerar_embedding(texto_completo)
    if not embedding_global:
        print("[Python] Falha na geração do embedding global.")
        return

    print("[Python] A dividir em parágrafos e a gerar embeddings individuais...")
    paragrafos = dividir_em_paragrafos(texto_completo)
    paragrafos_com_embeddings = []
    for i, paragrafo in enumerate(paragrafos):
        embedding_paragrafo = gerar_embedding(paragrafo)
        if embedding_paragrafo:
            paragrafos_com_embeddings.append({
                "numero": i + 1,
                "conteudo": paragrafo,
                "embedding": embedding_paragrafo
            })
        print(f"-> Embedding do parágrafo {i+1}/{len(paragrafos)} gerado.")

    salvar_embeddings_db(id_documento, embedding_global, paragrafos_com_embeddings)
    print(f"--- [Python] Processamento do documento ID: {id_documento} concluído. ---")
