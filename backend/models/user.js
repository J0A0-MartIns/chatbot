const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    nome: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    senha: DataTypes.STRING,
    perfil: DataTypes.STRING,
    aprovado: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
