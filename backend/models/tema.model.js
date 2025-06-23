module.exports = (sequelize, DataTypes) => {
    const Tema = sequelize.define('Tema', {
        id_tema: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING
    }, {
        tableName: 'tema',
        timestamps: false
    });

    Tema.associate = (models) => {
        Tema.hasMany(models.SubTema, { foreignKey: 'id_tema' });
    };

    return Tema;
};
