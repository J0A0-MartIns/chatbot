/**
 * models/sessao_usuario.model.js
 */
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
        usuario_id: DataTypes.INTEGER
        // --- CORREÇÃO: A coluna 'atendimento_id' foi removida.
    }, {
        tableName: 'sessao_usuario',
        timestamps: false
    });

    SessaoUsuario.associate = (models) => {
        SessaoUsuario.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });

        // --- CORREÇÃO: Uma sessão agora tem MUITOS atendimentos.
        SessaoUsuario.hasMany(models.AtendimentoChatbot, { foreignKey: 'id_sessao' });
    };

    return SessaoUsuario;
};
