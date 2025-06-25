module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        id_feedback: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // A avaliação agora é um booleano para clareza: true = útil, false = não útil
        avaliacao: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        // --- ADICIONADO ---
        // Campo para guardar o comentário do utilizador quando o feedback é negativo.
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // A chave estrangeira para o atendimento
        atendimento_chatbot_id_atendimento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'feedback',
        timestamps: true // É útil saber quando o feedback foi dado
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.AtendimentoChatbot, { foreignKey: 'atendimento_chatbot_id_atendimento' });
        Feedback.hasOne(models.Pendencia, { foreignKey: 'id_feedback' });
    };

    return Feedback;
};
