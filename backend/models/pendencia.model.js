const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Feedback = require('./feedback.model');

const Pendencia = sequelize.define('Pendencia', {
    id_pendencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tema: {
        type: DataTypes.STRING(45)
    },
    sub_tema: {
        type: DataTypes.STRING(45)
    },
    feedback_id_feedback_busca: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Feedback,
            key: 'id_feedback_busca'
        }
    }
}, {
    tableName: 'pendencia',
    timestamps: false
});

Pendencia.belongsTo(Feedback, {
    foreignKey: 'feedback_id_feedback_busca',
    as: 'feedback'
});

module.exports = Pendencia;
