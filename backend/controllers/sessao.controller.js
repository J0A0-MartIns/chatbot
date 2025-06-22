const { SessaoUsuario } = require('../models');

// Inicia uma nova sessão
exports.iniciarSessao = async (usuario_id) => {
    const novaSessao = await SessaoUsuario.create({
        data_login: new Date(),
        usuario_id_usuario: usuario_id
    });
    return novaSessao;
};

// Finaliza a sessão mais recente do usuário
exports.finalizarSessao = async (req, res) => {
    const usuario_id = req.usuario.id_usuario;

    const ultimaSessao = await SessaoUsuario.findOne({
        where: { usuario_id_usuario: usuario_id, data_logout: null },
        order: [['data_login', 'DESC']]
    });

    if (!ultimaSessao) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
    }

    ultimaSessao.data_logout = new Date();
    await ultimaSessao.save();

    res.json({ message: 'Sessão finalizada com sucesso', sessao: ultimaSessao });
};

// Listar sessões de um usuário
exports.listarPorUsuario = async (req, res) => {
    const { id } = req.params;

    const sessoes = await SessaoUsuario.findAll({
        where: { usuario_id_usuario: id },
        order: [['data_login', 'DESC']]
    });

    res.json(sessoes);
};
