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
        resposta_chatbot: DataTypes.TEXT, // Pode ser removido no futuro se a resposta for sempre uma lista
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

        // --- CORREÇÃO CRÍTICA: Define a relação Muitos-para-Muitos ---
        AtendimentoChatbot.belongsToMany(models.BaseConhecimento, {
            through: models.BaseChatbotSolucao, // A tabela de junção
            foreignKey: 'atendimento_id',
            otherKey: 'base_id' // Corrigido de 'base_id' para 'base_conhecimento_id_documento' se o nome for diferente
        });
    };

    return AtendimentoChatbot;
};
