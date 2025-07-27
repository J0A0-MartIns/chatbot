module.exports = (sequelize, DataTypes) => {
    const BaseChatbotSolucao = sequelize.define('BaseChatbotSolucao', {
        id_atendimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'atendimento_chatbot',
                key: 'id_atendimento'
            }
        },
        id_documento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'base_conhecimento',
                key: 'id_documento'
            }
        }
    }, {
        tableName: 'base_chatbot_solucao',
        timestamps: false
    });

    return BaseChatbotSolucao;
};