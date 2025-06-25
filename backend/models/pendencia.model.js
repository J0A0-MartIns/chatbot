module.exports = (sequelize, DataTypes) => {
    const Pendencia = sequelize.define('Pendencia', {
        id_pendencia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_feedback: {
            type: DataTypes.INTEGER,
            allowNull: true // Permite pendências sem feedback direto (cenário 2)
        },
        // --- CORREÇÃO ---
        // Alterado para TEXT para permitir comentários mais longos.
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // --- ADICIONADO ---
        // Liga a pendência diretamente ao atendimento, o que é mais robusto.
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
        // Adiciona a associação com o Atendimento
        Pendencia.belongsTo(models.AtendimentoChatbot, { foreignKey: 'id_atendimento' });
    };

    return Pendencia;
};
