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
        // --- CORREÇÃO: Utiliza TEXT para permitir perguntas mais longas
        pergunta_usuario: DataTypes.TEXT,
        resposta_chatbot: DataTypes.TEXT,
        data_atendimento: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        // --- CORREÇÃO: Adicionada a chave estrangeira que liga ao 'SessaoUsuario'
        id_sessao: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'atendimento_chatbot',
        timestamps: true // É útil ter timestamps aqui
    });

    AtendimentoChatbot.associate = (models) => {
        AtendimentoChatbot.hasOne(models.Feedback, { foreignKey: 'atendimento_chatbot_id_atendimento' });
        AtendimentoChatbot.hasMany(models.BaseChatbotSolucao, { foreignKey: 'atendimento_id' });

        // --- CORREÇÃO: Um atendimento agora pertence a UMA sessão.
        AtendimentoChatbot.belongsTo(models.SessaoUsuario, { foreignKey: 'id_sessao' });
    };

    return AtendimentoChatbot;
};
