module.exports = (sequelize, DataTypes) => {
    const DocumentoArquivo = sequelize.define('DocumentoArquivo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome_arquivo: DataTypes.STRING,
        id_documento: DataTypes.INTEGER
    }, {
        tableName: 'documento_arquivo',
        timestamps: false
    });

    DocumentoArquivo.associate = (models) => {
        DocumentoArquivo.belongsTo(models.BaseConhecimento, { foreignKey: 'id_documento' });
    };

    return DocumentoArquivo;
};
