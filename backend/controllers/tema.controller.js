const { Tema } = require('../models');

const TemaController = {
    async criarTema(req, res) {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do tema é obrigatório.' });
        }
        try {
            const tema = await Tema.create({ nome });
            return res.status(201).json(tema);
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Um tema com este nome já existe.' });
            }
            console.log("--- ERRO INESPERADO AO CRIAR TEMA ---");
            console.log("Nome do Erro:", err.name);
            console.log("Mensagem do Erro:", err.message);
            console.log("Stack do Erro:", err.stack);

            return res.status(500).json({ message: 'Erro interno ao criar tema.', error: err.message });
        }
    },

    async listarTemas(req, res) {
        try {
            const temas = await Tema.findAll({ order: [['nome', 'ASC']] });
            return res.status(200).json(temas);
        } catch (err) {
            console.error("ERRO AO LISTAR TEMAS:", err);
            return res.status(500).json({ message: 'Erro ao buscar temas.', error: err.message });
        }
    },

    /**
     * Busca um tema pelo seu ID.
     */
    async buscarTemaPorId(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            return res.status(200).json(tema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar tema.', error: err.message });
        }
    },

    /**
     * Atualiza um tema existente.
     */
    async atualizarTema(req, res) {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do tema é obrigatório.' });
        }
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            await tema.update({ nome });
            return res.status(200).json(tema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar tema.', error: err.message });
        }
    },

    /**
     * Remove um tema.
     */
    async removerTema(req, res) {
        const { id } = req.params;
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            // Adicionar verificação se o tema está em uso antes de apagar
            await tema.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar tema.', error: err.message });
        }
    }
};

module.exports = TemaController;
