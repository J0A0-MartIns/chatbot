const { Usuario, UsuarioPendente, Perfil } = require('../models');
const bcrypt = require('bcryptjs');

const UserController = {
    // Lista usuários ativos
    async getAll(req, res) {
        try {
            const users = await Usuario.findAll({
                include: Perfil,
                where: { ativo: 1 }
            });
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar usuários.', error: err.message });
        }
    },

    // Lista solicitações pendentes
    async getPending(req, res) {
        try {
            const pendentes = await UsuarioPendente.findAll({ include: Perfil });
            return res.json(pendentes);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar pendentes.', error: err.message });
        }
    },

    // Aprova um usuário pendente
    async approve(req, res) {
        const { id } = req.params;
        try {
            const pendente = await UsuarioPendente.findByPk(id);
            if (!pendente) return res.status(404).json({ message: 'Solicitação não encontrada.' });

            const hash = await bcrypt.hash(pendente.senha, 10);

            await Usuario.create({
                nome: pendente.nome,
                email: pendente.email,
                senha: hash,
                id_perfil: pendente.id_perfil,
                ativo: 1
            });

            await pendente.destroy();
            return res.json({ message: 'Usuário aprovado e cadastrado.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao aprovar usuário.', error: err.message });
        }
    },

    // Rejeita uma solicitação
    async reject(req, res) {
        const { id } = req.params;
        try {
            const pendente = await UsuarioPendente.findByPk(id);
            if (!pendente) return res.status(404).json({ message: 'Solicitação não encontrada.' });

            await pendente.destroy();
            return res.json({ message: 'Solicitação rejeitada.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao rejeitar.', error: err.message });
        }
    }
};

module.exports = UserController;
