module.exports = (sequelize, DataTypes) => {
    const SubTema = sequelize.define('SubTema', {
        id_subtema: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        id_tema: DataTypes.INTEGER
    }, {
        tableName: 'sub_tema',
        timestamps: false
    });

    SubTema.associate = (models) => {
        SubTema.belongsTo(models.Tema, { foreignKey: 'id_tema' });
        SubTema.hasMany(models.BaseConhecimento, { foreignKey: 'id_subtema' });
    };

    return SubTema;
};
