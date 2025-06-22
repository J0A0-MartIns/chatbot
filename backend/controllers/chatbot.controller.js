const { Atendimento, Feedback, Pendencia } = require('../models');

exports.perguntar = async (req, res) => {
    const { texto_entrada } = req.body;

    //simulação da resposta (substituir por ia posteriormente)
    const resposta = texto_entrada.toLowerCase().includes('exemplo')
        ? 'Resposta encontrada para o termo "exemplo"'
        : null;

    const novo = await Atendimento.create({
        texto_entrada,
        resposta_gerada: resposta || ''
    });

    if (!resposta) {
        const feedback = await Feedback.create({
            atendimento_chatbot_id_atendimento: novo.id_atendimento,
            avaliacao: false
        });

        await Pendencia.create({
            tema: '',
            sub_tema: '',
            feedback_id_feedback_busca: feedback.id_feedback_busca
        });
    }

    res.json({
        atendimento_id: novo.id_atendimento,
        resposta: resposta || null
    });
};

exports.enviarFeedback = async (req, res) => {
    const { atendimento_id, avaliacao } = req.body;

    const feedback = await Feedback.create({
        atendimento_chatbot_id_atendimento: atendimento_id,
        avaliacao
    });

    res.json({ message: 'Feedback salvo com sucesso', feedback });
};
