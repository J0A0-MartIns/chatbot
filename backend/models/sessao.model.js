const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuario.model');

const SessaoUsuario = sequelize.define('SessaoUsuario', {
    id_sessao_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_login: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_logout: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usuario_id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    atendimento_chatbot_id_atendimento: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'sessao_usuario',
    timestamps: false
});

SessaoUsuario.belongsTo(Usuario, {
    foreignKey: 'usuario_id_usuario',
    as: 'usuario'
});

module.exports = SessaoUsuario;
