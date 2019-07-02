import React, { Component, Fragment } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    Button
} from "reactstrap";

import api from "services/api.js";
import CertificadosList from "components/CertificadosList/CertificadosList.jsx";

class AddCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: { certificados: [] },
            titulo: '',
            tituloFeedBack: '',
            nome: '',
            nomeFeedBack: '',
            email: '',
            emailFeedBack: '',
            dataDoCurso: '',
            dataDoCursoFeedBack: '',
            duracao: '',
            duracaoTipo: 'minuto',
            duracaoFeedBack: '',
            nomeDoInstrutor: '',
            nomeDoInstrutorFeedBack: ''
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
                console.log(e.response.data.error);
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
                console.log(e.response.data.error);
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

    logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('usr');
        this.props.history.replace('/adicionar-certificado/login');
    }

    inputErrorAlert = (message) => {
        this.props.funcoes.notify({
            message,
            icon: 'nc-icon nc-simple-remove',
            type: 'danger'
        });
    }

    submitClick = async (e) => {
        e.preventDefault();
        const { titulo, duracaoTipo, nomeDoInstrutor, nome, email, dataDoCursoFeedBack,
            tituloFeedBack, duracaoFeedBack, nomeDoInstrutorFeedBack, nomeFeedBack, emailFeedBack
        } = this.state;

        let { dataDoCurso, duracao } = this.state;

        if (!titulo) {
            const mensagem = "Informe o título do curso";
            this.inputErrorAlert(mensagem);
            this.setState({ tituloFeedBack: mensagem })
            return;
        }
        if (tituloFeedBack.length) {
            this.setState({ tituloFeedBack: '' });
        }

        if (!dataDoCurso) {
            const mensagem = "Informe a data do curso";
            this.inputErrorAlert(mensagem);
            this.setState({ dataDoCursoFeedBack: mensagem })
            return;
        }
        if (dataDoCursoFeedBack.length) {
            this.setState({ dataDoCursoFeedBack: '' });
        }

        if (!duracao) {
            const mensagem = "Informe a duração do curso";
            this.inputErrorAlert(mensagem);
            this.setState({ duracaoFeedBack: mensagem })
            return;
        }
        if (duracaoTipo === 'hora')
            duracao = duracao * 60;
        if (duracaoFeedBack.length) {
            this.setState({ duracaoFeedBack: '' });
        }

        if (!nomeDoInstrutor) {
            const mensagem = "Informe o nome do instrutor do curso";
            this.inputErrorAlert(mensagem);
            this.setState({ nomeDoInstrutorFeedBack: mensagem })
            return;
        }
        if (nomeDoInstrutorFeedBack.length) {
            this.setState({ nomeDoInstrutorFeedBack: '' });
        }

        if (!nome) {
            const mensagem = "Informe o nome do aluno";
            this.inputErrorAlert(mensagem);
            this.setState({ nomeFeedBack: mensagem })
            return;
        }
        if (nomeFeedBack.length) {
            this.setState({ nomeFeedBack: '' });
        }

        if (!email) {
            const mensagem = "Informe o email do aluno";
            this.inputErrorAlert(mensagem);
            this.setState({ emailFeedBack: mensagem })
            return;
        }
        if (emailFeedBack.length) {
            this.setState({ emailFeedBack: '' });
        }

        dataDoCurso = new Date(dataDoCurso.replace(/-/g, '/')).getTime();
        const tk = localStorage.getItem('usr');
        
        try {
            const retorno = await api.post('/certificado', {
                nome, email, titulo, dataDoCurso, duracao, nomeDoInstrutor
            }, {
                headers: { autorizacao: `Bearer ${tk}` },
            });
            
            this.props.funcoes.notify({
                message: 'Certificado adicionado ao servidor para ser assinado',
                icon: 'nc-icon nc-check-2',
                type: 'success',
                time: 6
            });
            const usuario = this.state.usuario;
            usuario.certificados.push(retorno.data);

            this.setState({nome: '', email: '', usuario});
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.error);
                switch (e.response.data.cod) {
                    case 1: {
                        this.props.funcoes.notify({
                            message: 'Ocorreu um erro com o usuário. Se o erro persistir contate um administrador.',
                            icon: 'nc-icon nc-simple-remove',
                            type: 'warning'
                        });
                        //localStorage.removeItem('usr');
                        //this.props.history.replace('/adicionar-certificado/login');
                        break;
                    }
                    case 2: { 
                        this.props.funcoes.notify({
                            message: 'Erro ao adicionar certificado. Tente novamente mais tarde.',
                            icon: 'nc-icon nc-simple-remove',
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

    render() {
        return (
            <div className="content" >
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardHeader>
                                <Row style={{ margin: "0", padding: "0" }}>
                                    <Col>
                                        <CardTitle>Adicionar certificado</CardTitle>
                                    </Col>
                                    <Col xs="auto">
                                        Usuário: <strong>{this.state.usuario.nome}</strong> | <a href="@#" onClick={this.logout}>Deslogar</a>
                                    </Col>
                                </Row>
                                <hr />
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="titulo">Título do Curso</Label>
                                                <Input
                                                    value={this.state.titulo}
                                                    onChange={(e) => this.setState({ titulo: e.target.value })}
                                                    invalid={!!this.state.tituloFeedBack.length}
                                                    type="text"
                                                    name="titulo"
                                                    id="titulo"
                                                    placeholder="Ex: Minicurso de ..." />
                                                <FormFeedback>{this.state.tituloFeedBack}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="data">Data do curso</Label>
                                                <Input
                                                    value={this.state.dataDoCurso}
                                                    onChange={(e) => this.setState({ dataDoCurso: e.target.value })}
                                                    invalid={!!this.state.dataDoCursoFeedBack.length}
                                                    type="date"
                                                    name="data"
                                                    id="data" />
                                                <FormFeedback>{this.state.dataDoCursoFeedBack}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="duracao">Duração do curso</Label>
                                                <InputGroup>
                                                    <Input
                                                        value={this.state.duracao}
                                                        onChange={(e) => this.setState({ duracao: e.target.value })}
                                                        invalid={!!this.state.duracaoFeedBack.length}
                                                        type="number"
                                                        name="duracao"
                                                        min={0}
                                                        max={10000}
                                                        step={1}
                                                        id="duracao"
                                                        placeholder="Ex: 120" />
                                                    <InputGroupAddon addonType="append">
                                                        <Input
                                                            value={this.state.duracaoTipo}
                                                            onChange={(e) => this.setState({ duracaoTipo: e.target.value })}
                                                            type="select" name="select"
                                                            className="d-input-select">
                                                            <option value="minuto">minuto(s)</option>
                                                            <option value="hora">hora(s)</option>
                                                        </Input>
                                                    </InputGroupAddon>
                                                    <FormFeedback>{this.state.duracaoFeedBack}</FormFeedback>
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="nomeDoInstrutor">Nome do Instrutor</Label>
                                                <Input
                                                    value={this.state.nomeDoInstrutor}
                                                    onChange={(e) => this.setState({ nomeDoInstrutor: e.target.value })}
                                                    invalid={!!this.state.nomeDoInstrutorFeedBack.length}
                                                    type="text"
                                                    name="nomeDoInstrutor"
                                                    id="nomeDoInstrutor"
                                                    placeholder="Nome completo do instrutor" />
                                                <FormFeedback>{this.state.nomeDoInstrutorFeedBack}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="nome">Nome do Aluno</Label>
                                                <Input
                                                    value={this.state.nome}
                                                    onChange={(e) => this.setState({ nome: e.target.value })}
                                                    invalid={!!this.state.nomeFeedBack.length}
                                                    type="text"
                                                    name="nome"
                                                    id="nome"
                                                    placeholder="Nome completo do aluno" />
                                                <FormFeedback>{this.state.nomeFeedBack}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="email">Email do aluno</Label>
                                                <Input
                                                    value={this.state.email}
                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                    invalid={!!this.state.emailFeedBack.length}
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="email@email.com" />
                                                <FormFeedback>{this.state.emailFeedBack}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" className="d-center">
                                            <Button onClick={this.submitClick} type="submit">Registrar</Button>
                                        </Col>
                                    </Row>
                                </Form>
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
                                        <i className="nc-icon nc-alert-circle-i text-warning d-circle d-box-40" style={{ marginBottom: '15px' }} />
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
