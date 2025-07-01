const { base_chatbot_solucao: base_chatbot } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const { atendimento_id_atendimento, base_conhecimento_id_documento } = req.body;

            const novo = await base_chatbot.create({
                atendimento_id_atendimento,
                base_conhecimento_id_documento
            });
            res.status(201).json(novo);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar relação solução-chatbot.' });
        }
    },

    async list(req, res) {
        try {
            const lista = await base_chatbot.findAll();
            res.json(lista);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar relações.' });
        }
    },

    async delete(req, res) {
        try {
            const { atendimento_id_atendimento, base_conhecimento_id_documento } = req.params;

            const deletado = await base_chatbot.destroy({
                where: {
                    atendimento_id_atendimento,
                    base_conhecimento_id_documento
                }
            });

            if (!deletado) return res.status(404).json({ error: 'Relação não encontrada.' });
            res.json({ message: 'Relação deletada com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar relação.' });
        }
    }
};
