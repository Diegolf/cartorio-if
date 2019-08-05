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

  async componentDidMount() {
    if (this.props.tipoConta !== 'administrador' && this.props.tipoConta !== 'autorizado') {
      this.props.history.replace('/');
    }

    let retorno = { data: [] };
    try {
      retorno = await api.get('/certificados');
    } catch (e) {

      this.props.funcoes.notify({
        message: 'Não fo possivel conectar ao servidor. Nenhum certificado carregado.',
        icon: 'nc-icon nc-simple-remove',
        type: 'danger'
      });
    }

    this.setState({ certificados: retorno.data });
  }

  async assinarCertificado(chave) {

    const certificado = this.state.certificados[chave];

    const notificacaoID = this.props.funcoes.notify({
      message: 'Transação enviada. Aguardando a validação pela rede blockchain ...',
      icon: false,
      type: 'info',
      time: 200
    });

    let evento = this.props.cartorio.events.certificadoAdicionado();

    // Começa a escutar os eventos do contrato
    evento.on('data', async (res) => {

      if (res.returnValues.nome === certificado.nome) {

        this.props.funcoes.notify({
          message: 'Chave do certificado do ' + certificado.nome + ': ' + res.returnValues.id,
          place: 'bc',
          icon: 'nc-icon nc-key-25',
          type: 'success',
          time: 40
        });

        try {
          await api.put('/certificado/' + certificado._id, { chave: res.returnValues.id });
          this.props.funcoes.realizandoOperacao(false);
        } catch (e) {
          if (e.response) {
            console.log(e.response.data.error);
            
            this.props.funcoes.notify({
              message: `${e.response.data.error} ${e.response.data.code === 2 ? 'Notifique um administrador, por favor.' : ''}`,
              icon: 'nc-icon nc-simple-remove',
              type: 'danger'
            });
          } else {
            this.props.funcoes.notify({
              message: 'Não foi possivel conectar ao servidor para incluir a chave do certificado assinado. Tente novamente mais tarde.',
              icon: 'nc-icon nc-simple-remove',
              type: 'danger'
            });
          }
        }

      }
    });

    this.props.funcoes.realizandoOperacao(true, "Aguarde a confirmação da transação para poder armazenar a chave do certificado no backend.");

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
