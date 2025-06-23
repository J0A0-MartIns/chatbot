const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
const Perfil = require('./perfil')(sequelize, Sequelize.DataTypes);


Perfil.hasMany(Usuario, { foreignKey: 'perfil_id_perfil' });
Usuario.belongsTo(Perfil, { foreignKey: 'perfil_id_perfil' });

module.exports = {
    sequelize,
    Sequelize,
    Usuario,
    Perfil,
};
