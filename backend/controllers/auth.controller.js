/**
 * Lida com a lógica de autenticação, incluindo a criação e
 * finalização de sessões de usuário.
 */

const { Usuario, Perfil, Permissao, SessaoUsuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    /**
     * @description Autentica um usuário, cria uma nova sessão e retorna um token JWT.
     * @route POST /auth/login
     */
    async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            //Encontra o usuário pelo email, incluindo as informações vinculadas como o perfil e permissões.
            const usuario = await Usuario.findOne({
                where: { email },
                include: {
                    model: Perfil,
                    as: 'Perfil',
                    include: { model: Permissao, as: 'Permissoes' }
                }
            });

            //Validar o usuário e a sua senha
            if (!usuario || usuario.status !== 'ativo') {
                return res.status(401).json({ message: 'Credenciais inválidas ou a sua conta não está ativa.' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            //Cria um novo registo de sessão para o usuário
            await SessaoUsuario.create({ usuario_id: usuario.id_usuario });

            const payload = {
                id: usuario.id_usuario,
                perfil: usuario.Perfil ? usuario.Perfil.nome : null
            };

            const secret = process.env.JWT_SECRET || 'chave_secreta';
            const token = jwt.sign(payload, secret, { expiresIn: '8h' });

            const usuarioParaRetorno = usuario.toJSON();
            delete usuarioParaRetorno.senha;

            //Retorna o token e os dados do usuário.
            return res.status(200).json({
                token,
                usuario: usuarioParaRetorno
            });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
        }
    },

    /**
     * Finaliza a sessão ativa de um usuário, registando a data de logout.
     */
    async logout(req, res) {
        const usuario_id = req.user.id;
        try {
            await SessaoUsuario.update(
                { data_logout: new Date() },
                { where: { usuario_id, data_logout: null } }
            );
            return res.status(200).json({ message: 'Logout realizado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao fazer logout.', error: error.message });
        }
    }
};

module.exports = AuthController;
