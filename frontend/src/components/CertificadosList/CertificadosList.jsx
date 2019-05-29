import React, { Component, Fragment } from 'react';

import { Row, Col, Collapse, Button } from 'reactstrap';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Moment from 'react-moment';

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
                    <Col className=""><strong>Título:</strong> {this.props.data.titulo}</Col>
                    <Col className=""><strong>Aluno</strong> {this.props.data.nome}</Col>
                    <Col xs="auto" className="d-collapse-icon"><i className="nc-icon nc-minimal-down" /></Col>
                </Row>
                <Collapse isOpen={this.state.collapse} toggler="a" className="d-collapse">
                    <Row className="d-center d-text18">
                        <Col xs="auto"><strong>Email:</strong> {this.props.data.email} </Col>
                        <Col xs="auto"><strong>Data do Curso:</strong> <Moment format="DD/MM/YYYY">{this.props.data.dataDoCurso}</Moment> </Col>
                        <Col xs="auto"><strong>Duração:</strong> {this.props.data.duracao} minutos</Col>
                        <Col xs="auto"><strong>Nome do instrutor:</strong> {this.props.data.nomeDoInstrutor} </Col>
                        <Col xs="auto">Há {distanceInWords(this.props.data.createdAt, new Date(), { locale: pt })} </Col>
                    </Row>
                    <Row className="d-center">
                        <Button onClick={() => { this.props.assinarCertificado(this.props.data._id, this.props.chave)}} style={{ marginBottom: '1rem' }}>Assinar Este Certificado</Button>
                    </Row>
                </Collapse>
            </Fragment>
        );
    }
}
