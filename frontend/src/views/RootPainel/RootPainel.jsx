/*eslint-disable*/
import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Input,
  Row,
  Col
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import Button from "components/CustomButton/CustomButton.jsx";

class RootPainel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enderecoNovoAdm: '',
      senhaInput: '',
      senhaInputConfirmacao: ''
    };

    // web3.utils.isAddress()
  }

  componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'root') {
      this.props.history.replace('/');
    }
  }

  /*componentDidUpdate() { // For acessado diretamente pela barra de endereços
    if (this.props.tipoConta !== 'root') {
      this.props.history.replace('/');
    }
  }*/

  onEnderecoNovoAdmButtonClick() {
    console.log(this.state.enderecoNovoAdm);
    this.notify('Mensagem');
  }

  onNovaSenhaButtonClick() {
    console.log('Senha: ', this.state.senhaInput);
    console.log('Senha confirmação: ', this.state.senhaInputConfirmacao);
  }

  // place= "tl", "tc", "tr", "bl", "bc", "br" # type: "primary", "info", "success", "danger", "warning"
  notify(message, time=7, place="tr", type="info", icon="nc-icon nc-bell-55") { // 
    
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          {message}
        </div>
      ),
      type: type,
      icon: icon,
      autoDismiss: time
    };
    this.refs.notificationAlert.notificationAlert(options);
  }

  render() {
    return (
      <div className="content">
        <NotificationAlert ref="notificationAlert" />
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
                    value={this.state.enderecoNovoAdm}
                    onChange={e => this.setState({ enderecoNovoAdm: e.target.value })}
                    placeholder="Endereço Hexadecimal Ex: 0x123abc"
                    className="d-text-center"
                  />
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
                    value={this.state.senhaInputConfirmacao}
                    onChange={e => this.setState({ senhaInputConfirmacao: e.target.value })}
                    type="password"
                    className="d-text-center"
                    placeholder="Confirmar nova senha"
                  />
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
