const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerfilModel = sequelize.define('Perfil', {
    id_perfil: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('administrador', 'operador', 'usuario_final'),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'perfil',
    timestamps: false
});

module.exports = PerfilModel;
