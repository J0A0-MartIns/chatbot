const { Profile } = require('../models');

const ProfileController = {
    // 🔹 Lista todos os perfis
    async getAll(req, res) {
        try {
            const perfis = await Profile.findAll();
            return res.json(perfis);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar perfis.', error: err.message });
        }
    },

    // 🔹 Cria um novo perfil
    async create(req, res) {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        try {
            const jaExiste = await Profile.findOne({ where: { nome } });

            if (jaExiste) {
                return res.status(409).json({ message: 'Perfil já existe.' });
            }

            const novoPerfil = await Profile.create({ nome });
            return res.status(201).json({ message: 'Perfil criado com sucesso.', perfil: novoPerfil });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar perfil.', error: err.message });
        }
    },

    // 🔹 Edita um perfil existente
    async update(req, res) {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        try {
            const perfil = await Profile.findByPk(id);
            if (!perfil) return res.status(404).json({ message: 'Perfil não encontrado.' });

            perfil.nome = nome;
            await perfil.save();

            return res.json({ message: 'Perfil atualizado com sucesso.', perfil });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar perfil.', error: err.message });
        }
    },

    // 🔹 Deleta um perfil
    async delete(req, res) {
        const { id } = req.params;

        try {
            const perfil = await Profile.findByPk(id);
            if (!perfil) return res.status(404).json({ message: 'Perfil não encontrado.' });

            await perfil.destroy();
            return res.json({ message: 'Perfil deletado com sucesso.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar perfil.', error: err.message });
        }
    }
};

module.exports = ProfileController;
