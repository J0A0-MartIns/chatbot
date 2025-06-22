const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaseChatbotSolucao = sequelize.define('BaseChatbotSolucao', {
    atendimento_id_atendimento: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    base_conhecimento_id_documento: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'base_chatbot_solucao',
    timestamps: false
});

module.exports = BaseChatbotSolucao;
