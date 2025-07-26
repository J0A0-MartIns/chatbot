/**
 * Gerencia a lógica de recuperação e redefinição de senha.
 */

const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {enviarEmailRecuperacao} = require("../services/email.service");
const {Op} = require("sequelize");

const gerarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

const SenhaController = {
    /**
     * Inicia o processo de recuperação de senha.
     */
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(200).json({ message: 'Se uma conta com este e-mail existir, um link de recuperação será enviado.' });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const senhaResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const expires = Date.now() + 10 * 60 * 1000;

            usuario.passwordResetToken = senhaResetToken;
            usuario.passwordResetExpires = expires;
            await usuario.save();

            const resetURL = `http://localhost:4200/reset-senha?token=${resetToken}`;
            await enviarEmailRecuperacao(usuario.email, resetURL);

            return res.status(200).json({ message: 'Um link de recuperação foi enviado para o seu e-mail.' });

        } catch (error) {
            console.error("Erro no processo de recuperar senha:", error);
            return res.status(500).json({ message: 'Erro ao processar solicitação.', error: error.message });
        }
    },

    /**
     * Redefine a senha do usuário
     */
    async resetPassword(req, res) {
        const { token } = req.params;
        const { senha } = req.body;

        if (!token || !senha) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        try {
            const usuario = await Usuario.findOne({
                where: {
                    passwordResetToken: hashedToken,
                    passwordResetExpires: { [Op.gt]: Date.now() }
                }
            });

            if (!usuario) {
                return res.status(400).json({ message: 'Token de redefinição de senha inválido ou expirado.' });
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
