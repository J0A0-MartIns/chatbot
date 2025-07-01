module.exports = (sequelize, DataTypes) => {
    const SessaoUsuario = sequelize.define('SessaoUsuario', {
        id_sessao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data_login: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        data_logout: DataTypes.DATE,
        id_usuario: DataTypes.INTEGER
    }, {
        tableName: 'sessao_usuario',
        timestamps: false
    });

    SessaoUsuario.associate = (models) => {
        SessaoUsuario.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
        SessaoUsuario.hasMany(models.AtendimentoChatbot, { foreignKey: 'id_sessao' });
    };

    return SessaoUsuario;
};
