const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada

const { abi, bytecode } = require('../src/contract/.contrato_compilado.js'); // Recebe as propriedades (informadas pelas chaves do dicionário) retornadas pelo arquivo

let accounts;
let cartorio;

// Executado uma vez antes do "describe"
before(async () => {
    // Pega uma lista de accounts de forma assíncrona
    accounts = await web3.eth.getAccounts();

    // Use one of those account to deploy the contract
    // Ensina a web3 quais métodos o contrato Inbox tem (pela abi)
    cartorio = await new web3.eth.Contract(JSON.parse(abi))

        // Diz à web3 que queremos adicionar uma cópia desse contrato
        .deploy({ data: bytecode })

        // Instrui a web3 à enviar uma transação que cria esse contrato
        .send({ from: accounts[0], gas: '2000000' });

});

describe('Testes', () => {

    it('Contrato foi enviado com sucesso', () => {
        assert(cartorio.options.address);
    });

    it('O endereço da conta que fez o deploy foi armazenado como administrador', async () => {
        const administrador = await cartorio.methods.administrador().call();
        assert(administrador == accounts[0]);
    });

    it('Adiministrador adicionar uma conta como autorizada', async () => {
        await cartorio.methods.adicionaAutorizado('Autorizado1', accounts[1])
            .send({ from: accounts[0], gas: '2000000' });

        const dados = await cartorio.methods.getAutorizado(accounts[1]).call();

        assert(dados.apelido == 'Autorizado1');
        assert(dados.ativo == true);
    });

    // TODO Multiplos autorizados podem ser adicionados
    // TODO accounts aleatórias não podem adicionar autorizados
    // TODO accounts aleatórias não podem remover autorizados
    // TODO Adiministrador pode remover autorizados

    it('Autorizados podem adicionar certificados', async () => {
        let evento = cartorio.events.certificadoAdicionado();
        evento.on('data', async (res) => {
            const id = res.returnValues.id

            const certificado = await cartorio.methods.getCertificado(id).call({ from: accounts[0] });

            console.log(certificado);

            assert(certificado.nome == 'Desenvolvendo testes com Mocha');

            evento.on('data',()=>{});
        });

        cartorio.methods.adicionarCertificado(
            'Desenvolvendo testes com Mocha', 'email', 'titulo', 11, 120, 'nomeDoInstrutor'
        ).send({ from: accounts[1], gas: '2000000' });
        cartorio.methods.adicionarCertificado(
            'Desenvolvendo testes com Mocha', 'email', 'titulo', 11, 120, 'nomeDoInstrutor'
        ).send({ from: accounts[1], gas: '2000000' });

    });

    it('Administrador pode adicionar certificados', async () => {

    });
    // TODO Testar o retorno do adicionar certificado

    it('Teste', () => {

        // await cartorio.methods.manager(<argumentos>).call();
        assert(true);
    });

});