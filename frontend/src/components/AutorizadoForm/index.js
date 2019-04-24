import React, { Component } from 'react';

export default class AutorizadoForm extends Component {
    state = {
        enderecoConta: '',
        apelido: '',
        mensagem: ''
    };

    submitHandle = async (e) => {
        e.preventDefault();

        if (!this.props.web3.utils.isAddress(this.state.enderecoConta)) {
            this.setState({ mensagem: 'A conta informada é inválida.' });
            return;
        }

        if (!this.state.apelido){
            this.setState({mensagem: 'Informe o apelido'});
            return;
        }

        this.setState({ mensagem: 'Transação enviada, aguardando confirmação ...' });

        await this.props.cartorio.methods.adicionarAutorizado(this.state.apelido, this.state.enderecoConta)
            .send({from: this.props.conta, gas: '2000000'});

        this.setState({mensagem: ''});

    }

    render() {
        return (
            <div className="center">
                <h2>Adicionar autorizado</h2>
                <span className="error-message" >{this.state.mensagem}</span>
                <form action="">
                    <input
                        placeholder='Endereço da conta'
                        value={this.state.enderecoConta}
                        onChange={(e) => this.setState({ enderecoConta: e.target.value })}
                    />
                    <input
                        placeholder='Nome / Apelido da conta'
                        value={this.state.apelido}
                        onChange={(e) => this.setState({ apelido: e.target.value })}
                    />
                    <input
                        type="button"
                        value="Adicionar"
                        onClick={this.submitHandle}
                    />
                </form>
            </div>
        );
    }
}
