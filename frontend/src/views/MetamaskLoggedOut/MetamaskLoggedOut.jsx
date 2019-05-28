/*eslint-disable*/
import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";

class MetamaskLoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  componentWillMount(){
    document.title = "Cartório IF - " + this.props.pageName ;
  }

  onContinuarComoVisitante() {
    this.props.funcoes.continuarComoVisitante();
    this.props.history.goBack();
  }

  async onDesbloquearAcesso() {
    await window.ethereum.enable();
    this.props.history.replace('/');
    window.location.reload();
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma conta do Metamask foi reconhecida</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                <div className="text-warning d-center d-marginlr">
                  <span className="blockquote-primary d-text18">
                    Metamask está instalado, mas provalmente está deslogado ou bloqueado. Desbloqueie o Metamask e atualize a página, ou clique aqui para continuar como visitante
                  </span>
                  <div className="d-row">
                    {window.ethereum && (
                      <Button color="info" onClick={this.onDesbloquearAcesso.bind(this)} round>Desbloquear acesso</Button>
                    )}
                    <Button color="info" onClick={this.onContinuarComoVisitante.bind(this)} round>Continuar como visitante</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MetamaskLoggedOut;
