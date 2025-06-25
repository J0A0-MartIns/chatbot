const express = require('express');
const app = express();
const cors = require('cors');

// --- ARQUIVOS DE ROTAS ---
const routes = require('./routes'); // Carrega o index.js com as rotas principais
const authRoutes = require('./routes/auth.routes'); // <-- ADIÇÃO 1: Importa as rotas de autenticação
const dashboardRoutes = require('./routes/dashboard.routes');
const relatorioRoutes = require('./routes/relatorio.routes.js');
const chatRoutes = require('./routes/chat.routes.js');

const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());


// --- REGISTRO DAS ROTAS ---
// É importante registrar a rota de autenticação ANTES das rotas gerais.
app.use('/api/auth', authRoutes); // <-- ADIÇÃO 2: Diz ao Express para usar as rotas de auth sob o prefixo /api/auth
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', routes); // Carrega todas as outras rotas (usuários, perfis, etc.) sob /api


// --- MIDDLEWARE DE ERRO ---
app.use(errorHandler);


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;

// Lembrete: Após o banco de dados estar sincronizado, mude { force: true }
// de volta para { alter: true } ou remova a opção para não perder seus dados a cada reinicialização.
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});
