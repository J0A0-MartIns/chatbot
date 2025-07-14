/**
 * Lógica de chat com IA (Llama 3) e criação de pendências.
 */

const {AtendimentoChatbot, Feedback, SessaoUsuario, BaseConhecimento, Pendencia, sequelize} = require('../models');
const {Op} = require('sequelize');
const { spawn } = require('child_process');
const path = require('path');

const ChatController = {
    /**
     * @description Recebe uma pergunta, e executa o script python com a ia para buscar a resposta.
     */
    async perguntar(req, res) {
        const { pergunta, id_subtema } = req.body;
        const id_usuario = req.user.id;

        if (!pergunta || !id_subtema || !id_usuario) {
            return res.status(400).json({ message: 'Pergunta, subtema e ID do usuário são obrigatórios.' });
        }

        try {
            const pythonExecutable = process.platform === 'win32'
                ? path.resolve(__dirname, '..', '..', 'ia', 'venv', 'Scripts', 'python.exe')
                : path.resolve(__dirname, '..', '..', 'ia', 'venv', 'bin', 'python');

            const scriptPath = path.resolve(__dirname, '..', '..', 'ia', 'atendimento_resposta.py');

            const pythonProcess = spawn(pythonExecutable, [scriptPath, pergunta, String(id_subtema)]);

            let respostaJsonString = '';
            let erroDaIA = '';

            pythonProcess.stdout.on('data', (data) => {
                respostaJsonString += data.toString();
            });
            pythonProcess.stderr.on('data', (data) => {
                erroDaIA += data.toString();
            });

            pythonProcess.on('close', async (code) => {
                if (code !== 0) {
                    console.error(`[Python Error]: ${erroDaIA}`);
                    return res.status(500).json({ message: 'O serviço de IA encontrou um erro.' });
                }

                try {
                    const respostaDaIA = JSON.parse(respostaJsonString);
                    if (respostaDaIA.error) {
                        throw new Error(respostaDaIA.error);
                    }

                    const [sessao] = await SessaoUsuario.findOrCreate({
                        where: { id_usuario, data_logout: null },
                        defaults: { id_usuario }
                    });

                    const atendimento = await AtendimentoChatbot.create({
                        id_sessao: sessao.id_sessao,
                        pergunta_usuario: pergunta,
                        resposta_chatbot: respostaDaIA.resposta.trim(),
                    });

                    return res.status(200).json({
                        id_atendimento: atendimento.id_atendimento,
                        solucoes: [],
                        resposta: respostaDaIA.resposta.trim(),
                        encontrado: !respostaDaIA.resposta.includes("não encontrei nenhuma informação")
                    });
                } catch (parseError) {
                    console.error("Erro ao interpretar a resposta Python:", parseError, "String recebida:", respostaJsonString);
                    return res.status(500).json({ message: 'Erro ao interpretar a resposta do serviço de IA.' });
                }
            });

        } catch (error) {
            console.error("Erro ao chamar o script de IA:", error);
            return res.status(500).json({ message: 'Erro ao processar pergunta.', error: error.message });
        }
    },

    /**
     * @description Salva o feedback e, se for negativo, cria uma pendência automaticamente.
     */
    async darFeedback(req, res) {
        const {id_atendimento, avaliacao, comentario} = req.body;
        if (id_atendimento === null || avaliacao === undefined) {
            return res.status(400).json({message: 'ID do atendimento e avaliação são obrigatórios.'});
        }

        const transacao = await sequelize.transaction();
        try {
            const novoFeedback = await Feedback.create({
                atendimento_chatbot_id_atendimento: id_atendimento,
                avaliacao: avaliacao,
                comentario: comentario
            }, {transaction: transacao});

            if (avaliacao === false) {
                await Pendencia.create({
                    id_feedback: novoFeedback.id_feedback,
                    motivo: comentario || 'O utilizador não forneceu um motivo.',
                    id_atendimento: id_atendimento
                }, {transaction: transacao});
            }

            await transacao.commit();
            return res.status(201).json({message: 'Feedback registado com sucesso.'});

        } catch (error) {
            await transacao.rollback();
            return res.status(500).json({message: 'Erro ao registar feedback.', error: error.message});
        }
    },

    /**
     * @description Cria uma pendência diretamente (para o cenário em que não há resposta).
     */
    async criarPendenciaDireta(req, res) {
        const {id_atendimento} = req.body;
        if (!id_atendimento) {
            return res.status(400).json({message: 'ID do atendimento é obrigatório.'});
        }
        try {
            await Pendencia.create({
                id_atendimento: id_atendimento,
                motivo: 'O bot não encontrou uma resposta para a pergunta do usuário.'
            });
            return res.status(201).json({message: 'A sua sugestão foi enviada com sucesso!'});
        } catch (error) {
            return res.status(500).json({message: 'Erro ao criar pendência.', error: error.message});
        }
    }
};

module.exports = ChatController;
