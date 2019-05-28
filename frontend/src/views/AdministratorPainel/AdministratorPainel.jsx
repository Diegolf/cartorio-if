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
  Table,
  FormFeedback
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import AutorizadosTableList from "components/AutorizadosList/AutorizadosTableList.jsx";

class AutorizadoinistratorPainel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autorizados: {
        ativos: [],
        desativados: []
      },
      apelidoNovoAutorizado: '',
      apelidoNovoAutorizadoError: false,
      enderecoNovoAutorizado: '',
      enderecoNovoAutorizadoMessage: '',
      enderecoNovoAutorizadoError: false
    };
  }

  componentWillMount(){
    document.title = "Cartório IF - " + this.props.pageName ;
  }

  async componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'administrador') {
      this.props.history.replace('/');
    }

    if (this.props.cartorio) {
      let autorizadosIds = await this.props.cartorio.methods.getAutorizadosEnderecos().call({ from: this.props.conta });
      autorizadosIds.shift();

      let autorizados = { ativos: [], desativados: [] };

      for (let c in autorizadosIds) {
        const at = await this.props.cartorio.methods.getAutorizado(autorizadosIds[c]).call({ from: this.props.conta });

        if (at.ativo) {
          autorizados.ativos.push({
            conta: autorizadosIds[c],
            apelido: at.apelido,
          });
        } else {
          autorizados.desativados.push({
            conta: autorizadosIds[c],
            apelido: at.apelido,
          });
        }

      };

      this.setState({ autorizados: autorizados })
    }
  }

  async onEnderecoNovoAutorizadoButtonClick() {
    const endereco = this.state.enderecoNovoAutorizado;
    const apelido = this.state.apelidoNovoAutorizado;

    if (!apelido) {
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
      icon: false,
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

      let autorizados = this.state.autorizados;
      autorizados.ativos.push({
        conta: endereco,
        apelido: apelido
      });

      this.setState({autorizados, enderecoNovoAutorizado: '', apelidoNovoAutorizado: ''});

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
              <CardBody className="d-container">
                {(!this.state.autorizados.ativos.length && !this.state.autorizados.desativados.length) ?
                  <h3 className="d-center">Nenhum autorizado cadastrado</h3>
                  : (
                    <AutorizadosTableList
                      web3={this.props.web3}
                      cartorio={this.props.cartorio}
                      conta={this.props.conta}
                      autorizados={this.state.autorizados}
                      funcoes={this.props.funcoes}
                    />
                  )}
              </CardBody>
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
                    placeholder="Ex: Setor, Nome Próprio"
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
