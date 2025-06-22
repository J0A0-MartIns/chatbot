const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Perfil = require('./perfil.model');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    aprovado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    perfil_id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Perfil,
            key: 'id_perfil'
        }
    }
}, {
    tableName: 'usuario',
    timestamps: false
});

Usuario.belongsTo(Perfil, {
    foreignKey: 'perfil_id_perfil',
    as: 'perfil'
});

module.exports = Usuario;
