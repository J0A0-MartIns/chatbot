/**
 * Gerencia a lógica de recuperação e redefinição de senha.
 */

const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const {enviarEmailRecuperacao} = require("../services/email.service");
const {Op} = require("sequelize");

const gerarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

const SenhaController = {
    /**
     * @description Inicia o processo de recuperação de senha.
     */
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um código de recuperação será enviado.' });
            }

            const resetCode = gerarCodigo();
            const hashedCode = await bcrypt.hash(resetCode, 10);
            const expires = Date.now() + 10 * 60 * 1000;

            usuario.passwordResetToken = hashedCode;
            usuario.passwordResetExpires = expires;
            await usuario.save();

            await enviarEmailRecuperacao(usuario.email, resetCode);

            return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.' });

        } catch (error) {
            console.error("Erro no processo de recuperar senha:", error);
            return res.status(500).json({ message: 'Erro ao processar solicitação.', error: error.message });
        }
    },

    /**
     * @Redefine a senha do usuário
     */
    async resetPassword(req, res) {
        const { email, code, senha } = req.body;
        if (!email || !code || !senha) {
            return res.status(400).json({ message: 'E-mail, código e nova senha são obrigatórios.' });
        }

        try {
            const usuario = await Usuario.findOne({
                where: {
                    email,
                    passwordResetExpires: { [Op.gt]: Date.now() }
                }
            });

            if (!usuario) {
                return res.status(400).json({ message: 'Código inválido, expirado ou e-mail incorreto.' });
            }

            const codigoValido = await bcrypt.compare(code, usuario.passwordResetToken);

            if (!codigoValido) {
                return res.status(400).json({ message: 'Código de redefinição de senha inválido.' });
            }

            usuario.senha = await bcrypt.hash(senha, 10);
            usuario.passwordResetToken = null;
            usuario.passwordResetExpires = null;
            await usuario.save();

            return res.status(200).json({ message: 'Senha redefinida com sucesso!' });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao redefinir senha.', error: error.message });
        }
    }
};

module.exports = SenhaController;
