const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Atendimento = require('./atendimento.model');

const Feedback = sequelize.define('Feedback', {
    id_feedback_busca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    avaliacao: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    atendimento_chatbot_id_atendimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Atendimento,
            key: 'id_atendimento'
        }
    }
}, {
    tableName: 'feedback',
    timestamps: false
});

Feedback.belongsTo(Atendimento, {
    foreignKey: 'atendimento_chatbot_id_atendimento',
    as: 'atendimento'
});

module.exports = Feedback;
