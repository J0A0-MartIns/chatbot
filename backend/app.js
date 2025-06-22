const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth.routes'));
app.use('/usuarios', require('./routes/usuario.routes'));
//Ir conectando as rotas...

module.exports = app;
