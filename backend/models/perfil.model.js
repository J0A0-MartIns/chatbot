module.exports = (sequelize, DataTypes) => {
    const Perfil = sequelize.define('Perfil', {
        id_perfil: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING
    }, {
        tableName: 'perfil',
        timestamps: false
    });

    Perfil.associate = (models) => {
        Perfil.hasMany(models.Usuario, {
            foreignKey: 'id_perfil',
            as: 'Perfil'
        });

        Perfil.belongsToMany(models.Permissao, {
            through: {
                model: models.PerfilPermissao,
                timestamps: false
            },
            foreignKey: 'id_perfil',
            otherKey: 'id_permissao',
            as: 'Permissoes'
        });
    };

    return Perfil;
};
