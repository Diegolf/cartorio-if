import React, { Component } from "react";
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
      inputValue: ''
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
      const dados = await this.props.cartorio.methods.getCertificado(this.state.inputValue)
        .call({ from: this.props.conta });

      this.setState({
        certificado: {
          chave: this.state.inputValue,
          titulo: dados.titulo,
          nome: dados.nome,
          email: dados.email,
          dataDaTransacao: dados.dataDaTransacao,
          dataDoCurso: dados.dataDoCurso,
          duracao: dados.duracao,
          enderecoDoAutor: dados.enderecoDoAutor,
          nomeDoInstrutor: dados.nomeDoInstrutor
        }
      });

    } catch (e) {
      this.props.funcoes.notify({
        message: 'Transação cancelada ou correu um erro na Ethereum, verifique o console para mais informações',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      console.log(e);
    }
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
                    </Row>
                    <Collapse isOpen={true} className="d-collapse">
                      <Row className="d-center d-text18">
                        <Col xs="auto"><strong>Título:</strong> {this.state.certificado.titulo}</Col>
                        <Col xs="auto"><strong>Aluno</strong> {this.state.certificado.nome}</Col>
                        <Col xs="auto"><strong>Email:</strong> email@gmail.com </Col>
                        <Col xs="auto"><strong>Data do Curso:</strong> {new Date(parseInt(this.state.certificado.dataDoCurso)).toLocaleDateString()} </Col>
                        <Col xs="auto"><strong>Duração:</strong> {this.state.certificado.duracao} minutos</Col>
                        <Col xs="auto"><strong>Nome do instrutor:</strong> {this.state.certificado.nomeDoInstrutor} </Col>
                        <Col xs="auto"><strong>Adicionado em:</strong> {new Date(parseInt(this.state.certificado.dataDaTransacao)).toLocaleString()} </Col>
                        <Col xs="auto"><strong>por:</strong> {this.state.certificado.enderecoDoAutor} </Col>
                      </Row>
                      <Row className="d-center">
                        <Button onClick={() => { }} >Ações</Button>
                      </Row>
                    </Collapse>
                  </CardBody>
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
