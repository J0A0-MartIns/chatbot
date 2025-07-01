module.exports = (sequelize, DataTypes) => {
    const AtendimentoChatbot = sequelize.define('AtendimentoChatbot', {
        id_atendimento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        pergunta_usuario: DataTypes.TEXT,
        resposta_chatbot: DataTypes.TEXT,
        data_atendimento: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        id_sessao: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'atendimento_chatbot',
        timestamps: true
    });

    AtendimentoChatbot.associate = (models) => {
        AtendimentoChatbot.hasOne(models.Feedback, { foreignKey: 'atendimento_chatbot_id_atendimento' });
        AtendimentoChatbot.belongsTo(models.SessaoUsuario, { foreignKey: 'id_sessao' });

        // --- CORREÇÃO: A outra chave agora é 'documento_id' ---
        AtendimentoChatbot.belongsToMany(models.BaseConhecimento, {
            through: models.BaseChatbotSolucao,
            foreignKey: 'atendimento_id',
            otherKey: 'documento_id',
            as: 'Solucoes'
        });
    };

    return AtendimentoChatbot;
};