import React, { Component } from "react";
import {
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    FormFeedback,
    Button,
    Row,
    Col,
} from "reactstrap";

import CardAuthor from "components/CardElements/CardAuthor.jsx";

import avatar from "assets/img/default-avatar.png";
import ifHeader from "assets/img/if-header.jpg";

import api from "services/api.js";

class AddCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailFeedBack: '',
            senha: '',
            senhaFeedBack: ''
        }
    }

    componentWillMount() {
        document.title = "Cartório IF - " + this.props.pageName;
    }

    logarClick = async (e) => {
        e.preventDefault();
        const email = this.state.email;
        const senha = this.state.senha;

        if (!email) {
            this.props.funcoes.notify({
                message: 'Infome o endereço de email',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });

            this.setState({ emailFeedBack: 'Informe o email' });
            return;
        }

        if (this.state.emailFeedBack.length) {
            this.setState({ emailFeedBack: '' });
        }


        if (!senha) {
            this.props.funcoes.notify({
                message: 'Infome a senha',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });

            this.setState({ senhaFeedBack: 'Informe o senha' });
            return;
        }

        let retorno = '';
        try {
            retorno = await api.post('/autenticar', {
                email, senha
            });
            localStorage.setItem('usr', retorno.data.token);
            this.props.funcoes.notify({
                message: `Seja bem vindo, ${retorno.data.usuario.nome}`,
                icon: 'nc-icon nc-check-2',
                type: 'success',
                time: 15
              });
        
        } catch (e) {
            if (e.response) {
                switch(e.response.data.cod){
                    case 1:{ // email
                        this.setState({emailFeedBack: 'Email não cadastrado'});
                        break;
                    }
                    case 2: { // senha
                        this.setState({senhaFeedBack: 'Senha incorreta'});
                        break;
                    }
                }
                this.props.funcoes.notify({
                    message: `${e.response.data.error} ${e.response.data.code === 3 ? 'Notifique um administrador, por favor.' : ''}`,
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
            } else {
                this.props.funcoes.notify({
                    message: 'Não fo possivel conectar ao servidor. Nenhum certificado carregado.',
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
            }
        }
    }

    render() {
        return (
            <div className="content" >
                <Row className="d-center">
                    <Col sm={10} md={7}>
                        <Card className="card-user">
                            <div className="image">
                                <img src={ifHeader} alt="Fachada do IF" />
                            </div>
                            <CardBody>
                                <CardAuthor
                                    avatar={avatar}
                                    avatarAlt="Avatar"
                                />
                                <h2>Login</h2>
                                <Form className="form">
                                    <Col>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" className="d-input-icon"><i className="nc-icon nc-single-02"></i></InputGroupAddon>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="meuemail@email.com"
                                                    value={this.props.email}
                                                    onChange={e => this.setState({ email: e.target.value })}
                                                    invalid={!!this.state.emailFeedBack.length}
                                                />
                                                <FormFeedback> {this.state.emailFeedBack} </FormFeedback>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" className="d-input-icon"><i className="nc-icon nc-key-25"></i></InputGroupAddon>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder="********"
                                                    value={this.props.senha}
                                                    onChange={e => this.setState({ senha: e.target.value })}
                                                    invalid={!!this.state.senhaFeedBack.length}
                                                />
                                                <FormFeedback> {this.state.senhaFeedBack} </FormFeedback>
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Button onClick={this.logarClick}>Logar</Button>
                                    {this.props.tipoConta === 'administrador' && (
                                        <Button>Cadastrar</Button>
                                    )}
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default AddCertificate;
