module.exports = (sequelize, DataTypes) => {
    const BaseChatbotSolucao = sequelize.define('BaseChatbotSolucao', {
        id_atendimento: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_documento: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ativo: DataTypes.BOOLEAN
    }, {
        tableName: 'base_chatbot_solucao',
        timestamps: false
    });

    BaseChatbotSolucao.associate = (models) => {
        BaseChatbotSolucao.belongsTo(models.AtendimentoChatbot, { foreignKey: 'id_atendimento' });
        BaseChatbotSolucao.belongsTo(models.BaseConhecimento, { foreignKey: 'id_documento' });
    };

    return BaseChatbotSolucao;
};
