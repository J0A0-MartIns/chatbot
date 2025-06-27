module.exports = (sequelize, DataTypes) => {
    const Permissao = sequelize.define('Permissao', {
        id_permissao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING
    }, {
        tableName: 'permissao',
        timestamps: false
    });

    Permissao.associate = (models) => {
        Permissao.belongsToMany(models.Perfil, {
            through: 'perfil_permissao',
            foreignKey: 'id_permissao',
            otherKey: 'id_perfil',
            as: 'Perfis'
        });
    };

    return Permissao;
};
