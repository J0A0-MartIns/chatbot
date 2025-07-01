module.exports = (sequelize, DataTypes) => {
    const BaseChatbotSolucao = sequelize.define('BaseChatbotSolucao', {
        atendimento_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'atendimento_chatbot',
                key: 'id_atendimento'
            }
        },
        documento_id: {
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