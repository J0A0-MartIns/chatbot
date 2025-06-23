const { SessaoUsuario, Usuario, AtendimentoChatbot } = require('../models');

module.exports = {
    async listar(req, res) {
        try {
            const sessoes = await SessaoUsuario.findAll({ include: [Usuario, AtendimentoChatbot] });
            res.json(sessoes);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar sessões' });
        }
    },

    async buscarPorId(req, res) {
        try {
            const sessao = await SessaoUsuario.findByPk(req.params.id, { include: [Usuario, AtendimentoChatbot] });
            if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' });
            res.json(sessao);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar sessão' });
        }
    },

    async criar(req, res) {
        try {
            const sessao = await SessaoUsuario.create(req.body);
            res.status(201).json(sessao);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao criar sessão' });
        }
    },

    async atualizar(req, res) {
        try {
            const sessao = await SessaoUsuario.findByPk(req.params.id);
            if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' });
            await sessao.update(req.body);
            res.json(sessao);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao atualizar sessão' });
        }
    },

    async deletar(req, res) {
        try {
            const sessao = await SessaoUsuario.findByPk(req.params.id);
            if (!sessao) return res.status(404).json({ error: 'Sessão não encontrada' });
            await sessao.destroy();
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: 'Erro ao deletar sessão' });
        }
    }
};