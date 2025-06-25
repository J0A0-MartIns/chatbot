const { Usuario, UsuarioPendente, Perfil } = require('../models');
const bcrypt = require('bcryptjs');

// Helper para não retornar a senha
const formatUserResponse = (user) => {
    const userJson = user.toJSON();
    delete userJson.senha;
    return userJson;
};

const UserController = {
    /**
     * @description Cria uma SOLICITAÇÃO para um novo usuário (usuário pendente).
     * @route POST /
     */
    async criarUsuario(req, res) {
        const { nome, email, senha, id_perfil } = req.body;
        try {
            // Verifica se o email já está em uso, tanto em usuários ativos quanto pendentes
            const emailExists = await Usuario.findOne({ where: { email } }) || await UsuarioPendente.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Este e-mail já está em uso.' });
            }

            const novoUsuarioPendente = await UsuarioPendente.create({ nome, email, senha, id_perfil });
            return res.status(201).json({ message: 'Solicitação de cadastro enviada com sucesso! Aguardando aprovação.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar solicitação de usuário.', error: err.message });
        }
    },

    /**
     * @description Lista todos os usuários ativos.
     * @route GET /
     */
    async listarUsuarios(req, res) {
        try {
            const users = await Usuario.findAll({
                include: [{ model: Perfil, as: 'Perfil' }], // Verifique se o alias 'Perfil' está correto na associação
                where: { ativo: true }
            });
            // Formata a resposta para remover a senha de todos os usuários
            const formattedUsers = users.map(user => formatUserResponse(user));
            return res.json(formattedUsers);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar usuários.', error: err.message });
        }
    },

    /**
     * @description Busca um usuário ativo pelo ID.
     * @route GET /:id
     */
    async buscarUsuarioPorId(req, res) {
        const { id } = req.params;
        try {
            const user = await Usuario.findOne({
                where: { id_usuario: id, ativo: true }, // Assumindo que a PK se chama 'id_usuario'
                include: [{ model: Perfil, as: 'Perfil' }]
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            return res.json(formatUserResponse(user));
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar usuário.', error: err.message });
        }
    },

    /**
     * @description Atualiza os dados de um usuário (exceto senha).
     * @route PUT /:id
     */
    async atualizarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, id_perfil } = req.body;
        try {
            const user = await Usuario.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Atualiza os campos
            user.nome = nome || user.nome;
            user.email = email || user.email;
            user.id_perfil = id_perfil || user.id_perfil;

            await user.save();
            return res.json(formatUserResponse(user));
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar usuário.', error: err.message });
        }
    },

    /**
     * @description "Deleta" um usuário (desativa a conta).
     * @route DELETE /:id
     */
    async deletarUsuario(req, res) {
        const { id } = req.params;
        try {
            const user = await Usuario.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Soft delete: apenas desativa o usuário
            user.ativo = false;
            await user.save();

            return res.status(200).json({ message: 'Usuário desativado com sucesso.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao desativar usuário.', error: err.message });
        }
    },

    /**
     * @description Troca a senha do usuário.
     * @route POST /:id/trocar-senha
     */
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