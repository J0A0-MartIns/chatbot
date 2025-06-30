/**
 * models/tema.model.js
 *
 * Versão final e robusta do modelo Tema.
 */
module.exports = (sequelize, DataTypes) => {
    const Tema = sequelize.define('Tema', {
        // Garante que o nome do campo no modelo corresponde à coluna no BD
        id_tema: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_tema' // Mapeia explicitamente para a coluna do BD
        },
        nome: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true // Adiciona uma restrição de unicidade para o nome
        }
    }, {
        tableName: 'tema',
        timestamps: false
    });

    Tema.associate = models => {
        Tema.hasMany(models.Subtema, {
            foreignKey: 'id_tema',
            as: 'subtemas'
        });
    };

    return Tema;
};
