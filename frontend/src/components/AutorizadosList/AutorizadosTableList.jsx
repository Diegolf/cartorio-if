import React, { Component } from 'react';

import { Table } from "reactstrap";

export default class AutorizadosTableList extends Component {

    constructor(props) {
        super(props);
        this.toggleAtivo = this.toggleAtivo.bind(this);
        this.state = {
            autorizados: {ativos:[], desativados:[]},
            collapse: false,
        };
    }

    componentDidMount(){
        this.setState({autorizados: this.props.autorizados});
    }

    async toggleAtivo(apelido, conta, ativo, indice) {
        const notificacaoID = this.props.funcoes.notify({
            message: 'Transação enviada, aguardando confirmação ...',
            icon: false,
            type: 'info',
            time: 200
        });

        try {
            ativo ? 
                await this.props.cartorio.methods.removerAutorizado(conta).send({ from: this.props.conta, gas: '2000000' }) 
            :
                await this.props.cartorio.methods.adicionaAutorizado(apelido, conta).send({ from: this.props.conta, gas: '2000000' }) 
            ;
            this.props.funcoes.notify({
                message: 'Transação confirmada ! O autorizado "'+apelido+'" foi ' + (ativo ? 'desativado' : 'ativado'),
                icon: 'nc-icon nc-check-2',
                type: 'success',
                time: 15
            });

            let autorizados = this.props.autorizados;

            if (ativo){
                autorizados.desativados.push(autorizados.ativos[indice]);
                delete autorizados.ativos[indice];
            }else{
                autorizados.ativos.push(autorizados.desativados[indice]);
                delete autorizados.desativados[indice];
            }

            this.setState({autorizados});

        } catch (e) {
            this.props.funcoes.notify({
                message: 'Transação cancelada ou correu um erro na Ethereum, verifique o console para mais informações',
                icon: 'nc-icon nc-simple-remove',
                type: 'danger'
            });
            console.log(e);
        }
        this.props.funcoes.notifyDismiss(notificacaoID);
    }

    render() {
        return (
            <Table striped bordered responsive>
                <thead className="text-primary">
                    <tr>
                        <th>Apelido</th>
                        <th>conta</th>
                        <th className="text-center">Ativo</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.autorizados.ativos.map((dados, indice) => {
                        return (
                            <tr key={indice}>
                                <td>{dados.apelido}</td>
                                <td>{dados.conta}</td>
                                <td className="text-center" >
                                    <i onClick={()=>this.toggleAtivo(dados.apelido, dados.conta, true, indice)} 
                                       className="nc-icon nc-button-power text-success d-icon-g">
                                    </i>
                                </td>
                            </tr>
                        )
                    })}

                    {this.state.autorizados.desativados.map((dados, indice) => {
                        return (
                            <tr key={indice}>
                                <td>{dados.apelido}</td>
                                <td>{dados.conta}</td>
                                <td className="text-center">
                                    <i onClick={()=>this.toggleAtivo(dados.apelido, dados.conta, false, indice)} 
                                       className="nc-icon nc-button-power text-danger d-icon-g">
                                    </i>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        );
    }
}
