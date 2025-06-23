module.exports = (sequelize, DataTypes) => {
    const BaseChatbotSolucao = sequelize.define('BaseChatbotSolucao', {
        atendimento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        base_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ativo: DataTypes.BOOLEAN
    }, {
        tableName: 'base_chatbot_solucao',
        timestamps: false
    });

    BaseChatbotSolucao.associate = (models) => {
        BaseChatbotSolucao.belongsTo(models.AtendimentoChatbot, { foreignKey: 'atendimento_id' });
        BaseChatbotSolucao.belongsTo(models.BaseConhecimento, { foreignKey: 'base_id' });
    };

    return BaseChatbotSolucao;
};
