// /**
//  * Gerencia a lógica de negócio para os atendimentos do chatbot,
//  * incluindo o registro de interações e o vínculo com as soluções apresentadas.
//  */
//
// const { AtendimentoChatbot, BaseConhecimento, BaseChatbotSolucao, SessaoUsuario } = require('../models');
//
// const AtendimentoController = {
//     /**
//      * @description Inicia um novo registro de atendimento.
//      * @route POST /atendimentos
//      */
//     async criarAtendimento(req, res) {
//         const { id_sessao, pergunta_usuario } = req.body;
//         if (!id_sessao || !pergunta_usuario) {
//             return res.status(400).json({ message: 'Os campos id_sessao e pergunta_usuario são obrigatórios.' });
//         }
//         try {
//             const atendimento = await AtendimentoChatbot.create({ id_sessao, pergunta_usuario });
//             return res.status(201).json(atendimento);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao criar atendimento.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Lista todos os atendimentos registrados.
//      * @route GET /atendimentos
//      */
//     async listarAtendimentos(req, res) {
//         try {
//             const atendimentos = await AtendimentoChatbot.findAll({
//                 include: [SessaoUsuario], // Inclui dados da sessão para mais contexto
//                 order: [['data_inicio', 'DESC']]
//             });
//             return res.status(200).json(atendimentos);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao listar atendimentos.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Busca um atendimento específico pelo seu ID.
//      * @route GET /atendimentos/:id
//      */
//     async buscarAtendimentoPorId(req, res) {
//         try {
//             const atendimento = await AtendimentoChatbot.findByPk(req.params.id, { include: [SessaoUsuario, BaseChatbotSolucao] });
//             if (!atendimento) {
//                 return res.status(404).json({ message: 'Atendimento não encontrado.' });
//             }
//             return res.status(200).json(atendimento);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao buscar atendimento.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Atualiza a resposta fornecida pelo chatbot em um atendimento.
//      * @route PUT /atendimentos/:id/resposta
//      */
//     async atualizarResposta(req, res) {
//         const { id } = req.params;
//         const { resposta_chatbot } = req.body;
//         if (!resposta_chatbot) {
//             return res.status(400).json({ message: 'O campo resposta_chatbot é obrigatório.' });
//         }
//         try {
//             const atendimento = await AtendimentoChatbot.findByPk(id);
//             if (!atendimento) {
//                 return res.status(404).json({ message: 'Atendimento não encontrado.' });
//             }
//             await atendimento.update({ resposta_chatbot });
//             return res.status(200).json(atendimento);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao atualizar resposta.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Busca todas as soluções vinculadas a um atendimento.
//      * @route GET /atendimentos/:id/solucoes
//      */
//     async buscarSolucoesDoAtendimento(req, res) {
//         try {
//             const solucoes = await BaseChatbotSolucao.findAll({
//                 where: { atendimento_id: req.params.id },
//                 include: [BaseConhecimento]
//             });
//             return res.status(200).json(solucoes);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao buscar soluções do atendimento.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Adiciona uma nova solução a um atendimento existente.
//      * @route POST /atendimentos/:id/solucoes
//      */
//     async adicionarSolucaoAoAtendimento(req, res) {
//         const { id } = req.params;
//         const { base_id } = req.body;
//         if (!base_id) {
//             return res.status(400).json({ message: 'O campo base_id é obrigatório.' });
//         }
//         try {
//             const novaSolucao = await BaseChatbotSolucao.create({
//                 atendimento_id: id,
//                 base_id: base_id
//             });
//             return res.status(201).json(novaSolucao);
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao adicionar solução.', error: err.message });
//         }
//     },
//
//     /**
//      * @description Exclui um registro de atendimento.
//      * @route DELETE /atendimentos/:id
//      */
//     async excluirAtendimento(req, res) {
//         try {
//             const atendimento = await AtendimentoChatbot.findByPk(req.params.id);
//             if (!atendimento) {
//                 return res.status(404).json({ message: 'Atendimento não encontrado.' });
//             }
//             // Exclui primeiro as soluções vinculadas, assim evita possíveis erros de chave estrangeira.
//             await BaseChatbotSolucao.destroy({ where: { atendimento_id: req.params.id } });
//             await atendimento.destroy();
//             return res.status(204).send();
//         } catch (err) {
//             return res.status(500).json({ message: 'Erro ao excluir atendimento.', error: err.message });
//         }
//     }
// };
//
// module.exports = AtendimentoController;
