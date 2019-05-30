import React, { Component, Fragment } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col,
} from "reactstrap";

import api from "services/api.js";
import CertificadosList from "components/CertificadosList/CertificadosList.jsx";

class SignCertificate extends Component {
  constructor(props) {
    super(props);
    this.assinarCertificado = this.assinarCertificado.bind(this);
    this.state = {
      certificados: ['loading']
    };
  }

  componentWillMount() {
    document.title = "Cartório IF - " + this.props.pageName;
  }

  async componentDidMount() { // For acessado pelo sidebar
    if (this.props.tipoConta !== 'administrador' && this.props.tipoConta !== 'autorizado') {
      this.props.history.replace('/');
    }

    const retorno = await api.get('/certificados');

    /*
    const rt = await api.post('/certificado', {
      nome: 'nome nome nome',
      email: 'email@gmail.com',
      titulo: 'título do',
      dataDoCurso: Date.now(),
      duracao: '120',
      nomeDoInstrutor: 'nome do instrutor'
    });

    console.log(rt);
    */

    this.setState({ certificados: retorno.data });
  }

  async assinarCertificado(chave) {

    const certificado = this.state.certificados[chave];

    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada, aguardando confirmação ...',
      icon: false,
      type: 'info',
      time: 200
    });

    let evento = this.props.cartorio.events.certificadoAdicionado();

    // Começa a escutar os eventos do contrato
    evento.on('data', async (res) => {
      
      if (res.returnValues.titulo === certificado.titulo) {

        this.props.funcoes.notify({
          message: 'Chave do certificado do '+certificado.nome+': '+res.returnValues.id,
          place: 'bc',
          icon: 'nc-icon nc-key-25',
          type: 'success',
          time: 40
        });

      }
    });

    try {
      await this.props.cartorio.methods.adicionarCertificado(
        certificado.nome, certificado.email, certificado.titulo, new Date(certificado.dataDoCurso).getTime(),
        certificado.duracao, certificado.nomeDoInstrutor
      ).send({ from: this.props.conta, gas: '2000000' });

      this.props.funcoes.notify({
        message: 'Transação confirmada ! O certificado foi assinado e armazenado na Blockchain. ',
        icon: 'nc-icon nc-check-2',
        type: 'success',
        time: 15
      });

      await api.put('/certificado/' + certificado._id);
      let certificados = this.state.certificados;
      delete certificados[chave];
      this.setState({ certificados });

    } catch (e) {
      this.props.funcoes.notify({
        message: 'Transação cancelada ou correu um erro na Ethereum, verifique o console para mais informações',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
      console.log(e);
    }
    this.props.funcoes.notifyDismiss(notificacaoID);
    evento.unsubscribe();
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
                {this.state.certificados[0] === 'loading' ? (
                  <div className="d-center">
                    <h3>Carregando ...</h3>
                  </div>
                ) : !this.state.certificados.length ? (
                  <div className="d-center">
                    <i className="nc-icon nc-check-2 text-success d-circle d-box-40" />
                    <h3>Nenhum certificado a ser assinado</h3>
                  </div>
                ) : (
                      <Fragment>
                        {this.state.certificados.map((data, key) => {
                          return (
                            <CertificadosList key={key} chave={key} data={data} assinarCertificado={this.assinarCertificado} />
                          )
                        })}
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
