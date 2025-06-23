module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        id_feedback: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        avaliacao: DataTypes.INTEGER,
        atendimento_id: DataTypes.INTEGER
    }, {
        tableName: 'feedback',
        timestamps: false
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.AtendimentoChatbot, { foreignKey: 'atendimento_id' });
        Feedback.hasOne(models.Pendencia, { foreignKey: 'id_feedback' });
    };

    return Feedback;
};
