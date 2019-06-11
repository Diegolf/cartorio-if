import React, { Component, Fragment } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

import api from "services/api.js";
import CertificadosList from "components/CertificadosList/CertificadosList.jsx";

class AddCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: { certificados: [] },
        }
    }

    async componentWillMount() {
        document.title = "Cartório IF - " + this.props.pageName;

        const token = localStorage.getItem('usr');

        if (!token) {
            this.props.history.replace('/adicionar-certificado/login');
            return;
        }

        try {
            await api.get('/token', {
                headers: { autorizacao: `Bearer ${token}` }
            });

        } catch (e) {
            if (e.response) {
                localStorage.removeItem('usr');
                switch (e.response.data.cod) {
                    case 1: case 2: case 3: {
                        this.props.history.replace('/adicionar-certificado/login');
                        break;
                    }
                    case 4: { // email
                        this.props.funcoes.notify({
                            message: 'Login expirado. Favor logar novamente',
                            icon: 'nc-icon nc-time-alarm',
                            type: 'warning'
                        });
                        break;
                    }
                    default: { }
                }
            } else {
                this.props.funcoes.notify({
                    message: 'Não fo possivel conectar ao servidor. Tente novamente mais tarde',
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
                this.props.history.replace('/');
            }
            return;
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('usr');

        if (!token)
            return;

        try {
            const retorno = await api.get('/usuario', {
                headers: { autorizacao: `Bearer ${token}` }
            });

            this.setState({ usuario: retorno.data.user })
        } catch (e) {
            if (e.response) {
                localStorage.removeItem('usr');
                this.props.history.replace('/adicionar-certificado/login');

            } else {
                this.props.funcoes.notify({
                    message: 'Não fo possivel conectar ao servidor.Tente novamente mais tarde.',
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
                this.props.history.replace('/');
            }
            return;
        }
    }


    render() {
        return (
            <div className="content" >
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardHeader>
                                <Row style={{margin: "0", padding: "0"}}>
                                    <Col>
                                        <CardTitle>Adicionar certificado</CardTitle>
                                    </Col>

                                    <Col xs="auto">
                                        Usuário: {this.state.usuario.nome} | Deslogar
                                    </Col>
                                </Row>
                                <hr />
                            </CardHeader>
                            <CardBody>
                                Vários inputs bonitos para adicionar certificado
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Lista de certificados adicionados</CardTitle>
                                <hr />
                            </CardHeader>
                            <CardBody>
                                {!this.state.usuario.certificados.length ? (
                                    <div className="d-center">
                                        <i className="nc-icon nc-alert-circle-i text-warning d-circle d-box-40" />
                                        <h3>Nenhum certificado adicionado por essa conta</h3>
                                    </div>
                                ) : (
                                        <Fragment>
                                            {this.state.usuario.certificados.map((data, key) => {
                                                return (
                                                    <CertificadosList key={key} chave={key} data={data} />
                                                )
                                            })}
                                        </Fragment>
                                    )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default AddCertificate;
