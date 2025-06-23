module.exports = (sequelize, DataTypes) => {
    const Documento = sequelize.define('Documento', {
        nome: DataTypes.STRING,
        tema: DataTypes.STRING,
        microtema: DataTypes.STRING,
        palavrasChave: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        conteudo: DataTypes.TEXT,
        arquivo: DataTypes.STRING,
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'documentos'
    });

    return Documento;
};
