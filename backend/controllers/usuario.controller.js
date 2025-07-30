/**
 * Gerencia toda a lógica de negócio para Utilizadores, utilizando um
 * campo 'status' ('pendente', 'ativo', 'inativo') para controlar o estado da conta.
 */

const { Usuario, Perfil } = require('../models');
const bcrypt = require('bcryptjs');

//Remove a senha das resp. da API
const formatUserResponse = (user) => {
    if (!user) return null;
    const userJson = user.toJSON();
    delete userJson.senha;
    return userJson;
};

const UserController = {
    /**
     * Rota de Registo Público: Cria um novo usuário com status 'pendente'.
     * Esse é para a opção de cadastro, na parte de login.
     */
    async criarUsuario(req, res) {
        const { nome, email, senha, id_perfil } = req.body;
        try {
            const emailExists = await Usuario.findOne({ where: { email } });
            if (emailExists) {
                return res.status(409).json({ message: 'Este e-mail já está em uso.' });
            }

            const hash = await bcrypt.hash(senha, 10);
            await Usuario.create({ nome, email, senha: hash, id_perfil, status: 'pendente' });

            return res.status(201).json({ message: 'Solicitação de cadastro enviada com sucesso! Aguardando aprovação.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar solicitação de usuário.', error: err.message });
        }
    },

    /**
     * Rota de Admin: Cria um novo usuário diretamente como 'ativo'.
     */
    async criarUsuarioAtivo(req, res) {
        const { nome, email, id_perfil } = req.body;
        if (!nome || !email || !id_perfil) {
            return res.status(400).json({ message: "Nome, e-mail e perfil são obrigatórios." });
        }
        try {
            const senhaPadrao = nome.toLowerCase().replace(/\s/g, '');
            const hash = await bcrypt.hash(senhaPadrao, 10);

            const novoUsuario = await Usuario.create({ nome, email, senha: hash, id_perfil, status: 'ativo' });

            return res.status(201).json({
                usuario: formatUserResponse(novoUsuario),
                mensagem: `Usuário criado com sucesso! A senha padrão é: "${senhaPadrao}"`
            });

        } catch (err) {
            return res.status(500).json({ message: "Erro ao criar usuário ativo.", error: err.message });
        }
    },

    /**
     * Lista apenas usuários com status 'ativo'.
     */
    async listarUsuarios(req, res) {
        try {
            const users = await Usuario.findAll({
                where: { status: 'ativo' },
                include: [{ model: Perfil, as: 'Perfil' }]
            });
            const formattedUsers = users.map(user => formatUserResponse(user));
            return res.status(200).json(formattedUsers);
        } catch (err) {
            console.error("Erro ao listar usuários:", err);
            return res.status(500).json({ message: 'Erro ao listar usuário.', error: err.message });
        }
    },

    /**
     * Lista todos os usuário com status 'pendente'.
     */
    async listarPendentes(req, res) {
        try {
            const usuariosPendentes = await Usuario.findAll({
                where: { status: 'pendente' },
                include: [{ model: Perfil, as: 'Perfil' }]
            });
            return res.status(200).json(usuariosPendentes.map(user => formatUserResponse(user)));
        } catch (err) {
            console.error("Erro ao listar pendentes:", err);
            return res.status(500).json({ message: 'Erro ao listar usuários pendentes.', error: err.message });
        }
    },

    /**
     * Aprova um usuário, mudando o status de 'pendente' para 'ativo'.
     */
    async aprovarPendente(req, res) {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario || usuario.status !== 'pendente') {
                return res.status(404).json({ message: 'Usuário pendente não encontrado.' });
            }
            usuario.status = 'ativo';
            await usuario.save();
            return res.status(200).json({ message: 'Usuário aprovado com sucesso.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao aprovar usuário.', error: err.message });
        }
    },

    /**
     * Rejeita um usuário pendente, apagando o registo do banco de dados.
     */
    async rejeitarPendente(req, res) {
        const { id } = req.params;
        try {
            const deletadoCount = await Usuario.destroy({ where: { id_usuario: id, status: 'pendente' } });
            if (deletadoCount === 0) {
                return res.status(404).json({ message: 'Solicitação pendente não encontrada.' });
            }
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao rejeitar solicitação.', error: err.message });
        }
    },

    /**
     * Desativa um usuário ativo, mudando o status para 'inativo'. **Revisar**
     */
    async deletarUsuario(req, res) {
        const { id } = req.params;
        try {
            const user = await Usuario.findByPk(id);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

            user.status = 'inativo';
            await user.save();

            return res.status(200).json({ message: 'Usuário desativado com sucesso.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao desativar usuário.', error: err.message });
        }
    },

    /**
     * Atualiza os dados de um usuário ativo.
     */
    async atualizarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, id_perfil } = req.body;
        try {
            const user = await Usuario.findOne({ where: { id_usuario: id, status: 'ativo' }});
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
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
     * Permite que um usuário ativo troque a própria senha dentro da aplicação.
     */
    async trocarSenha(req, res) {
        const { id } = req.params;
        const { senhaAtual, novaSenha } = req.body;
        try {
            const usuario = await Usuario.findOne({ where: { id_usuario: id, status: 'ativo' } });
            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
            }

            usuario.senha = await bcrypt.hash(novaSenha, 10);
            await usuario.save();

            return res.json({ mensagem: 'Senha alterada com sucesso.' });
        } catch (err) {
            return res.status(500).json({ mensagem: 'Erro interno ao trocar senha.' });
        }
    }
};

module.exports = UserController;
