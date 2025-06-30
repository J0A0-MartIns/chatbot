module.exports = (sequelize, DataTypes) => {
    const Subtema = sequelize.define('Subtema', {
        id_subtema: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: DataTypes.STRING(45), allowNull: false },
        id_tema: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'sub_tema',
        timestamps: false
    });

    Subtema.associate = models => {
        Subtema.belongsTo(models.Tema, { foreignKey: 'id_tema', as: 'tema' });
        Subtema.hasMany(models.BaseConhecimento, { foreignKey: 'id_subtema', as: 'Documentos' });
    };

    return Subtema;
};
