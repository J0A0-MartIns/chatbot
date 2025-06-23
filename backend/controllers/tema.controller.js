const { Tema } = require('../models');

module.exports = {
    async listar(req, res) {
        try {
            const temas = await Tema.findAll();
            res.json(temas);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar temas' });
        }
    },

    async buscarPorId(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) return res.status(404).json({ error: 'Tema não encontrado' });
            res.json(tema);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar tema' });
        }
    },

    async criar(req, res) {
        try {
            const tema = await Tema.create(req.body);
            res.status(201).json(tema);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao criar tema' });
        }
    },

    async atualizar(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) return res.status(404).json({ error: 'Tema não encontrado' });
            await tema.update(req.body);
            res.json(tema);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao atualizar tema' });
        }
    },

    async deletar(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) return res.status(404).json({ error: 'Tema não encontrado' });
            await tema.destroy();
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: 'Erro ao deletar tema' });
        }
    }
};