const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const routes = require('./routes');

const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());


app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;


db.sequelize.sync(/*{ alter: true }*/).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao conectar ao banco:', err);
});
