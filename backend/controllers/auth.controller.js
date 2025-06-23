const { Usuario, Perfil } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            const usuario = await Usuario.findOne({
                where: { email },
                include: { model: Perfil }
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            if (!usuario.ativo) {
                return res.status(403).json({ message: 'Usuário pendente de aprovação.' });
            }

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (!senhaCorreta) {
                return res.status(401).json({ message: 'Senha incorreta.' });
            }

            const token = jwt.sign({ id: usuario.id_usuario, perfil: usuario.id_perfil }, process.env.JWT_SECRET, {
                expiresIn: '4h'
            });

            return res.json({
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil.nome
                }
            });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao autenticar.', error: err.message });
        }
    }
};

module.exports = AuthController;
