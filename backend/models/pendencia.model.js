module.exports = (sequelize, DataTypes) => {
    const Pendencia = sequelize.define('Pendencia', {
        id_pendencia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_feedback: DataTypes.INTEGER,
        motivo: DataTypes.STRING
    }, {
        tableName: 'pendencia',
        timestamps: false
    });

    Pendencia.associate = (models) => {
        Pendencia.belongsTo(models.Feedback, { foreignKey: 'id_feedback' });
    };

    return Pendencia;
};
