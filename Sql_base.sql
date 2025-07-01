-- --- 1. Estrutura de Perfis e Permissões ---

CREATE TABLE perfil (
    id_perfil SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissao (
    id_permissao SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE perfil_permissao (
    id_perfil INT NOT NULL REFERENCES perfil(id_perfil) ON DELETE CASCADE,
    id_permissao INT NOT NULL REFERENCES permissao(id_permissao) ON DELETE CASCADE,
    PRIMARY KEY (id_perfil, id_permissao)
);


-- --- 2. Estrutura de Usuário ---

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente', -- ('pendente', 'ativo', 'inativo')
    id_perfil INT NOT NULL,
    "passwordResetToken" VARCHAR(255),
    "passwordResetExpires" TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (id_perfil) REFERENCES perfil(id_perfil) ON DELETE RESTRICT
);


-- --- 3. Estrutura da Base de Conhecimento ---

CREATE TABLE tema (
    id_tema SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE sub_tema (
    id_subtema SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_tema INT NOT NULL,
    FOREIGN KEY (id_tema) REFERENCES tema(id_tema) ON DELETE CASCADE
);

CREATE TABLE base_conhecimento (
    id_documento SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    palavras_chave VARCHAR(255),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    id_usuario INT,
    id_subtema INT,
    FOREIGN KEY (id_usuario ) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_subtema) REFERENCES sub_tema(id_subtema) ON DELETE SET NULL
);


-- --- 4. Estrutura do documento anexado (falta implementar) ---

CREATE TABLE documento_arquivo (
    id_arquivo SERIAL PRIMARY KEY,
    nome_original VARCHAR(255) NOT NULL,
    nome_armazenado VARCHAR(255) NOT NULL UNIQUE,
    caminho_arquivo TEXT NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamanho_bytes BIGINT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_documento INT NOT NULL,
    FOREIGN KEY (id_documento) REFERENCES base_conhecimento(id_documento) ON DELETE CASCADE
);


-- --- 5. Estrutura do Chat, Feedback e Pendências ---

CREATE TABLE sessao_usuario (
    id_sessao SERIAL PRIMARY KEY,
    data_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_logout TIMESTAMP WITH TIME ZONE,
    id_usuario  INT,
    FOREIGN KEY (id_usuario ) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE atendimento_chatbot (
    id_atendimento SERIAL PRIMARY KEY,
    pergunta_usuario TEXT NOT NULL,
    resposta_chatbot TEXT,
    data_atendimento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_sessao INT NOT NULL,
    FOREIGN KEY (id_sessao) REFERENCES sessao_usuario(id_sessao) ON DELETE CASCADE
);

-- CORREÇÃO: A tabela de junção agora usa os nomes de coluna corretos
CREATE TABLE base_chatbot_solucao (
    atendimento_id INT NOT NULL REFERENCES atendimento_chatbot(id_atendimento) ON DELETE CASCADE,
    documento_id INT NOT NULL REFERENCES base_conhecimento(id_documento) ON DELETE CASCADE,
    PRIMARY KEY (atendimento_id, documento_id)
);

CREATE TABLE feedback (
    id_feedback SERIAL PRIMARY KEY,
    avaliacao BOOLEAN NOT NULL, -- true = útil, false = não útil
    comentario TEXT,
    atendimento_chatbot_id_atendimento INT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendimento_chatbot_id_atendimento) REFERENCES atendimento_chatbot(id_atendimento) ON DELETE CASCADE
);

CREATE TABLE pendencia (
    id_pendencia SERIAL PRIMARY KEY,
    motivo TEXT,
    id_atendimento INT NOT NULL,
    id_feedback INT, 
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_atendimento) REFERENCES atendimento_chatbot(id_atendimento) ON DELETE CASCADE,
    FOREIGN KEY (id_feedback) REFERENCES feedback(id_feedback) ON DELETE SET NULL
);

-- --- FIM DO SCRIPT ---

-- Inserção base --
INSERT INTO perfil (id_perfil, nome) VALUES 
    (1, 'Admin');

INSERT INTO permissao (nome) VALUES
    ('listar_usuarios'), 
    ('buscar_usuario_por_id'), 
    ('editar_usuario'), 
    ('deletar_usuario'),
    ('criar_usuario'),
    ('gerenciar_perfis'), 
    ('gerenciar_permissoes'), 
    ('criar_documento'), 
    ('editar_documento'), 
    ('deletar_documento'), 
    ('publicar_documento'), 
    ('gerenciar_categorias'), 
    ('ver_categorias'),
    ('criar_categorias'),
    ('editar_categorias'),
    ('deletar_categorias'),
    ('listar_pendencias'), 
    ('aprovar_pendencia'), 
    ('rejeitar_pendencia'), 
    ('listar_atendimentos'), 
    ('listar_feedbacks'),
    ('ver_relatorios')

INSERT INTO perfil_permissao (id_perfil, id_permissao)
SELECT 1, p.id_permissao FROM permissao p

INSERT INTO usuario (nome, email, senha, status, id_perfil)
VALUES (
    'João Adm.',
    'root@admin.com',
    '$2b$10$1Lb/q.qeSCzIyr4pUAzseeOKWkDd7UtIscqw47UpVGN43tpRbIP7S', --admin123
    'ativo', -- Define o status como 'ativo' diretamente
    1 -- Associa ao perfil de Admin (ID 1)
)