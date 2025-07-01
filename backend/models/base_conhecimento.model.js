/**
 * models/base_conhecimento.model.js
 */
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
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        id_subtema: DataTypes.INTEGER,
        id_usuario: DataTypes.INTEGER
    }, {
        tableName: 'base_conhecimento',
        timestamps: false
    });

    BaseConhecimento.associate = (models) => {
        BaseConhecimento.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario',
            as: 'Usuario'
        });
        BaseConhecimento.belongsTo(models.Subtema, {
            foreignKey: 'id_subtema',
            as: 'Subtema'
        });
        BaseConhecimento.hasMany(models.DocumentoArquivo, {
            foreignKey: 'id_documento',
            as: 'DocumentoArquivos'
        });

        BaseConhecimento.belongsToMany(models.AtendimentoChatbot, {
            through: models.BaseChatbotSolucao,
            foreignKey: 'id_documento',
            otherKey: 'id_atendimento'
        });
    };

    return BaseConhecimento;
};