##Chatbot Quero-Quero

##Tecnologias Utilizadas
#Back-end
Node.js: Ambiente de execução para JavaScript no servidor.
Express.js: Framework para a construção da API e gestão de rotas.
Sequelize: ORM (Object-Relational Mapper) para interagir com a base de dados PostgreSQL usando JavaScript.
PostgreSQL: Sistema de gestão de base de dados relacional.
JSON Web Tokens (JWT): Para autenticação e autorização segura das rotas da API.
bcrypt.js: Para "hashear" e proteger as senhas dos utilizadores.
dotenv: Para gerir as variáveis de ambiente de forma segura.

#Front-end
Angular: Framework para construir a interface do utilizador (SPA - Single-Page Application).
TypeScript: Superset do JavaScript que adiciona tipagem estática, tornando o código mais robusto.
RxJS: Para programação reativa, especialmente na gestão do estado de autenticação.
HTML & CSS: Para a estrutura e estilo da aplicação.

##Pré-requisitos
Certifique-se que os seguintes softwares estejam instalados na sua máquina:
Node.js
Angular CLI (npm install -g @angular/cli)
PostgreSQL

##Guia de Instalação e Execução
Siga os passos a seguir para a correta execução do programa em sua máquina local:

#1. Configuração do Back-end
Navegue até à pasta do back-end a partir da raiz do projeto:

cd backend
a. Instale as Dependências
Execute o seguinte comando para instalar todos os pacotes necessários:
npm install

b. Configure as Variáveis de Ambiente
Crie um ficheiro chamado .env na raiz da pasta backend e adicione as suas credenciais. Substitua os valores de exemplo.

# Configuração da Base de Dados
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=chatbot_queroquero
DB_PORT=5432

# Chave Secreta para os Tokens JWT
JWT_SECRET=esta_e_uma_chave_secreta_muito_segura_e_longa

c. Configurar a Conexão da Base de Dados
Certifique-se de que o seu código config/database.js está lendo corretamente as variáveis de ambiente.

d. Crie e Popule a Base de Dados

Crie a Base de Dados: Use o seu cliente PostgreSQL (DBeaver, pgAdmin, etc.) e crie uma nova base de dados com o nome que você definiu anteriormente em DB_NAME.
Crie as Tabelas: Execute o script SQL final que disponível neste repositório para criar todas as tabelas com a estrutura correta e criar o usuário root.

e. Iniciar o Servidor do Back-end
Com tudo configurado, inicie o servidor:
npm run dev

#2. Configuração do Front-end
Abra um novo terminal e navegue até à pasta do front-end:

cd frontend

a. Instale as Dependências
Execute o seguinte comando para instalar todos os pacotes do Angular:
npm install

b. Configuração o Ambiente
Verifique se o seu código em src/environments/environment.ts está apontando corretamente para a URL da  API.

c. Inicie a Aplicação Angular
Com tudo configurado, inicie o servidor de desenvolvimento:

ng serve --open

Isto irá compilar a aplicação e abri-la automaticamente no seu navegador no endereço http://localhost:4200.

##Credenciais de Acesso Padrão
Depois de seguir todos os passos, acesse página de login e use as credenciais do usuário root administrador:

Email: root@admin.com
Senha: admin123

##Projeto em desenvolvimento - Programa QQTECH 8 - Lojas Quero-Quero Verde Card

