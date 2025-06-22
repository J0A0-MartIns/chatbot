const { Usuario, Perfil } = require('../models');
const bcrypt = require('bcryptjs');

//lista todos os cadastrados
exports.listarTodos = async (req, res) => {
    const lista = await Usuario.findAll({
        where: { aprovado: true },
        include: { model: Perfil, as: 'perfil' }
    });
    res.json(lista);
};

//listar usuários pendentes de aprovação
exports.listarPendentes = async (req, res) => {
    const lista = await Usuario.findAll({
        where: { aprovado: false },
        include: { model: Perfil, as: 'perfil' }
    });
    res.json(lista);
};

//aprovar criação de conta
exports.aprovar = async (req, res) => {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });

    usuario.aprovado = true;
    await usuario.save();

    res.json({ message: 'Usuário aprovado', usuario });
};

// rejeitar solicitação de criação de conta
exports.rejeitar = async (req, res) => {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });

    await usuario.destroy();
    res.json({ message: 'Usuário rejeitado e removido' });
};

//atualizar dados do usuário
exports.atualizar = async (req, res) => {
    const { nome, email, senha, tipoPerfil } = req.body;
    const id = req.params.id;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });

    const perfil = await Perfil.findOne({ where: { tipo: tipoPerfil } });
    if (!perfil) return res.status(400).json({ message: 'Perfil inválido' });

    usuario.nome = nome;
    usuario.email = email;
    usuario.perfil_id_perfil = perfil.id_perfil;

    if (senha) {
        const hash = await bcrypt.hash(senha, 10);
        usuario.senha = hash;
    }

    await usuario.save();
    res.json({ message: 'Usuário atualizado com sucesso', usuario });
};

//buscar por id do usuário
exports.buscar = async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, {
        include: { model: Perfil, as: 'perfil' }
    });

    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(usuario);
};

//excluir usuário
exports.deletar = async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });

    await usuario.destroy();
    res.json({ message: 'Usuário excluído com sucesso' });
};
