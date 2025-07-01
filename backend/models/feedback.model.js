module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        id_feedback: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        avaliacao: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        atendimento_chatbot_id_atendimento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'feedback',
        timestamps: true
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.AtendimentoChatbot, { foreignKey: 'atendimento_chatbot_id_atendimento' });
        Feedback.hasOne(models.Pendencia, { foreignKey: 'id_feedback' });
    };

    return Feedback;
};
