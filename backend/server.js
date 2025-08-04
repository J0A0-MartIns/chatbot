const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

db.sequelize.sync(/*{ alter: true }*/).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});
