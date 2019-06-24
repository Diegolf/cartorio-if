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
    TabContent,
    TabPane,
    Row,
    Col,
} from "reactstrap";

import CardAuthor from "components/CardElements/CardAuthor.jsx";

import avatar from "assets/img/default-avatar.png";
import ifHeader from "assets/img/if-header.jpg";

import api from "services/api.js";

class AddCertificateLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'tb1',
            email: '',
            emailFeedBack: '',
            senha: '',
            senhaFeedBack: '',
            cnome: '',
            cnomeFeedBack: '',
            cemail: '',
            cemailFeedBack: '',
            csenha: '',
            csenhaFeedBack: '',
            csenha2: '',
            csenha2FeedBack: ''
        }
    }

    componentWillMount() {
        document.title = "Cartório IF - " + this.props.pageName;
    }

    logarClick = async (e) => {
        if (e)
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
                time: 6
            });
            this.props.history.replace('/adicionar-certificado');
        } catch (e) {
            if (e.response) {
                switch (e.response.data.cod) {
                    case 1: { // email
                        this.setState({ emailFeedBack: 'Email não cadastrado' });
                        break;
                    }
                    case 2: { // senha
                        this.setState({ senhaFeedBack: 'Senha incorreta' });
                        break;
                    }
                    default: { }
                }
                this.props.funcoes.notify({
                    message: `${e.response.data.error} ${e.response.data.code === 3 ? 'Notifique um administrador, por favor.' : ''}`,
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
            } else {
                this.props.funcoes.notify({
                    message: 'Não fo possivel conectar ao servidor. Tente novamente mais tarde.',
                    icon: 'nc-icon nc-simple-remove',
                    type: 'danger'
                });
            }
        }
    }

    cadastrarClick = async (e) => {
        e.preventDefault();
        const nome = this.state.cnome;
        const email = this.state.cemail;
        const senha = this.state.csenha;
        const senha2 = this.state.csenha2;

        if (!nome) {
            this.props.funcoes.notify({
                message: 'Informe o nome.',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            this.setState({ cnomeFeedBack: 'Informe o nome.' });
            return;
        }
        if (this.state.cnomeFeedBack.length) {
            this.setState({ cnomeFeedBack: '' });
        }

        if (!email) {
            this.props.funcoes.notify({
                message: 'Informe o email.',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            this.setState({ cemailFeedBack: 'Informe o email.' });
            return;
        }
        if (this.state.cemailFeedBack.length) {
            this.setState({ cemailFeedBack: '' });
        }

        if (!senha) {
            this.props.funcoes.notify({
                message: 'Informe a senha.',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            this.setState({ csenhaFeedBack: 'Informe a senha.' });
            return;
        }
        if (this.state.csenhaFeedBack.length) {
            this.setState({ csenhaFeedBack: '' });
        }

        if (!senha2) {
            this.props.funcoes.notify({
                message: 'Informe a confirmação da senha.',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            this.setState({ csenha2FeedBack: 'Informe a confirmação da senha.' });
            return;
        }
        if (this.state.csenha2FeedBack.length) {
            this.setState({ csenha2FeedBack: '' });
        }

        if (senha !== senha2){
            this.props.funcoes.notify({
                message: 'A senha e a confirmação de senha não coincidem.',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            this.setState({ csenha2FeedBack: 'As senhas não coincidem.' });
            return;
        }
        if (this.state.csenha2FeedBack.length) {
            this.setState({ csenha2FeedBack: '' });
        }

        try {
            const retorno = await api.post('/registro', {
                nome, email, senha
            });
            localStorage.setItem('usr', retorno.data.token);
            this.props.funcoes.notify({
                message: `Usuário ${nome} cadastrado !`,
                icon: 'nc-icon nc-check-2',
                type: 'success',
                time: 15
            });
        } catch (e) {
            if (e.response) {
                switch (e.response.data.cod) {
                    case 1: { // email
                        this.setState({ cemailFeedBack: 'Email já cadastrado' });
                        break;
                    }
                    default: { }
                }
                this.props.funcoes.notify({
                    message: `${e.response.data.error} ${e.response.data.code === 2 ? 'Notifique um administrador, por favor.' : ''}`,
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
            return;
        }
        this.setState({cnome: '', cemail: '', csenha: '', csenha2: ''});
        this.toggleTab('tb1');
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    inputKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.logarClick();
        }
    }

    render() {
        return (
            <div className="content" >
                <Row className="d-center">
                    <Col sm={10} md={7}>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="tb1">
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
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-single-02"></i>
                                                        </InputGroupAddon>
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
                                                    <Label for="password">Senha</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-key-25"></i>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            placeholder="********"
                                                            value={this.props.senha}
                                                            onChange={e => this.setState({ senha: e.target.value })}
                                                            invalid={!!this.state.senhaFeedBack.length}
                                                            onKeyUp={this.inputKeyPress}
                                                        />
                                                        <FormFeedback> {this.state.senhaFeedBack} </FormFeedback>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            <Button onClick={this.logarClick}>Logar</Button>
                                            {this.props.tipoConta === 'administrador' && (
                                                <Button onClick={() => this.toggleTab('tb2')}>Cadastrar</Button>
                                            )}
                                        </Form>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="tb2">
                                <Card className="card-user">
                                    <div className="image">
                                        <img src={ifHeader} alt="Fachada do IF" />
                                    </div>
                                    <CardBody>
                                        <h2>Cadastrar</h2>
                                        <Form className="form">
                                            <Col>
                                                <FormGroup>
                                                    <Label for="cnome">Nome</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-badge"></i>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="text"
                                                            name="nome"
                                                            id="cnome"
                                                            placeholder="Ex: Setor ou Nome Completo"
                                                            value={this.props.cnome}
                                                            onChange={e => this.setState({ cnome: e.target.value })}
                                                            invalid={!!this.state.cnomeFeedBack.length}
                                                        />
                                                        <FormFeedback> {this.state.cnomeFeedBack} </FormFeedback>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="cemail">Email</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-single-02"></i>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="email"
                                                            name="email"
                                                            id="cemail"
                                                            placeholder="meuemail@email.com"
                                                            value={this.props.cemail}
                                                            onChange={e => this.setState({ cemail: e.target.value })}
                                                            invalid={!!this.state.cemailFeedBack.length}
                                                        />
                                                        <FormFeedback> {this.state.cemailFeedBack} </FormFeedback>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="cpassword">Senha</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-key-25"></i>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="password"
                                                            name="password"
                                                            id="cpassword"
                                                            placeholder="********"
                                                            value={this.props.csenha}
                                                            onChange={e => this.setState({ csenha: e.target.value })}
                                                            invalid={!!this.state.csenhaFeedBack.length}
                                                        />
                                                        <FormFeedback> {this.state.csenhaFeedBack} </FormFeedback>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label for="password2">Confirmar Senha</Label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend" className="d-input-icon">
                                                            <i className="nc-icon nc-key-25"></i>
                                                        </InputGroupAddon>
                                                        <Input
                                                            type="password"
                                                            name="password"
                                                            id="password2"
                                                            placeholder="********"
                                                            value={this.props.csenha2}
                                                            onChange={e => this.setState({ csenha2: e.target.value })}
                                                            invalid={!!this.state.csenha2FeedBack.length}
                                                        />
                                                        <FormFeedback> {this.state.csenha2FeedBack} </FormFeedback>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            {this.props.tipoConta === 'administrador' && (
                                                <Button onClick={this.cadastrarClick}>Cadastrar</Button>
                                            )}
                                            <Button onClick={() => this.toggleTab('tb1')}>Voltar</Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default AddCertificateLogin;
