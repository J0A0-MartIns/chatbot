/**
 * controllers/auth.controller.js
 *
 * Lida com a lógica de autenticação, como login e registro.
 */

const { Usuario, Perfil, Permissao } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Envolvemos toda a lógica em um objeto para manter o padrão
const AuthController = {
    /**
     * @description Autentica um usuário e retorna um token JWT.
     * @route POST /auth/login
     */
    async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            // 1. Encontrar o usuário pelo email, incluindo seu perfil e permissões.
            const usuario = await Usuario.findOne({
                where: { email },
                include: {
                    model: Perfil,
                    include: { model: Permissao }
                }
            });

            console.log("------------------- [DEBUG LOGIN] -------------------");
            console.log("Senha recebida (do Postman):", `"${senha}"`);
            console.log("Tipo da senha recebida:", typeof senha);
            console.log("Hash do banco de dados:", `"${usuario.senha}"`);
            console.log("Tipo do hash do banco:", typeof usuario.senha);
            console.log("------------------------------------------------------");

            if (!usuario) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // 2. Comparar a senha enviada com a senha "hasheada" no banco.
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // 3. Gerar o token JWT.
            const payload = {
                id: usuario.id_usuario,
                perfil: usuario.Perfil ? usuario.Perfil.nome : null
            };

            const secret = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
            const token = jwt.sign(payload, secret, { expiresIn: '8h' });

            const usuarioParaRetorno = usuario.toJSON();
            delete usuarioParaRetorno.senha;

            // 4. Retornar o token e os dados do usuário.
            return res.status(200).json({
                token,
                usuario: usuarioParaRetorno
            });

        } catch (error) {
            return res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
        }
    }
};

// Exportamos o objeto inteiro
module.exports = AuthController;
