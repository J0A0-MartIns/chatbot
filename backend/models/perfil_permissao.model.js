/**
 * models/perfil_permissao.model.js
 *
 * Modelo para a tabela de junção que associa Perfis a Permissões.
 */
module.exports = (sequelize, DataTypes) => {
    const PerfilPermissao = sequelize.define('PerfilPermissao', {
        id_perfil: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'perfil',
                key: 'id_perfil'
            }
        },
        id_permissao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'permissao',
                key: 'id_permissao'
            }
        }
    }, {
        tableName: 'perfil_permissao',
        timestamps: false
    });

    // Esta tabela de junção não precisa de uma função 'associate'.
    return PerfilPermissao;
};
