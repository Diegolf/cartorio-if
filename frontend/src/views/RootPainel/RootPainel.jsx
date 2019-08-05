/*eslint-disable*/
import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Input,
  Row,
  Col,
  FormFeedback
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";

class RootPainel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enderecoNovoAdm: '',
      enderecoNovoAdmError: false,
      enderecoNovoAdmMessage: '',
      senhaInput: '',
      senhaInputConfirmacao: '',
      senhaInputConfirmacaoError: false,
      senhaInputConfirmacaoMessage: ''
    };
  }

  componentWillMount(){
    document.title = "Cartório IF - " + this.props.pageName ;
  }

  componentDidMount() { 
    if (this.props.tipoConta !== 'root') {
      this.props.history.replace('/');
    }
  }

  async onEnderecoNovoAdmButtonClick() {
    const endereco = this.state.enderecoNovoAdm;

    if (!endereco) {
      this.props.funcoes.notify({
        message: 'Informe o endereço da conta',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      this.setState({ enderecoNovoAdmError: true, enderecoNovoAdmMessage: 'Informe o endereço da conta' });
      return;
    }

    if (!this.props.web3.utils.isAddress(endereco)) {
      this.props.funcoes.notify({
        message: 'O endereço informado é inválido',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      this.setState({ enderecoNovoAdmError: true, enderecoNovoAdmMessage: 'O endereço informado é inválido' });
      return;
    }

    this.setState({ enderecoNovoAdmError: false, enderecoNovoAdmMessage: '' });
    
    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada. Aguardando a validação pela rede blockchain ...',
      icon: false,
      type: 'info',
      time: 200
    });

    try {
      await this.props.cartorio.methods.setAdministrador(endereco).send({ from: this.props.conta, gas: '2000000' });
      this.props.funcoes.notify({
        message: 'Transação confirmada ! O administrador foi modificado. ',
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

  async onNovaSenhaButtonClick() {
    const senha = this.state.senhaInput;
    const senhaConfirmacao = this.state.senhaInputConfirmacao;

    if (!senha || !senhaConfirmacao) {
      this.props.funcoes.notify({
        message: 'Informe a senha e a confirmação',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      return;
    }

    if (senha !== senhaConfirmacao) {
      this.props.funcoes.notify({
        message: 'A senha e a confirmação não coincidem',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      return;
    }

    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada. Aguardando a validação pela rede blockchain ...',
      icon: false,
      type: 'info',
      time: 200
    });

    try {
      await this.props.cartorio.methods.setSenha(this.props.web3.utils.keccak256(senha)).send({ from: this.props.conta, gas: '2000000' });
      this.props.funcoes.notify({
        message: 'Transação confirmada ! O a senha do administrador foi modificada.',
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

  senhasIguais(value) {
    const senha = this.state.senhaInput;

    if (senha !== value) {
      this.setState({ senhaInputConfirmacaoError: true, senhaInputConfirmacaoMessage: 'As senhas não coincidem' });
    } else {
      this.setState({ senhaInputConfirmacaoError: false, senhaInputConfirmacaoMessage: '' });
    }

  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Modificar o administrador do contrato</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                <div className="d-center d-marginlr">
                  <span className="blockquote-primary d-marginb">
                    Digite o endereço da chave pública do novo administrador
                  </span>
                  <Input
                    invalid={this.state.enderecoNovoAdmError}
                    value={this.state.enderecoNovoAdm}
                    onChange={e => this.setState({ enderecoNovoAdm: e.target.value })}
                    placeholder="Endereço Hexadecimal Ex: 0x123abc"
                    className="d-text-center"
                  />
                  <FormFeedback> {this.state.enderecoNovoAdmMessage} </FormFeedback>
                  <Button color="info" onClick={this.onEnderecoNovoAdmButtonClick.bind(this)} round>Modificar Adminsitrador</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Modificar a senha do administrador</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                <div className="d-center d-marginlr">
                  <span className="blockquote-primary d-marginb">
                    Digite a nova senha de administrador acesso as funções do administrador
                  </span>
                  <Input
                    value={this.state.senhaInput}
                    onChange={e => this.setState({ senhaInput: e.target.value })}
                    type="password"
                    className="d-text-center d-marginb"
                    placeholder="Nova senha"
                  />
                  <Input
                    invalid={this.state.senhaInputConfirmacaoError}
                    valid={!this.state.senhaInputConfirmacaoError && this.state.senhaInputConfirmacao !== ''}
                    value={this.state.senhaInputConfirmacao}
                    onChange={e => { this.setState({ senhaInputConfirmacao: e.target.value }); this.senhasIguais(e.target.value) }}
                    type="password"
                    className="d-text-center"
                    placeholder="Confirmar nova senha"
                  />
                  <FormFeedback> {this.state.senhaInputConfirmacaoMessage} </FormFeedback>
                  <Button color="info" onClick={this.onNovaSenhaButtonClick.bind(this)} round>Modificar senha</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RootPainel;
