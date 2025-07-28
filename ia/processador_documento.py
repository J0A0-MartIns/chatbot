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

def dividir_em_chunks(texto_completo, tamanho_chunk=600, sobreposicao=200):
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
        return None, e

def salvar_embeddings_db(id_documento, id_arquivo, chunks_com_embeddings):
    conn, err = conectar_db()
    if err: return err
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COALESCE(MAX(numero_paragrafo), 0) 
                FROM documento_paragrafo_embedding 
                WHERE id_documento = %s;
            """, (id_documento,))
            ultimo_numero = cur.fetchone()[0] or 0

            print(f"Último número de parágrafo para o documento {id_documento}: {ultimo_numero}")

            cur.execute("DELETE FROM documento_paragrafo_embedding WHERE id_documento = %s AND id_arquivo = %s;", (id_documento, id_arquivo))

            for i, item in enumerate(chunks_com_embeddings, start=1):
                numero_paragrafo = ultimo_numero + i
                cur.execute("""
                    INSERT INTO documento_paragrafo_embedding 
                    (id_documento, id_arquivo, numero_paragrafo, conteudo_paragrafo, embedding)
                    VALUES (%s, %s, %s, %s, %s);
                """, (id_documento, id_arquivo, numero_paragrafo, item['conteudo'], Json(item['embedding'])))

        conn.commit()
        print(f"{len(chunks_com_embeddings)} chunks salvos com sucesso.")
        return None
    except Exception as e:
        conn.rollback()
        return f"ERRO ao salvar embeddings no BD: {e}"
    finally:
        if conn: conn.close()

def processar_documento(id_documento, id_arquivo, caminho_arquivo):
    print(f"Processando o documento ID: {id_documento} | Arquivo ID: {id_arquivo} ---")

    if not os.path.exists(caminho_arquivo):
        print(f"O arquivo não foi encontrado em: {caminho_arquivo}")
        sys.exit(1)

    texto_completo = None
    if caminho_arquivo.lower().endswith('.docx'):
        texto_completo = extrair_texto_docx(caminho_arquivo)
    elif caminho_arquivo.lower().endswith('.pdf'):
        texto_completo = extrair_texto_pdf(caminho_arquivo)
    else:
        print(f"Tipo de arquivo não suportado: {caminho_arquivo}")
        return

    if not texto_completo:
        print("Falha na extração do texto.")
        return

    chunks = dividir_em_chunks(texto_completo)
    chunks_com_embeddings = []
    for i, chunk in enumerate(chunks):
        embedding_chunk = gerar_embedding(chunk)
        if isinstance(embedding_chunk, list):
            chunks_com_embeddings.append({
                "numero": i + 1,
                "conteudo": chunk,
                "embedding": embedding_chunk
            })

    err = salvar_embeddings_db(id_documento, id_arquivo, chunks_com_embeddings)
    if err:
        print(err)
    else:
        print(f"Processamento finalizado para documento ID: {id_documento} | arquivo ID: {id_arquivo}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Uso: python processador_documento.py <id_documento> <id_arquivo> <caminho_para_o_ficheiro>")
    else:
        doc_id = int(sys.argv[1])
        arquivo_id = int(sys.argv[2])
        caminho = sys.argv[3]
        processar_documento(doc_id, arquivo_id, caminho)
