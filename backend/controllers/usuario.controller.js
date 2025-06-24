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
    },

    async trocarSenha(req, res) {
        const { id } = req.params;
        const { senhaAtual, novaSenha } = req.body;

        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
            }

            const novaHash = await bcrypt.hash(novaSenha, 10);
            usuario.senha = novaHash;
            await usuario.save();

            return res.json({ mensagem: 'Senha alterada com sucesso.' });
        } catch (err) {
            console.error('Erro ao trocar senha:', err);
            return res.status(500).json({ mensagem: 'Erro interno ao trocar senha.' });
        }
    }
};

module.exports = UserController;
