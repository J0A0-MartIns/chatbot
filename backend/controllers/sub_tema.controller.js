const { sub_tema } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const data = await sub_tema.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await sub_tema.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Subtema não encontrado' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const novo = await sub_tema.create(req.body);
        res.status(201).json(novo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await sub_tema.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Subtema não encontrado' });
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const item = await sub_tema.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Subtema não encontrado' });
        await item.destroy();
        res.json({ message: 'Subtema excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
