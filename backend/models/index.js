'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// --- CORREÇÃO: Importa a instância do Sequelize JÁ CONFIGURADA ---
// Em vez de reconfigurar a conexão, usamos a que você já criou.
// Certifique-se de que o caminho '../config/database.config.js' está correto.
const sequelize = require('../config/database.js');


// --- LÓGICA DE CARREGAMENTO DOS MODELOS (permanece a mesma) ---
// Lê todos os ficheiros na pasta atual
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        // Carrega cada ficheiro de modelo e o inicializa com a instância do sequelize
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// --- LÓGICA DE ASSOCIAÇÃO (permanece a mesma) ---
// Itera sobre todos os modelos carregados e executa as associações.
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
