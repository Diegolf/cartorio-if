import React, { Component } from 'react';

import { Collapse, Row, Col, CardBody, Container } from "reactstrap";

export default class AutorizadosList extends Component {

    constructor(props) {
        super(props);
        this.onEntering = this.onEntering.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapse: false,
        };
    }

    async onEntering() {
        const dados = await this.props.cartorio.methods.getAutorizado(this.props.autorizado).call({ from: this.props.conta });
        console.log(dados);
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    render() {
        return (
            <Container color="primary" className="d-toggle-card" onClick={this.toggle}>
                <Row className="d-padding5">
                    <Col><strong>Conta</strong>: {this.props.autorizado}</Col>
                </Row>
                <Row>
                    <Col>
                        <Collapse
                            className="d-toggle-body"
                            isOpen={this.state.collapse}
                            onEntering={this.onEntering}
                        >

                            <CardBody>
                                    Anim
                            </CardBody>

                        </Collapse>
                    </Col>
                </Row>
            </Container>
        );
    }
}
