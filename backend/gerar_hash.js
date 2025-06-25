// Este script gera um hash bcrypt para uma senha fornecida como argumento na linha de comando.
// É uma ferramenta de depuração útil para garantir que os hashes estão corretos.

const bcrypt = require('bcryptjs');

// Pega a senha do terceiro argumento da linha de comando.
// Exemplo de uso: node gerar_hash.js suaSenhaSuperSecreta
const senha = process.argv[2];

if (!senha) {
    console.error('ERRO: Por favor, forneça uma senha como argumento.');
    console.error('Exemplo de uso: node gerar_hash.js quero_quero_admin');
    process.exit(1); // Sai do script se nenhuma senha for fornecida
}

// Gera um "salt" com custo 10, que é um bom padrão de segurança.
const salt = bcrypt.genSaltSync(10);
// Gera o hash final usando a senha e o salt.
const hash = bcrypt.hashSync(senha, salt);

console.log('--- Geração de Hash Bcrypt ---');
console.log('Senha Original Fornecida:', senha);
console.log('Hash Gerado:', hash);
console.log('\nCOPIE O HASH GERADO ACIMA E COLE NO SEU SCRIPT SQL.');
