/**
 * Gerencia a lógica de recuperação e redefinição de senha.
 */

const { Usuario } = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const PasswordController = {
    /**
     * @description Inicia o processo de recuperação de senha.
     * @route POST /password/forgot
     */
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.' });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            //Tempo de expiração do token
            const passwordResetExpires = Date.now() + 10 * 60 * 1000;

            usuario.passwordResetToken = passwordResetToken;
            usuario.passwordResetExpires = passwordResetExpires;
            await usuario.save();

            //Implementar envio de email ........

            return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.' });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao processar solicitação.', error: error.message });
        }
    },

    /**
     * @description Redefine a senha do usuário usando um token.
     * @route POST /password/reset/:token
     */
    async resetPassword(req, res) {
        const { token } = req.params;
        const { senha } = req.body;

        //Transforma em hash o token recebido da URL para comparar com o que está no banco
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        try {
            const usuario = await Usuario.findOne({
                where: {
                    passwordResetToken: hashedToken,
                    passwordResetExpires: { [require('sequelize').Op.gt]: Date.now() } // Verifica se o token não expirou
                }
            });

            if (!usuario) {
                return res.status(400).json({ message: 'Token de redefinição de senha inválido ou expirado.' });
            }

            //Token for válido, atualiza a senha e limpa os campos de reset
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

module.exports = PasswordController;
