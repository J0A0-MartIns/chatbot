/**
 * Lida com a lógica de autenticação, incluindo a criação e
 * finalização de sessões de usuário.
 */

const { Usuario, Perfil, SessaoUsuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    /**
     * Autentica um usuário, cria uma nova sessão e retorna um token JWT.
     */
    async login(req, res) {
        const { email, senha } = req.body;
        try {
            const usuario = await Usuario.findOne({
                where: { email },
                include: [{
                    model: Perfil,
                    as: 'Perfil'
                }]
            });

            if (!usuario || usuario.status !== 'ativo') {
                return res.status(401).json({ message: 'Credenciais inválidas ou a sua conta não está ativa.' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            await SessaoUsuario.update(
                { data_logout: new Date() },
                { where: { id_usuario: usuario.id_usuario, data_logout: null } }
            );

            const payload = { id: usuario.id_usuario, perfil: usuario.Perfil?.nome };
            const secret = process.env.JWT_SECRET || 'chave_secreta';
            const token = jwt.sign(payload, secret, { expiresIn: '8h' });

            await SessaoUsuario.create({ id_usuario: usuario.id_usuario, token: token });

            const usuarioParaRetorno = usuario.toJSON();
            delete usuarioParaRetorno.senha;

            return res.status(200).json({ token, usuario: usuarioParaRetorno });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
        }
    },

    /**
     * Finaliza a sessão ativa de um usuário, registando a data de logout.
     */
    async logout(req, res) {
        const id_usuario = req.user.id;
        try {
            await SessaoUsuario.update(
                { data_logout: new Date() },
                { where: { id_usuario, data_logout: null } }
            );
            return res.status(200).json({ message: 'Logout realizado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao fazer logout.', error: error.message });
        }
    }
};

module.exports = AuthController;
