module.exports = (sequelize, DataTypes) => {
    const Perfil = sequelize.define('perfil', {
        id_perfil: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: DataTypes.ENUM('administrador', 'operador', 'usuario_final'),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'perfil',
    });

    return Perfil;
};
