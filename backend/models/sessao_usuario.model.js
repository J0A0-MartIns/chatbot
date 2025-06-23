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
        usuario_id: DataTypes.INTEGER,
        atendimento_id: DataTypes.INTEGER
    }, {
        tableName: 'sessao_usuario',
        timestamps: false
    });

    SessaoUsuario.associate = (models) => {
        SessaoUsuario.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
        SessaoUsuario.belongsTo(models.AtendimentoChatbot, { foreignKey: 'atendimento_id' });
    };

    return SessaoUsuario;
};
