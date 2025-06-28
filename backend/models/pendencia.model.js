module.exports = (sequelize, DataTypes) => {
    const Pendencia = sequelize.define('Pendencia', {
        id_pendencia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_feedback: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_atendimento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'pendencia',
        timestamps: true
    });

    Pendencia.associate = (models) => {
        Pendencia.belongsTo(models.Feedback, { foreignKey: 'id_feedback' });
        Pendencia.belongsTo(models.AtendimentoChatbot, { foreignKey: 'id_atendimento' });
    };

    return Pendencia;
};
