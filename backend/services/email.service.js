/**
 * Serviço para o envio de e-mails usando Nodemailer.
 */

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
transporter.verify(function(error, success) {
    if (error) {
        console.error("Erro ao verificar transporter:", error);
    } else {
        console.log("Servidor pronto para envio de e-mails");
    }
});

/**
 * Envia um e-mail de recuperação de senha.
 */
const enviarEmailRecuperacao = async (para, codigo) => {
    const mailOptions = {
        from: `"Suporte" <${process.env.EMAIL_USER}>`,
        to: para,
        subject: 'Código de Recuperação de Senha',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Recuperação de Senha</h2>
                <p>Olá,</p>
                <p>Você solicitou a redefinição da sua senha. Use o código abaixo para continuar o processo. Este código é válido por 10 minutos.</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                    ${codigo}
                </p>
                <p>Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.</p>
                <p>Atenciosamente,<br>Equipa de Suporte QQTech</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de recuperação enviado com sucesso para: ${para}`);
    } catch (error) {
        console.error(`Erro ao enviar e-mail para ${para}:`, error);
        throw new Error('Não foi possível enviar o e-mail de recuperação.');
    }
};

module.exports = {
    enviarEmailRecuperacao
};
