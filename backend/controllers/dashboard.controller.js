const { Usuario, Perfil, Atendimento, Feedback, Pendencia } = require('../models');
const { Op } = require('sequelize');

exports.resumoGeral = async (req, res) => {
    try {
        const totalUsuarios = await Usuario.count({ where: { aprovado: true } });

        const usuariosPorPerfil = await Usuario.findAll({
            attributes: ['perfil_id_perfil', [sequelize.fn('COUNT', 'id_usuario'), 'quantidade']],
            where: { aprovado: true },
            group: ['perfil_id_perfil'],
            include: { model: Perfil, as: 'perfil', attributes: ['tipo'] }
        });

        const totalAtendimentos = await Atendimento.count();

        const totalPendencias = await Pendencia.count();

        const totalFeedbacks = await Feedback.count();
        const totalSatisfatorios = await Feedback.count({ where: { avaliacao: true } });
        const totalInsatisfatorios = totalFeedbacks - totalSatisfatorios;

        res.json({
            totalUsuarios,
            usuariosPorPerfil: usuariosPorPerfil.map(item => ({
                perfil: item.perfil.tipo,
                quantidade: item.dataValues.quantidade
            })),
            totalAtendimentos,
            totalPendencias,
            totalFeedbacks,
            totalSatisfatorios,
            totalInsatisfatorios
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao gerar dashboard', erro: err.message });
    }
};
