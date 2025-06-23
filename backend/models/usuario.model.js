const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        perfil_id_perfil: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'usuario',
        hooks: {
            beforeCreate: async (usuario) => {
                if (usuario.senha) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.senha = await bcrypt.hash(usuario.senha, salt);
                }
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed('senha')) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.senha = await bcrypt.hash(usuario.senha, salt);
                }
            }
        }
    });

    Usuario.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.senha);
    };

    return Usuario;
};
