/**
 * models/atendimento_chatbot.model.js
 */
module.exports = (sequelize, DataTypes) => {
    const AtendimentoChatbot = sequelize.define('AtendimentoChatbot', {
        id_atendimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pergunta_usuario: DataTypes.TEXT,
        resposta_chatbot: DataTypes.TEXT,
        data_atendimento: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        id_sessao: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'atendimento_chatbot',
        timestamps: true
    });

    AtendimentoChatbot.associate = (models) => {
        AtendimentoChatbot.hasOne(models.Feedback, { foreignKey: 'atendimento_chatbot_id_atendimento' });
        AtendimentoChatbot.belongsTo(models.SessaoUsuario, { foreignKey: 'id_sessao' });

        AtendimentoChatbot.belongsToMany(models.BaseConhecimento, {
            through: models.BaseChatbotSolucao,
            foreignKey: 'id_atendimento',
            otherKey: 'id_documento',
            as: 'Solucoes'
        });
    };

    return AtendimentoChatbot;
};