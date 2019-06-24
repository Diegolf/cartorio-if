require('dotenv').config(); 
const HDWalletProvider = require('truffle-hdwallet-provider'); // biblioteca para gerenciar as carteiras
const Web3 = require('web3'); // Portal para conectar às networks da ethereum
const fs = require('fs'); // módulo de arquivo de sistema, usado para ler o conetúdo do arquivo
const { abi, bytecode } = require('./.contrato_compilado.js');

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.URL_NETWORK);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const saldo_da_conta = await web3.eth.getBalance(accounts[0]);

    console.log(`Fazendo o deploy pela conta ${accounts[0]} que possui ${web3.utils.fromWei(saldo_da_conta, 'ether')} Ether(s)`);

    const result = await new web3.eth.Contract(JSON.parse(abi))
        .deploy({ data: '0x' + bytecode, arguments: [] })
        .send({ from: accounts[0] });

    const endereco_contrato = result.options.address;

    console.log(`endereço do contrato: ${endereco_contrato}`);

    // O arquivo aqui gerado será usado pelo frontend para acessar o contrato que foi enviado
    const arquivo_endereco_contrato = `export default '${endereco_contrato}'`

    // Cria um arquivo com o bytecode e a abi do contrato selecionado
    fs.writeFile(__dirname + '/.endereco_contrato.js', arquivo_endereco_contrato, function (err) {
        if (err)
            return console.log(err);
        console.log('arquivo .endereco_contrato.js criado.');
    });
};

deploy();
