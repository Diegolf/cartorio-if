import React, { Component, Fragment } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardHeader,
  Button,
  Collapse,
  Row,
  Col,
} from "reactstrap";

class SignCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificado: '',
      inputValue: '',
      certificados: ['carregando'],
      certificadosInfo: [],
      certificadosIds: []
    }
  }

  componentDidMount() { // For acessado pelo sidebar
    if (window.web3 && this.props.tipoLogin === 'padrao' && !this.props.visitante) {
      this.props.history.push('/metamaskloggedout');
    }

    /*
    if (this.props.tipoLogin === 'adminsitrador' || this.props.tipoLogin === 'autorizado'){
      const certificadosIds = await this.props.cartorio.methods.getCertificadosIndices()
        .call({ from: this.props.conta });
      
      let certificados = [];

      for (indice in certificadosIds) {
        const certificado = 
      }


      this.setState({certificadosIds, certificados});
    }*/

  }

  componentDidUpdate() { // For acessado diretamente pela barra de endereços
    if (window.web3 && this.props.tipoLogin === 'padrao' && !this.props.visitante) {
      this.props.history.push('/metamaskloggedout');
    }
  }

  componentWillMount() {
    document.title = "Cartório IF - " + this.props.pageName;
  }

  inputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.buscarCertificado();
    }
  }

  buscarCertificado = async () => {

    try {
      const certificado = await this.props.cartorio.methods.getCertificado(this.state.inputValue)
        .call({ from: this.props.conta });

      const certificadoInfo = await this.props.cartorio.methods.getInformacoesCertificado(this.state.inputValue)
        .call({ from: this.props.conta });

      this.setState({
        certificado: {
          chave: this.state.inputValue,
          titulo: certificado.titulo,
          nome: certificado.nome,
          email: certificado.email,
          dataDoCurso: certificado.dataDoCurso,
          duracao: certificado.duracao,
          nomeDoInstrutor: certificado.nomeDoInstrutor,
          enderecoDoAutor: certificadoInfo.enderecoDoAutor,
          dataDaTransacao: certificadoInfo.dataDaTransacao,
          adicionadoPeloAdm: certificadoInfo.adicionadoPeloAdm,
          valido: certificadoInfo.valido,
          dataInvalidacao: certificadoInfo.dataInvalidacao,
          enderecoInvalidador: certificadoInfo.enderecoInvalidador
        }
      });

    } catch (e) {
      this.props.funcoes.notify({
        message: 'Transação cancelada ou correu um erro na Ethereum, verifique a chave informada',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      console.log(e);
    }
  }

  invalidarCertificado = async (chave, nome) => {
    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada, aguardando confirmação ...',
      icon: false,
      type: 'info',
      time: 200
    });

    try {
      await this.props.cartorio.methods.invalidarCertificado(chave).send({ from: this.props.conta, gas: '2000000' });
      this.props.funcoes.notify({
        message: 'Transação confirmada ! O certificado de ' + nome + ' foi invalidado.',
        icon: 'nc-icon nc-check-2',
        type: 'success',
        time: 15
      });

      this.buscarCertificado();
    } catch (e) {
      this.props.funcoes.notify({
        message: 'Transação cancelada ou correu um erro na Ethereum, verifique o console para mais informações',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      console.log(e);
    }
    this.props.funcoes.notifyDismiss(notificacaoID);
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Consultar</CardTitle>
                <hr />
              </CardHeader>
              <CardBody className="d-center">
                <h5>Digite a chave do certificado</h5>
                <InputGroup className="no-border d-marginlr">
                  <Input
                    value={this.state.inputValue}
                    onKeyPress={this.inputKeyPress}
                    onChange={e => this.setState({ inputValue: e.target.value })}
                    placeholder="Ex: 0x123abc"
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText onClick={this.buscarCertificado} style={{ cursor: "pointer", padding: "5px 10px" }}>
                      <i className="nc-icon nc-zoom-split" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {this.state.certificado && (
                  <CardBody className="d-container">
                    <Row onClick={this.toggle} className="d-collapse-btn" style={{ marginBottom: '1rem' }}>
                      <Col ><strong>Chave: </strong> {this.state.certificado.chave}</Col>
                      <Col xs="auto"><i className={"d-icon nc-icon " + (this.state.certificado.valido ? 'nc-check-2 d-green' : 'nc-simple-remove d-red')} /></Col>
                    </Row>
                    <Collapse isOpen={true} className="d-collapse d-metal-gradient">
                      <Row className="d-text18">
                        <Col xs="12"><strong>Título:</strong> {this.state.certificado.titulo}</Col>
                        <Col xs="12"><strong>Aluno</strong> {this.state.certificado.nome}</Col>
                        <Col xs="12"><strong>Email:</strong> {this.state.certificado.email} </Col>
                        <Col xs="12"><strong>Data do Curso:</strong> {new Date(parseInt(this.state.certificado.dataDoCurso)).toLocaleDateString()} </Col>
                        <Col xs="12"><strong>Duração:</strong> {this.state.certificado.duracao} minutos</Col>
                        <Col xs="12"><strong>Nome do instrutor:</strong> {this.state.certificado.nomeDoInstrutor} </Col>
                        <Col xs="12"><strong>Adicionado em:</strong> {new Date(parseInt(this.state.certificado.dataDaTransacao) * 1000).toLocaleString()} </Col>
                        <Col xs="12">
                          <strong>Adicionado por {this.state.certificado.adicionadoPeloAdm ? ' (Administrador)' : ''}:</strong> {this.state.certificado.enderecoDoAutor}
                        </Col>
                        {(!this.state.certificado.valido) ? (
                          <Fragment>
                            <Col xs="12" className="d-red"><strong>Invalidado por:</strong> {this.state.certificado.enderecoInvalidador}</Col>
                            <Col xs="12" className="d-red"><strong>Envalidado em:</strong> {new Date(parseInt(this.state.certificado.dataInvalidacao) * 1000).toLocaleString()} </Col>
                          </Fragment>
                        ) : (this.props.conta === this.state.certificado.enderecoDoAutor || this.props.tipoConta === 'administrador') && (
                          <Col xs="12">
                            <Button onClick={() => this.invalidarCertificado(this.state.certificado.chave, this.state.certificado.nome)} color="warning">Invalidar Certificado</Button>
                          </Col>
                        )}
                      </Row>
                      <Row className="d-center">

                      </Row>
                    </Collapse>
                  </CardBody>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/*(this.props.tipoConta === 'administrador' || this.props.tipoConta === 'autorizado') && (
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Certificados</CardTitle>
                  <hr />
                </CardHeader>
                <CardBody className="d-center">
                  <h5>Lista de certificados assidados pela conta atualmente logada.</h5>
                  { this.state.certificados[0] === 'carregando' ? (
                    <h4>Carregando ...</h4>
                  ):(
                    this.state.certificados.map((crt) => {
                      return <div>asd</div>
                    })
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )*/}
      </div>
    );
  }
}

export default SignCertificate;
