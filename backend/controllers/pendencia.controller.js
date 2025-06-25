/**
 * Lógica de negócio para as pendências, com a busca de dados corrigida.
 */

const {
    Pendencia,
    AtendimentoChatbot,
    SessaoUsuario,
    Usuario,
} = require('../models');

const PendenciaController = {
    /**
     * @description Lista todas as pendências com detalhes agregados.
     */
    async listarPendencias(req, res) {
        try {
            const pendencias = await Pendencia.findAll({
                include: [
                    {
                        model: AtendimentoChatbot,
                        include: [{
                            model: SessaoUsuario,
                            include: [{
                                model: Usuario,
                                as: 'Usuario',
                                attributes: ['nome']
                            }]
                        }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            //Formata a resposta
            const resultado = pendencias.map(p => {
                if (!p.AtendimentoChatbot) return null;
                return {
                    id_pendencia: p.id_pendencia,
                    pergunta: p.AtendimentoChatbot.pergunta_usuario,
                    resposta: p.AtendimentoChatbot.resposta_chatbot,
                    usuario: p.AtendimentoChatbot.SessaoUsuario?.Usuario?.nome || 'Desconhecido',
                    motivo: p.motivo,
                    data_criacao: p.createdAt
                };
            }).filter(Boolean);

            return res.status(200).json(resultado);
        } catch (err) {
            console.error("Erro ao buscar pendências:", err);
            return res.status(500).json({ message: 'Erro ao buscar pendências.', error: err.message });
        }
    },

    async aprovarPendencia(req, res) {
        //adicionar
    },

    async excluirPendencia(req, res) {
        //adicionar
    }
};

module.exports = PendenciaController;
