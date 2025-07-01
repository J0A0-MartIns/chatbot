module.exports = (sequelize, DataTypes) => {
    const BaseConhecimento = sequelize.define('BaseConhecimento', {
        id_documento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        titulo: DataTypes.STRING,
        conteudo: DataTypes.TEXT,
        palavras_chave: DataTypes.STRING,
        data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
        usuario_id: DataTypes.INTEGER,
        id_subtema: DataTypes.INTEGER
    }, {
        tableName: 'base_conhecimento',
        timestamps: false
    });

    BaseConhecimento.associate = (models) => {
        BaseConhecimento.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
            as: 'Usuario'
        });
        BaseConhecimento.belongsToMany(models.AtendimentoChatbot, {
            through: models.BaseChatbotSolucao,
            foreignKey: 'documento_id',
            otherKey: 'atendimento_id'
        });
        // BaseConhecimento.hasMany(models.DocumentoArquivo, {
        //     foreignKey: 'id_documento',
        //     as: 'DocumentoArquivos'
        // });
        BaseConhecimento.hasMany(models.BaseChatbotSolucao, {
            foreignKey: 'id_documento'
        });
    };

    return BaseConhecimento;
};
