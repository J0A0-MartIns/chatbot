const express = require('express');
const app = express();
const cors = require('cors');

// --- ARQUIVOS DE ROTAS ---
const routes = require('./routes'); // Carrega o index.js com as rotas principais
const authRoutes = require('./routes/auth.routes'); // <-- ADIÇÃO 1: Importa as rotas de autenticação
const dashboardRoutes = require('./routes/dashboard.routes');
const relatorioRoutes = require('./routes/relatorio.routes.js');
const chatRoutes = require('./routes/chat.routes.js');
const passwordRoutes = require('./routes/senha.routes');

const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/senha', passwordRoutes);
app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;


db.sequelize.sync(/*{ alter: true }*/).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});
