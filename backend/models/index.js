'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Garante que está a carregar a configuração correta do banco de dados
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// --- LÓGICA DE CARREGAMENTO DOS MODELOS ---
// Lê todos os ficheiros na pasta atual, exceto este ficheiro (index.js)
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
        // Carrega cada ficheiro de modelo e o inicializa com o sequelize
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// --- LÓGICA CRUCIAL DE ASSOCIAÇÃO ---
// Itera sobre todos os modelos carregados e, se eles tiverem uma função 'associate', executa-a.
// Isto garante que todas as relações (belongsTo, hasMany, etc.) são criadas.
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
