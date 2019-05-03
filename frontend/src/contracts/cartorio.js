export const abi = '[{"constant":true,"inputs":[{"name":"endereco","type":"address"}],"name":"getAutorizado","outputs":[{"name":"id","type":"uint256"},{"name":"apelido","type":"string"},{"name":"ativo","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"endereco","type":"address"},{"name":"apelido","type":"string"}],"name":"modificaNomeAutorizado","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nome","type":"string"},{"name":"email","type":"string"},{"name":"titulo","type":"string"},{"name":"dataDoCurso","type":"uint256"},{"name":"duracao","type":"uint256"},{"name":"nomeDoInstrutor","type":"string"}],"name":"adicionarCertificado","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"invalidarCertificado","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAutorizadosEnderecos","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"apelido","type":"string"},{"name":"endereco","type":"address"}],"name":"adicionaAutorizado","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCertificadosIndices","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"administrador","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"}],"name":"getCertificado","outputs":[{"name":"nome","type":"string"},{"name":"titulo","type":"string"},{"name":"dataDoCurso","type":"uint256"},{"name":"dataDaTransacao","type":"uint256"},{"name":"duracao","type":"uint256"},{"name":"nomeDoInstrutor","type":"string"},{"name":"enderecoDoAutor","type":"address"},{"name":"valido","type":"bool"},{"name":"dataInvalidacao","type":"uint256"},{"name":"enderecoInvalidador","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"endereco","type":"address"}],"name":"removerAutorizado","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"bytes32"},{"indexed":false,"name":"titulo","type":"string"}],"name":"certificadoAdicionado","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"novoApelido","type":"string"},{"indexed":false,"name":"data","type":"uint256"}],"name":"apelidoModificado","type":"event"}]';
export const enderecoContrato = '0x92A5081b6F95895f01635897Ff86EFaA596763c9';