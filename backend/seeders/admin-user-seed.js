'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        // --- Etapa 1: Inserir os Perfis ---
        const perfis = [
            { id_perfil: 1, nome: 'Admin' },
            { id_perfil: 2, nome: 'Editor de Conteúdo' },
            { id_perfil: 3, nome: 'Utilizador Comum' }
        ];
        await queryInterface.bulkInsert('perfil', perfis, {
            updateOnDuplicate: ['nome']
        });

        // --- Etapa 2: Inserir as Permissões ---
        const permissoes = [
            'listar_usuarios', 'buscar_usuario_por_id', 'editar_usuario', 'deletar_usuario',
            'criar_usuario', 'gerenciar_perfis', 'gerenciar_permissoes', 'criar_documento',
            'editar_documento', 'deletar_documento', 'publicar_documento', 'gerenciar_categorias',
            'ver_categorias', 'criar_categorias', 'editar_categorias', 'deletar_categorias',
            'listar_pendencias', 'aprovar_pendencia', 'rejeitar_pendencia', 'listar_atendimentos',
            'listar_feedbacks', 'ver_relatorios'
        ].map(nome => ({ nome }));
        await queryInterface.bulkInsert('permissao', permissoes, {
            ignoreDuplicates: true
        });

        // --- Etapa 3: Associar Todas as Permissões ao Admin ---
        const todasAsPermissoes = await queryInterface.sequelize.query(
            `SELECT id_permissao FROM permissao;`, { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const perfilPermissaoData = todasAsPermissoes.map(p => ({
            id_perfil: 1,
            id_permissao: p.id_permissao
        }));
        await queryInterface.bulkInsert('perfil_permissao', perfilPermissaoData, {
            ignoreDuplicates: true
        });

        // --- Etapa 4: Criar o Utilizador Root Admin ---
        const senhaHasheada = await bcrypt.hash('admin123', 10);
        await queryInterface.bulkInsert('usuario', [{
            nome: 'Administrador Principal',
            email: 'root@admin.com',
            senha: senhaHasheada, //admin123
            status: 'ativo',
            id_perfil: 1
        }], {
            updateOnDuplicate: ['nome', 'senha', 'status', 'id_perfil']
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('usuario', { email: 'root@admin.com' }, {});
        await queryInterface.bulkDelete('perfil_permissao', { id_perfil: 1 }, {});
    }
};
