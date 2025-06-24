module.exports = (sequelize, DataTypes) => {
    const Tema = sequelize.define('Tema', {
        id_tema: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        tableName: 'tema',
        timestamps: false
    });

    Tema.associate = models => {
        Tema.hasMany(models.Subtema, {
            foreignKey: 'id_tema',
            as: 'subtemas'
        });
    };

    return Tema;
};
