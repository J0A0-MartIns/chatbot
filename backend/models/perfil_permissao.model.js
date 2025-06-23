module.exports = (sequelize, DataTypes) => {
    const PerfilPermissao = sequelize.define('PerfilPermissao', {
        id_perfil: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_permissao: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        tableName: 'perfil_permissao',
        timestamps: false
    });

    return PerfilPermissao;
};
