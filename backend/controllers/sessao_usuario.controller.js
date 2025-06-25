/**
 * Gerencia a lógica de negócio para as sessões de usuário,
 * incluindo listagem por usuário e o processo de logout (finalizar sessão).
 */

const { SessaoUsuario, Usuario, AtendimentoChatbot } = require('../models');

const SessaoController = {
    /**
     * @description Lista TODAS as sessões. Útil para administradores.
     * @route (Não utilizada nas rotas atuais, mas disponível)
     */
    async listar(req, res) {
        try {
            const sessoes = await SessaoUsuario.findAll({ include: [Usuario, AtendimentoChatbot] });
            return res.status(200).json(sessoes);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar sessões', error: err.message });
        }
    },

    /**
     * @description Lista todas as sessões de UM usuário específico.
     * @route GET /sessoes/usuario/:id
     */
    async listarPorUsuario(req, res) {
        const { id } = req.params;
        try {
            const sessoes = await SessaoUsuario.findAll({
                where: { usuario_id: id },
                include: [Usuario, AtendimentoChatbot]
            });
            return res.status(200).json(sessoes);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar sessões do usuário.', error: err.message });
        }
    },

    /**
     * @description Finaliza uma sessão ativa (processo de logout).
     * @route POST /sessoes/logout
     */
    async finalizarSessao(req, res) {
        const { id_sessao } = req.body;

        if (!id_sessao) {
            return res.status(400).json({ message: 'O ID da sessão é obrigatório para o logout.' });
        }

        try {
            const sessao = await SessaoUsuario.findByPk(id_sessao);
            if (!sessao) {
                return res.status(404).json({ message: 'Sessão não encontrada.' });
            }

            sessao.data_fim = new Date();
            await sessao.save();

            return res.status(200).json({ message: 'Logout realizado com sucesso.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao finalizar sessão.', error: err.message });
        }
    },


    // async buscarPorId(req, res) {
    //     try {
    //         const sessao = await SessaoUsuario.findByPk(req.params.id, { include: [Usuario, AtendimentoChatbot] });
    //         if (!sessao) return res.status(404).json({ message: 'Sessão não encontrada' });
    //         res.json(sessao);
    //     } catch (err) {
    //         res.status(500).json({ message: 'Erro ao buscar sessão' });
    //     }
    // },

    async criar(req, res) {
        try {
            const sessao = await SessaoUsuario.create(req.body);
            res.status(201).json(sessao);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar sessão' });
        }
    }
};

module.exports = SessaoController;
