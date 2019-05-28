/*eslint-disable*/
import React, { Component, Fragment } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Collapse,
  Row,
  Col,
} from "reactstrap";

import Button from "components/CustomButton/CustomButton.jsx";

class SignCertificate extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      certificados: []
    };
  }

  componentWillMount() {
    document.title = "Cartório IF - " + this.props.pageName;
    // this.setState({certificados: [1,2]});
  }

  componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'administrador' && this.props.tipoConta !== 'autorizado') {
      this.props.history.replace('/');
    }
  }

  toggle() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <CardTitle>Lista de certificados a serem assinados</CardTitle>
                <hr />
              </CardHeader>
              <CardBody>
                {this.state.certificados.length ? (
                  <div className="d-center">
                    <i className="nc-icon nc-check-2 text-success d-circle d-box-40" />
                    <h3>Nenhum certificado a ser assinado</h3>
                  </div>
                ) : (
                    <Fragment>
                      <Row responsive className="d-collapse-btn" onClick={this.toggle} style={{ marginBottom: '1rem' }}>
                        <Col className=""><strong>Título:</strong> Título do curso que foi realizado</Col>
                        <Col className=""><strong>Aluno</strong> Nome Do Aluno</Col>
                        <Col xs="auto" className="d-collapse-icon"><i className="nc-icon nc-minimal-down" /></Col>
                      </Row>
                      <Collapse className="d-collapse" isOpen={this.state.collapse}>
                        <Row className="d-center d-text18">
                          <Col xs="auto"><strong>Email:</strong> ifsudmg.email@gmail.com</Col>
                          <Col xs="auto"><strong>Data:</strong> 01/01/1991</Col>
                          <Col xs="auto"><strong>Duração:</strong> 5 horas</Col>
                          <Col xs="auto"><strong>Nome do instrutor:</strong> Instrutor Nome Completo</Col>
                        </Row>
                        <Row className="d-center">
                          <Button onClick={this.toggle} style={{ marginBottom: '1rem' }}>Assinar Este Certificado</Button>
                        </Row>
                      </Collapse>
                    </Fragment>
                  )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignCertificate;
