/**
 * models/perfil.model.js
 *
 * Versão final e correta, alinhada com a lógica de uma única tabela de utilizadores.
 */
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

        // Associação com Permissões
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
