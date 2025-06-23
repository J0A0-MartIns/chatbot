const { atendimento_chatbot } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const atendimentos = await atendimento_chatbot.findAll();
        res.json(atendimentos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const item = await atendimento_chatbot.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Atendimento não encontrado' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const novo = await atendimento_chatbot.create(req.body);
        res.status(201).json(novo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await atendimento_chatbot.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Atendimento não encontrado' });
        await item.update(req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const item = await atendimento_chatbot.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Atendimento não encontrado' });
        await item.destroy();
        res.json({ message: 'Atendimento excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};