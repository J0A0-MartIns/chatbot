const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atendimento = sequelize.define('Atendimento', {
    id_atendimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texto_entrada: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    resposta_gerada: {
        type: DataTypes.STRING(250)
    },
    data_atendimento: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'atendimento_chatbot',
    timestamps: false
});

module.exports = Atendimento;
