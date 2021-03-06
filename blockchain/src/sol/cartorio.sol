pragma solidity ^0.4.25;

// Cartório para registro de certificados
contract Cartorio{

    // Struct que armazena os dados de um certificado, comprovando sua autencidade e possibilitando consulta dos dados
    struct Certificado{
        string nome; // nome de quem recebeu o certificado
        string email; // email de quem recebeu o certificado
        string titulo; // nome do curso / atividade realizada
        uint dataDoCurso; // data em que o curso / atividade foi realizado
        uint dataDaTransacao; // data em que o certificado foi persistido na blockchain
        uint duracao; // carga horária em minutos
        string nomeDoInstrutor; // nome do professor / palestrante , quando se aplicar
        address enderecoDoAutor; // Endereço de quem registrou o certificado (enviou a transação)
        bool adicionadoPeloAdm; // Indica se o certificado foi assinado pelo administrador do contrato
        bool valido; // Indica se o certificado é válido; Apenas o administrador ou quem enviou pode invalidar um certificado
        uint dataInvalidacao; // No caso de um certificado ser invalidado
        address enderecoInvalidador; // Endereço de quem invalidou o certificado
    }

    struct Autorizado{
        uint id;
        string apelido; // Ex: Nome do setor, pessoa, etc
        bool ativo; // Indica se a conta tem ou não permissão de realizar transações
    }

    mapping(bytes32 => Certificado) private certificados;
    bytes32[] private certificadosIndices; // Necessário para consulta e listagem

    mapping(address => Autorizado) private autorizados; // Endereço das pessoas autorizadas a adicionarem novos certificados
    address[] private autorizadosEnderecos; // Necessário para consulta e listagem de todos os autorizados;

    address public root; // Endereço da conta que tem apenas a função de mudar a senha e o administrador

    address public administrador; // Administrador do contrato
    bytes32 private senhaGeral; // Senha

    event certificadoAdicionado(bytes32 id, string nome);

    event apelidoModificado(string novoApelido, uint data);

    event administradorModificado(address novoAdministrador, uint data);

    modifier apenasAutorizados(){
        require(autorizados[msg.sender].ativo == true, 'Apenas um "Autorizado" válido tem essa permissão');
        _;
    }

    modifier apenasAdministrador(){
        require(msg.sender == administrador, 'Apenas o "Administrador" tem essa permissão');
        _;
    }

    modifier apenasAutorizadosOuAdiministrador(){
        require(msg.sender == administrador || autorizados[msg.sender].ativo == true,
            'Apenas um "Autorizado" válido ou um "Administrador" tem essa permissão'
        );
        _;
    }

    modifier certificadoValido(bytes32 id){
        require(certificados[id].valido == true, 'Certificado inválido');
        _;
    }

    modifier certificadoExiste(bytes32 id){
        require(certificados[id].dataDaTransacao > 0, 'Certificado inexistente');
        _;
    }

    modifier autorizadoExiste(address endereco){
        require(autorizados[endereco].id > 0, 'Autorizado não cadastrado');
        _;
    }

    modifier apenasRoot(){
        require(msg.sender == root, 'Apenas o "Root" tem essa permissão');
        _;
    }

    modifier apenasRootOuAdminsitrador(){
        require(msg.sender == root || msg.sender == administrador,
            'Apenas o "Administrador" ou o "Root" tem essa permissão'
        );
        _;
    }

    constructor() public{
        root = msg.sender;
        autorizadosEnderecos.push(0x00);
    }

    // Modifica o adminsitrador do contrato, gera um evento
    function setAdministrador(address endereco) public apenasRoot {
        administrador = endereco;
        emit administradorModificado(endereco, now);
    }

    // Retorna a senha para poder verificar no front-end
    function getSenha() public apenasAdministrador view returns(bytes32 senha) {
        return senhaGeral;
    }

    // Modifica a senha geral
    function setSenha(bytes32 senha) public apenasRootOuAdminsitrador {
        senhaGeral = senha;
    }

    // Dado um passo gera um hash que será o índice para armazenar os dados do certificado
    function geraIndice(uint passo) private view returns(bytes32){
        return keccak256(abi.encodePacked(block.number, now, msg.data, passo));
    }

    // Adiciona o endereço de uma conta como autorizada a realizar determinadas transações no contrato
    function adicionaAutorizado(string apelido, address endereco) public apenasAdministrador {
        require(endereco != administrador, 'Não é possível adicionar o adimistrador como autorizado');

        // Verifica se o endereço já foi cadastrado antes
        if(autorizados[endereco].id == 0){ // Se não cadastra
            uint id = autorizadosEnderecos.length;

            autorizados[endereco] = Autorizado({
                id: id,
                apelido: apelido,
                ativo: true
            });

            autorizadosEnderecos.push(endereco);

        }else{ // Se sim apenas força o endereço como ativo
            autorizados[endereco].ativo = true;
        }

    }

    // Remove a permissão de uma conta de realizar transações no contrato
    function removerAutorizado(address endereco) public apenasAdministrador autorizadoExiste(endereco) {
        autorizados[endereco].ativo = false;
    }

    // Adiciona um novo certificado.
    function adicionarCertificado(string nome, string email, string titulo, uint dataDoCurso,
        uint duracao, string nomeDoInstrutor) public apenasAutorizadosOuAdiministrador {

            uint passo = 1;
            bool idAdministrador = msg.sender == administrador;
            do{
                bytes32 id = geraIndice(passo++);
            }while(certificados[id].dataDaTransacao > 0);

            certificadosIndices.push(id);
            certificados[id] = Certificado({
                nome: nome,
                email: email,
                titulo: titulo,
                dataDoCurso: dataDoCurso,
                dataDaTransacao: now,
                duracao: duracao,
                nomeDoInstrutor: nomeDoInstrutor,
                enderecoDoAutor: msg.sender,
                adicionadoPeloAdm: idAdministrador,
                valido: true,
                dataInvalidacao: 0,
                enderecoInvalidador: 0x00
            });
        emit certificadoAdicionado(id, nome);
    }

    // Torna um certificado inválido. Armazena a data e o endereço de quem realizou a transação. Vale lembrar que apenas o administrador ou quem registrou o certificado tem permissão para invalidá-lo.
    function invalidarCertificado(bytes32 id) public certificadoValido(id) {
        require(certificados[id].enderecoDoAutor == msg.sender || msg.sender == administrador,
            'Você não tem permissão para invalidar este certificado.'
        );
        certificados[id].valido = false;
        certificados[id].dataInvalidacao = now;
        certificados[id].enderecoInvalidador = msg.sender;
    }

    // Retorna os dados do certificado com ID passado por parâmetro.
    function getCertificado(bytes32 id) public certificadoExiste(id) view returns(
        string nome, // nome de quem recebeu o certificado
        string email, // email de quem recebeu o certificado
        string titulo, // nome do curso / atividade realizada
        uint dataDoCurso, // data em que o curso / atividade foi realizado
        uint duracao, // carga horária em minutos
        string nomeDoInstrutor // nome do professor / palestrante , quando se aplicar
        ){
            Certificado storage cert = certificados[id];

            return (cert.nome, cert.email, cert.titulo, cert.dataDoCurso, cert.duracao, cert.nomeDoInstrutor);
    }

    function getInformacoesCertificado(bytes32 id) public certificadoExiste(id) view returns(
        uint dataDaTransacao, // data em que o certificado foi persistido na blockchain
        address enderecoDoAutor, // Endereço de quem registrou o certificado (enviou a transação)
        bool adicionadoPeloAdm, // Indica se o certificado foi assinado pelo administrador do contrato
        bool valido, // Indica se o certificado é válido; Apenas o administrador ou quem enviou pode invalidar um certificado
        uint dataInvalidacao, // No caso de um certificado ser invalidado
        address enderecoInvalidador // Endereço de quem invalidou o certificado
        ){
            Certificado storage cert = certificados[id];

            return (cert.dataDaTransacao, cert.enderecoDoAutor, cert.adicionadoPeloAdm, cert.valido,
                cert.dataInvalidacao, cert.enderecoInvalidador
            );
    }

    // Consulta as informações de um autorizado cadastrado
    function getAutorizado(address endereco) public apenasAdministrador autorizadoExiste(endereco) view returns (
        uint id,
        string apelido, // Ex: Nome do setor, pessoa, etc
        bool ativo // Indica se a conta tem ou não permissão de realizar transações
        ){
            Autorizado storage autorizado = autorizados[endereco];
            return (autorizado.id, autorizado.apelido, autorizado.ativo);
    }

    // Modifica o nome de um autorizado
    function modificaNomeAutorizado(address endereco, string apelido) public apenasAdministrador autorizadoExiste(endereco) {
        autorizados[endereco].apelido = apelido;
        emit apelidoModificado(apelido, now);
    }

    // Retorna todos os indices de cada certificado já cadastrado
    function getCertificadosIndices() public apenasAutorizadosOuAdiministrador view returns(bytes32[] indices){
        return certificadosIndices;
    }

    // Retorna todos os endereços de cada autorizado já cadastrado
    function getAutorizadosEnderecos() public view returns(address[]){
        return autorizadosEnderecos;
    }

    function isAutorizado(address endereco) public view returns(bool autorizado){
        return autorizados[endereco].ativo;
    }

}