module.exports = (sequelize, DataTypes) => {
    const DocumentoParagrafoEmbedding = sequelize.define('DocumentoParagrafoEmbedding', {
        id_embedding: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_documento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_arquivo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        numero_paragrafo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        conteudo_paragrafo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        embedding: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        tableName: 'documento_paragrafo_embedding',
        timestamps: false
    });

    return DocumentoParagrafoEmbedding;
};
