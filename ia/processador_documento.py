import os
import sys
import docx
import fitz
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import numpy as np
from sentence_transformers import SentenceTransformer #Testar essa IA, reavaliar posteriormente

load_dotenv()


print("Carregando o modelo de IA")
try:
    modelo_ia = SentenceTransformer('all-MiniLM-L6-v2')
    print("Modelo de IA carregado com sucesso.")
except Exception as e:
    print(f"ERRO: Não foi possível carregar o modelo SentenceTransformer. Detalhes: {e}")
    sys.exit(1)

#Para extrair os textos
def extrair_texto_docx(caminho_arquivo):
    try:
        doc = docx.Document(caminho_arquivo)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        print(f"Erro ao extrair texto do DOCX: {e}")
        return None

def extrair_texto_pdf(caminho_arquivo):
    try:
        with fitz.open(caminho_arquivo) as doc:
            return "".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Erro ao extrair texto do PDF: {e}")
        return None

def dividir_em_paragrafos(texto_completo):
    return [p.strip() for p in texto_completo.split('\n') if len(p.strip()) > 20]
def gerar_embedding(texto):
    try:
        # Gera o embedding localmente e converte para uma lista de floats padrão para ser guardada no JSONB
        embedding = modelo_ia.encode(texto)
        return embedding.tolist()
    except Exception as e:
        print(f"Erro ao gerar embedding localmente: {e}")
        return None


def conectar_db():
    try:
        return psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
    except Exception as e:
        print(f"Erro ao conectar à base de dados: {e}")
        return None

def salvar_embeddings_db(id_documento, embedding_global, paragrafos_com_embeddings):
    conn = conectar_db()
    if not conn: return
    try:
        with conn.cursor() as cur:
            #Salva o embedding total
            cur.execute(
                "INSERT INTO documento_embedding (id_documento, embedding) VALUES (%s, %s) ON CONFLICT (id_documento) DO UPDATE SET embedding = EXCLUDED.embedding;",
                (id_documento, Json(embedding_global))
            )

            #Salva os embeddings de cada parágrafo
            for item in paragrafos_com_embeddings:
                cur.execute(
                    "INSERT INTO documento_paragrafo_embedding (id_documento, numero_paragrafo, conteudo_paragrafo, embedding) VALUES (%s, %s, %s, %s) ON CONFLICT (id_documento, numero_paragrafo) DO NOTHING;",
                    (id_documento, item['numero'], item['conteudo'], Json(item['embedding']))
                )
            print(f"{len(paragrafos_com_embeddings)} embeddings de parágrafos salvos para o documento {id_documento}.")
        conn.commit()
    except Exception as e:
        print(f"Erro ao salvar embeddings no DB: {e}")
        conn.rollback()
    finally:
        conn.close()



def processar_documento(id_documento, caminho_arquivo):
    print(f"--- Iniciando o processamento do documento: {id_documento} ---")

    texto_completo = None
    if caminho_arquivo.lower().endswith('.docx'):
        texto_completo = extrair_texto_docx(caminho_arquivo)
    elif caminho_arquivo.lower().endswith('.pdf'):
        texto_completo = extrair_texto_pdf(caminho_arquivo)
    else:
        print(f"Tipo de arquivo não suportado: {caminho_arquivo}")
        return

    if not texto_completo:
        print("Falha na extração de texto.")
        return

    print("Gerando embedding geral.")
    embedding_global = gerar_embedding(texto_completo)
    if not embedding_global:
        print("Falha na geração do embedding geral.")
        return

    print("Dividindo em parágrafos e gerando embedding.")
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

    print("Salvando embeddings no banco de dados.")
    salvar_embeddings_db(id_documento, embedding_global, paragrafos_com_embeddings)

    print(f"--- Processamento do documento ID: {id_documento} concluído com sucesso! ---")

