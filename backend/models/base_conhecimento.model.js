module.exports = (sequelize, DataTypes) => {
    const BaseConhecimento = sequelize.define('BaseConhecimento', {
        id_documento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: DataTypes.STRING,
        conteudo: DataTypes.TEXT,
        palavras_chave: DataTypes.STRING,
        data_criacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        ativo: DataTypes.BOOLEAN,
        usuario_id: DataTypes.INTEGER,
        id_subtema: DataTypes.INTEGER
    }, {
        tableName: 'base_conhecimento',
        timestamps: false
    });

    BaseConhecimento.associate = (models) => {
        BaseConhecimento.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
        BaseConhecimento.belongsTo(models.SubTema, { foreignKey: 'id_subtema' });
        BaseConhecimento.hasMany(models.DocumentoArquivo, { foreignKey: 'id_documento' });
        BaseConhecimento.hasMany(models.BaseChatbotSolucao, { foreignKey: 'base_id' });
    };

    return BaseConhecimento;
};
