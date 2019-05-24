/*eslint-disable*/
import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Container,
  CardHeader,
  Input,
  Row,
  Col,
  FormFeedback
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import AutorizadosList from "components/AutorizadosList/AutorizadosList.jsx";

class AutorizadoinistratorPainel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autorizadosIds: [],
      apelidoNovoAutorizado: '',
      apelidoNovoAutorizadoError: false,
      enderecoNovoAutorizado: '',
      enderecoNovoAutorizadoMessage: '',
      enderecoNovoAutorizadoError: false
    };
  }

  async componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'administrador') {
      this.props.history.replace('/');
    }

    let autorizados = await this.props.cartorio.methods.getAutorizadosEnderecos().call({from: this.props.conta});
    autorizados.shift();

    this.setState({autorizadosIds: autorizados})

  }

  async onEnderecoNovoAutorizadoButtonClick() {
    const endereco = this.state.enderecoNovoAutorizado;
    const apelido = this.state.apelidoNovoAutorizado;

    if (!apelido){
      this.props.funcoes.notify({
        message: 'Informe o apelido do autorizado',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      this.setState({ apelidoNovoAutorizadoError: true, apelidoNovoAutorizadoMessage: 'Informe o apelido do autorizado' });
      return;
    }

    this.setState({ apelidoNovoAutorizadoError: false, apelidoNovoAutorizadoMessage: '' });

    if (!endereco) {
      this.props.funcoes.notify({
        message: 'Informe o endereço da conta do autorizado',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      this.setState({ enderecoNovoAutorizadoError: true, enderecoNovoAutorizadoMessage: 'Informe o endereço da conta' });
      return;
    }

    if (!this.props.web3.utils.isAddress(endereco)) {
      this.props.funcoes.notify({
        message: 'O endereço informado é inválido',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      this.setState({ enderecoNovoAutorizadoError: true, enderecoNovoAutorizadoMessage: 'O endereço informado é inválido' });
      return;
    }

    this.setState({ enderecoNovoAutorizadoError: false, enderecoNovoAutorizadoMessage: '' });

    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada, aguardando confirmação ...',
      icon: 'nc-icon nc-delivery-fast',
      type: 'info',
      time: 200
    });

    try {
      await this.props.cartorio.methods.adicionaAutorizado(apelido, endereco).send({ from: this.props.conta, gas: '2000000' });
      this.props.funcoes.notify({
        message: 'Transação confirmada ! O autorizado foi adicionado. ',
        icon: 'nc-icon nc-check-2',
        type: 'success',
        time: 15
      });
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
                <CardTitle>Lista de Autorizados</CardTitle>
                <hr />
              </CardHeader>
              <Container className="d-container">
                {this.state.autorizadosIds.map( endereco => {
                  return <AutorizadosList autorizado={endereco} conta={this.props.conta} cartorio={this.props.cartorio} />
                })}
              </Container>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Adicionar autorizado</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                <div className="d-center d-marginlr">
                  <span className="blockquote-primary d-marginb">
                    Digite o endereço da chave pública do novo autorizado
                  </span>
                  <Input
                    invalid={this.state.apelidoNovoAutorizadoError}
                    value={this.state.apelidoNovoAutorizado}
                    onChange={e => this.setState({ apelidoNovoAutorizado: e.target.value })}
                    placeholder="Ex: Diretoria de Extensão, Nome Próprio"
                    className="d-text-center d-marginb"
                  />
                  <FormFeedback> {this.state.apelidoNovoAutorizadoMessage} </FormFeedback>
                  <Input
                    invalid={this.state.enderecoNovoAutorizadoError}
                    value={this.state.enderecoNovoAutorizado}
                    onChange={e => this.setState({ enderecoNovoAutorizado: e.target.value })}
                    placeholder="Endereço Hexadecimal Ex: 0x123abc"
                    className="d-text-center"
                  />
                  <FormFeedback> {this.state.enderecoNovoAutorizadoMessage} </FormFeedback>
                  <Button color="info" onClick={this.onEnderecoNovoAutorizadoButtonClick.bind(this)} round>Adicionar Autorizado</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AutorizadoinistratorPainel;
