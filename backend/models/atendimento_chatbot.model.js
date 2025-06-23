module.exports = (sequelize, DataTypes) => {
    const AtendimentoChatbot = sequelize.define('AtendimentoChatbot', {
        id_atendimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        texto_entrada_usuario: DataTypes.STRING(200),
        resposta_gerada: DataTypes.STRING(250),
        data_atendimento: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'atendimento_chatbot',
        timestamps: false
    });

    AtendimentoChatbot.associate = (models) => {
        AtendimentoChatbot.hasOne(models.Feedback, { foreignKey: 'atendimento_id' });
        AtendimentoChatbot.hasMany(models.SessaoUsuario, { foreignKey: 'atendimento_id' });
        AtendimentoChatbot.hasMany(models.BaseChatbotSolucao, { foreignKey: 'atendimento_id' });
    };

    return AtendimentoChatbot;
};
