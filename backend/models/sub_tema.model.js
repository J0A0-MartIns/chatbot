module.exports = (sequelize, DataTypes) => {
    const Subtema = sequelize.define('Subtema', {
        id_subtema: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        id_tema: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tema',
                key: 'id_tema'
            }
        }
    }, {
        tableName: 'sub_tema',
        timestamps: false
    });

    Subtema.associate = models => {
        Subtema.belongsTo(models.Tema, {
            foreignKey: 'id_tema',
            as: 'tema'
        });
    };

    return Subtema;
};
