/**
 * models/documento_arquivo.model.js
 */
module.exports = (sequelize, DataTypes) => {
    const DocumentoArquivo = sequelize.define('DocumentoArquivo', {
        id_arquivo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome_original: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nome_armazenado: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        caminho_arquivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipo_mime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tamanho_bytes: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        id_documento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'documento_arquivo',
        timestamps: true
    });

    DocumentoArquivo.associate = (models) => {
        DocumentoArquivo.belongsTo(models.BaseConhecimento, { foreignKey: 'id_documento' });
    };

    return DocumentoArquivo;
};