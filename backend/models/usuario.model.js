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

        // --- CORREÇÃO ---
        // Substituímos a flag 'ativo' pelo campo 'status'
        status: {
            type: DataTypes.STRING, // Em PostgreSQL, você poderia usar DataTypes.ENUM('ativo', 'pendente', 'inativo')
            allowNull: false,
            defaultValue: 'pendente'
        },
        id_perfil: DataTypes.INTEGER
    }, {
        tableName: 'usuario',
        timestamps: false
    });

Usuario.associate = (models) => {
        Usuario.belongsTo(models.Perfil, { foreignKey: 'id_perfil' });
        Usuario.hasMany(models.BaseConhecimento, { foreignKey: 'usuario_id' });
        Usuario.hasMany(models.SessaoUsuario, { foreignKey: 'usuario_id' });
    };

    return Usuario;
};
