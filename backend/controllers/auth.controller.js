const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Perfil } = require('../models');
require('dotenv').config();

exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha, tipoPerfil } = req.body;

        const perfil = await Perfil.findOne({ where: { tipo: tipoPerfil } });
        if (!perfil) return res.status(400).json({ message: 'Perfil inválido' });

        const hash = await bcrypt.hash(senha, 10);

        const novo = await Usuario.create({
            nome,
            email,
            senha: hash,
            perfil_id_perfil: perfil.id_perfil
        });

        res.status(201).json({ message: 'Cadastro realizado (pendente de aprovação, se necessário)', usuario: novo });
    } catch (err) {
        res.status(400).json({ message: 'Erro ao cadastrar', erro: err });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({
            where: { email },
            include: [{ model: Perfil, as: 'perfil' }]
        });

        if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ message: 'Senha inválida' });

        const token = jwt.sign({
            id_usuario: usuario.id_usuario,
            perfil: usuario.perfil.tipo,
            nome: usuario.nome
        }, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, perfil: usuario.perfil.tipo, nome: usuario.nome });
    } catch (err) {
        res.status(400).json({ message: 'Erro no login', erro: err });
    }
};
