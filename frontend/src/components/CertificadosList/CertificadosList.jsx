import React, { Component, Fragment } from 'react';

import { Row, Col, Collapse, Button } from 'reactstrap';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Moment from 'react-moment';
import QRCode from 'qrcode.react';

export default class CertificadosList extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    render() {
        return (
            <Fragment>
                <Row onClick={this.toggle} className="d-collapse-btn" style={{ marginBottom: '1rem' }}>
                    <Col ><strong>Título: </strong> {this.props.data.titulo}</Col>
                    <Col ><strong>Aluno: </strong> {this.props.data.nome}</Col>
                    <Col xs="auto" className="d-collapse-icon d-center"><i className="nc-icon nc-minimal-down" /></Col>
                </Row>
                <Collapse isOpen={this.state.collapse} className="d-collapse d-metal-gradient">
                    <Row className="d-center d-text18">
                        <Col xs="auto"><strong>Email:</strong> {this.props.data.email} </Col>
                        <Col xs="auto"><strong>Data do Curso:</strong> <Moment format="DD/MM/YYYY">{this.props.data.dataDoCurso}</Moment> </Col>
                        <Col xs="auto"><strong>Duração:</strong> {this.props.data.duracao} minutos</Col>
                        <Col xs="auto"><strong>Nome do instrutor:</strong> {this.props.data.nomeDoInstrutor} </Col>
                        <Col xs="auto">Há {distanceInWords(this.props.data.createdAt, new Date(), { locale: pt })} </Col>
                        {!this.props.assinarCertificado && (
                            <Fragment>
                                <Col xs="auto" className={this.props.data.assinado ? 'text-success' : 'text-warning'}>
                                    {this.props.data.assinado ? 'Assinado !' : 'Não assinado ainda.'}
                                </Col>
                                {this.props.data.assinado && (
                                    <Fragment>
                                        <Col xs="auto"><strong>Chave do certificado:</strong> {this.props.data.chave} </Col>
                                        <Col xs="auto" style={{ marginTop: '15px' }}>
                                            <QRCode value={this.props.data.chave}></QRCode>
                                        </Col>
                                        <Button onClick={() => { this.props.gerarModeloCertificado(this.props.data, this.props.chave) }} >Gerar Modelo de Certificado</Button>
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </Row>
                    <Row className="d-center">
                        {this.props.assinarCertificado && (
                            <Button onClick={() => { this.props.assinarCertificado(this.props.chave) }} style={{ marginBottom: '1rem' }}>Assinar Este Certificado</Button>
                        )}
                    </Row>
                </Collapse>
            </Fragment>
        );
    }
}
