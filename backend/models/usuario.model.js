module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pendente'
        },
        id_perfil: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: false
    });

    Usuario.associate = (models) => {
        Usuario.belongsTo(models.Perfil, {
            foreignKey: 'id_perfil',
            as: 'Perfil'
        });

        Usuario.hasMany(models.BaseConhecimento, { foreignKey: 'usuario_id' });
        Usuario.hasMany(models.SessaoUsuario, { foreignKey: 'usuario_id' });
    };

    return Usuario;
};
