require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

module.exports = app;
