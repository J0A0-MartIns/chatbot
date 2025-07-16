import os
import sys
import docx
import fitz
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

try:
    model_ia = SentenceTransformer('all-mpnet-base-v2')
    print("Modelo de IA carregado.")
except Exception as e:
    print(f"Não foi possível carregar o modelo. {e}")
    sys.exit(1)


def extrair_texto_docx(caminho_arquivo):
    try:
        print(f"Extraindo o texto do DOCX: {caminho_arquivo}")
        doc = docx.Document(caminho_arquivo)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        print(f"Erro ao extrair texto do DOCX: {e}")
        return None


def extrair_texto_pdf(caminho_arquivo):
    try:
        print(f"Extraindo o texto do PDF: {caminho_arquivo}")
        with fitz.open(caminho_arquivo) as doc:
            return "".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Erro ao extrair texto do PDF: {e}")
        return None


# def dividir_em_paragrafos(texto_completo):
#     return [p.strip() for p in texto_completo.split('\n') if len(p.strip()) > 20]

def dividir_em_chunks(texto_completo, tamanho_chunk=200, sobreposicao=50):
    if not texto_completo:
        return []
    chunks = []
    inicio = 0
    while inicio < len(texto_completo):
        fim = inicio + tamanho_chunk
        chunks.append(texto_completo[inicio:fim])
        inicio += tamanho_chunk - sobreposicao
    return [chunk for chunk in chunks if chunk.strip()]


def gerar_embedding(texto):
    try:
        return model_ia.encode(texto).tolist()
    except Exception as e:
        print(f"Erro ao gerar embedding: {e}")
        return None


def conectar_db():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"), user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"), host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        print("Conexão com a base de dados bem-sucedida.")
        return conn, None
    except Exception as e:
        print(f"Erro ao conectar à base de dados: {e}")
        return None


def salvar_embeddings_db(id_documento, embedding_global, chunks_com_embeddings):
    conn, err = conectar_db()
    if err: return err
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM documento_paragrafo_embedding WHERE id_documento = %s;", (id_documento,))
            cur.execute(
                "INSERT INTO documento_embedding (id_documento, embedding) VALUES (%s, %s) ON CONFLICT (id_documento) DO UPDATE SET embedding = EXCLUDED.embedding;",
                (id_documento, Json(embedding_global))
            )
            for item in chunks_com_embeddings:
                cur.execute(
                    "INSERT INTO documento_paragrafo_embedding (id_documento, numero_paragrafo, conteudo_paragrafo, embedding) VALUES (%s, %s, %s, %s);",
                    (id_documento, item['numero'], item['conteudo'], Json(item['embedding']))
                )
        conn.commit()
        print(f"{len(chunks_com_embeddings)} chunks salvos com sucesso.")
        return None
    except Exception as e:
        conn.rollback()
        return f"ERRO ao salvar embeddings no bd: {e}"
    finally:
        if conn: conn.close()


def processar_documento(id_documento, caminho_ficheiro):
    print(f"Processando o documento de ID: {id_documento} ---")

    if not os.path.exists(caminho_ficheiro):
        print(f"O documento não foi encontrado em: {caminho_ficheiro}")
        sys.exit(1)

    texto_completo = None
    if caminho_ficheiro.lower().endswith('.docx'):
        texto_completo = extrair_texto_docx(caminho_ficheiro)
    elif caminho_ficheiro.lower().endswith('.pdf'):
        texto_completo = extrair_texto_pdf(caminho_ficheiro)
    else:
        print(f"Tipo de arquivo não suportado: {caminho_ficheiro}")
        return

    if not texto_completo:
        print("Falha na extração do texto.")
        return

    embedding_global = gerar_embedding(texto_completo)
    if isinstance(embedding_global, str):
        print(embedding_global)
        return

    chunks = dividir_em_chunks(texto_completo)
    chunks_com_embeddings = []
    for i, chunk in enumerate(chunks):
        embedding_chunk = gerar_embedding(chunk)
        if isinstance(embedding_chunk, list):
            chunks_com_embeddings.append({
                "numero": i + 1, "conteudo": chunk, "embedding": embedding_chunk
            })

    err = salvar_embeddings_db(id_documento, embedding_global, chunks_com_embeddings)
    if err:
        print(err)
    else:
        print(f"Processamento do documento ID: {id_documento} concluído. ---")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python processador_documentos.py <id_documento> <caminho_para_o_ficheiro>")
    else:
        doc_id = int(sys.argv[1])
        caminho = sys.argv[2]
        processar_documento(doc_id, caminho)
