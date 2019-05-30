const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada

const { abi, bytecode } = require('../src/contract/.contrato_compilado.js'); // Recebe as propriedades (informadas pelas chaves do dicionário) retornadas pelo arquivo

let accounts;
let cartorio;
let certificados = {};
let certificadoAdicionadoConta1;
let admAddress;
let rootAddress;

// Executado uma vez antes do "describe"
before(async () => {
    // Pega uma lista de accounts de forma assíncrona
    accounts = await web3.eth.getAccounts();
    admAddress = accounts[0];
    rootAddress = accounts[8];

    // Use one of those account to deploy the contract
    // Ensina a web3 quais métodos o contrato Inbox tem (pela abi)
    cartorio = await new web3.eth.Contract(JSON.parse(abi))

        // Diz à web3 que queremos adicionar uma cópia desse contrato
        .deploy({ data: bytecode })

        // Instrui a web3 à enviar uma transação que cria esse contrato
        .send({ from: rootAddress, gas: '2000000' });

});

describe('Testes', () => {

    it('Contrato foi enviado com sucesso', () => {
        assert(cartorio.options.address);
    });

    it('O endereço da conta que fez o deploy foi armazenado como root', async () => {
        const root = await cartorio.methods.root().call();
        assert(root == rootAddress);
    });

    it('Root pode modificar o administrador', async () => {

        await cartorio.methods.setAdministrador(admAddress).send({ from: rootAddress, gas: '2000000' });

        const adm = await cartorio.methods.administrador().call({ from: rootAddress });

        assert(adm == admAddress);
    });

    it('Outras contas não podem modificar o administrador', async () => {

        try{
            await cartorio.methods.setAdministrador(admAddress).send({ from: accounts[2], gas: '2000000' });
            assert(false);
        
        }catch(e){
            assert(e.results[e.hashes[0]].error == 'revert');
        }

    });

    it('Root pode modificar a senha geral', async () => {
        const senha = web3.utils.sha3('Senha');

        await cartorio.methods.setSenha(senha).send({ from: rootAddress, gas: '2000000' });

        const senhaArmazenada = await cartorio.methods.getSenha().call({ from: admAddress });

        assert(senha == senhaArmazenada);

    });

    it('Administrador pode modificar a senha geral', async () => {
        const senha = web3.utils.sha3('NovaSenha');

        await cartorio.methods.setSenha(senha).send({ from: admAddress, gas: '2000000' });

        const senhaArmazenada = await cartorio.methods.getSenha().call({ from: admAddress });

        assert(senha == senhaArmazenada);
    });
    
    it('Outras contas não podem modificar a senha geral', async () => {
        const senha = web3.utils.sha3('SenhaOutras');

        try{
            await cartorio.methods.setSenha(senha).send({ from: accounts[3], gas: '2000000' });
            assert(false);
        }catch(e){
            assert(e.results[e.hashes[0]].error == 'revert');
        }

    });

    it('Administrador pode adicionar uma conta como autorizada', async () => {
        await cartorio.methods.adicionaAutorizado('Autorizado1', accounts[1])
            .send({ from: admAddress, gas: '2000000' });

        const dados = await cartorio.methods.getAutorizado(accounts[1]).call({ from: admAddress });

        assert(dados.apelido == 'Autorizado1');
        assert(dados.ativo == true);
    });

    it('Multiplos autorizados podem ser adicionados', async () => {
        await cartorio.methods.adicionaAutorizado('Autorizado2', accounts[2])
            .send({ from: admAddress, gas: '2000000' });

        const dados2 = await cartorio.methods.getAutorizado(accounts[2]).call({ from: admAddress });

        await cartorio.methods.adicionaAutorizado('Autorizado3', accounts[3])
            .send({ from: admAddress, gas: '2000000' });

        const dados3 = await cartorio.methods.getAutorizado(accounts[3]).call({ from: admAddress });

        await cartorio.methods.adicionaAutorizado('Autorizado4', accounts[4])
            .send({ from: admAddress, gas: '2000000' });

        const dados4 = await cartorio.methods.getAutorizado(accounts[4]).call({ from: admAddress });

        assert(dados2.apelido == 'Autorizado2');
        assert(dados2.ativo == true);
        assert(dados3.apelido == 'Autorizado3');
        assert(dados3.ativo == true);
        assert(dados4.apelido == 'Autorizado4');
        assert(dados4.ativo == true);

    });

    it('Contas aleatórias não podem adicionar autorizados', async () => {
        try {
            await cartorio.methods.adicionaAutorizado('Autorizado5', accounts[5])
                .send({ from: accounts[3], gas: '2000000' });

            assert(false);
        } catch (e) {
            assert(e.results[e.hashes[0]].error == 'revert');
        }
    });

    it('Adiministrador pode remover autorizados', async () => {
        await cartorio.methods.removerAutorizado(accounts[4])
            .send({ from: admAddress, gas: '2000000' });

        const dadosAutorizado4 = await cartorio.methods.getAutorizado(accounts[4])
            .call({ from: admAddress });

        assert(dadosAutorizado4.ativo == false);

    });

    it('Contas aleatórias não podem remover autorizados', async () => {
        try {
            await cartorio.methods.removerAutorizado(accounts[3])
                .send({ from: accounts[2], gas: '2000000' });

            assert(false);
        } catch (e) {
            assert(e.results[e.hashes[0]].error == 'revert');
        }
    });

    it('Autorizados podem adicionar certificados', async () => {
        let evento = cartorio.events.certificadoAdicionado();
        const nome = 'FulanoDeTal';
        let adicionado = false;

        // Começa a escutar os eventos do contrato
        evento.on('data', async (res) => {
            certificados[res.returnValues.id] = res.returnValues.nome;
            if (res.returnValues.nome == nome) {
                const id = res.returnValues.id
                certificadoAdicionadoConta1 = id;

                const certificado = await cartorio.methods.getCertificado(id).call({ from: admAddress });

                if (certificado.nome == nome) adicionado = true;
            }
        });

        await cartorio.methods.adicionarCertificado(
            nome, 'email', 'Desenvolvendo testes com Mocha', 1, 120, 'nomeDoInstrutor'
        ).send({ from: accounts[1], gas: '2000000' });
        await cartorio.methods.adicionarCertificado(
            'nome', 'email', 'Desenvolvendo testes com Mocha 2', 2, 120, 'nomeDoInstrutor'
        ).send({ from: accounts[1], gas: '2000000' });

        evento.unsubscribe();
        assert(adicionado);
    });

    it('Administrador pode adicionar certificados', async () => {
        let evento = cartorio.events.certificadoAdicionado();
        const nome = 'DonaAlgumaCoisa';
        let adicionado = false;

        // Começa a escutar os eventos do contrato
        evento.on('data', async (res) => {
            certificados[res.returnValues.id] = res.returnValues.nome;
            if (res.returnValues.nome == nome) {
                const id = res.returnValues.id

                const certificado = await cartorio.methods.getCertificado(id).call({ from: admAddress });

                if (certificado.nome == nome) adicionado = true;
            }
        });

        await cartorio.methods.adicionarCertificado(
            nome, 'email', 'Certificado adicionado pelo adminsitrador', 1, 120, 'nomeDoInstrutor'
        ).send({ from: admAddress, gas: '2000000' });
        await cartorio.methods.adicionarCertificado(
            'nome', 'email', 'Certificado adicionado pelo adminsitrador 2', 2, 120, 'nomeDoInstrutor'
        ).send({ from: admAddress, gas: '2000000' });


        evento.unsubscribe();
        assert(adicionado);
    });

    it('Contas invalidadas não podem adicionar certificados', async () => {

        try {
            await cartorio.methods.adicionarCertificado(
                'nome', 'email', 'Certificado adicionado por uma conta inválida', 1, 120, 'nomeDoInstrutor'
            ).send({ from: accounts[4], gas: '2000000' });

            assert(false);
        } catch (e) {
            assert(e.results[e.hashes[0]].error == 'revert');
        }

    });

    it('O Administrador pode invalidar qualquer certificado', async () => {

        const idCertificado1 = Object.keys(certificados)[1];

        await cartorio.methods.invalidarCertificado(idCertificado1)
            .send({ from: admAddress, gas: '2000000' });

        const certificado1 = await cartorio.methods.getCertificado(idCertificado1)
            .call({ from: admAddress });

        assert(certificado1.valido == false);
    });

    it('Autorizado pode invalidar certificados que adicionou', async () => {

        await cartorio.methods.invalidarCertificado(certificadoAdicionadoConta1)
            .send({ from: accounts[1], gas: '2000000' });

        const certificado = await cartorio.methods.getCertificado(certificadoAdicionadoConta1)
            .call({ from: admAddress });

        assert(certificado.valido == false);
    });

    it('Autorizado não pode invalidar certificados adicionados por outros', async () => {

        const idCertificado3 = Object.keys(certificados)[3];

        try {
            await cartorio.methods.invalidarCertificado(idCertificado3)
                .send({ from: accounts[1], gas: '2000000' });

            asert(false);
        } catch (e) {
            assert(e.results[e.hashes[0]].error == 'revert');
        }
        const certificado3 = await cartorio.methods.getCertificado(idCertificado3)
            .call({ from: admAddress });

        assert(certificado3.valido == true);
    });

    it('Evento de modificar o nome de um autorizado é executado corretamente', async () => {

        const novoNome = 'Outro nome';

        await cartorio.methods.modificaNomeAutorizado(accounts[1], novoNome)
            .send({ from: admAddress, gas: '2000000' });

        const autorizado1 = await cartorio.methods.getAutorizado(accounts[1])
            .call({ from: admAddress });

        assert(autorizado1.apelido == novoNome);
    });

    it('Contas aleatórias não podem modificar o nome de um autorizado', async () => {

        const novoNome = 'Outro nome 2';

        try {
            await cartorio.methods.modificaNomeAutorizado(accounts[1], novoNome)
                .send({ from: accounts[5], gas: '2000000' });

            assert(false);
        } catch (e) {
            assert(e.results[e.hashes[0]].error == 'revert');
        }
    });

});