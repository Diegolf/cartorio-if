const path = require('path'); // Caminho válido independente de plataforma
const fs = require('fs'); // módulo de arquivo de sistema, usado para ler o conetúdo do arquivo
const solc = require('solc'); // Usado para compilar o código solidity

/* Caminho do arquivo .sol a ser compilado. Cada pasta é passada 
   como um argumento separado  
*/
const caminhoDoContrato = path.resolve(__dirname, '..', 'sol', 'cartorio.sol');

// Lê o que há dentro do arquivo .sol
const contrato = fs.readFileSync(caminhoDoContrato, 'utf-8');

const dados = solc.compile(contrato,1).contracts[':Cartorio'];

const contrato_compilado = 
`module.exports = {
    bytecode : '${dados['bytecode']}',
    abi : '${dados['interface']}',
}
`

// Cria um arquivo com o bytecode e a abi do contrato selecionado
fs.writeFile(__dirname+'/.contrato_compilado.js', contrato_compilado, function (err) {
    if (err) 
        return console.log(err);
    console.log('arquivo .contrato_compilado.js criado.');
});