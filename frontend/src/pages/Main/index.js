import React, { Component } from 'react';

import './styles.css';

import web3 from '../../services/web3';
import { abi, enderecoContrato } from '../../contracts/cartorio';

import CertificadoForm from '../../components/CertificadoForm';
import AutorizadoForm from '../../components/AutorizadoForm';

export default class Main extends Component {

  state = {
    cartorio: '',
    conta: '',
    administrador: false
  };


  async componentDidMount() {

    const cartorio = await new web3.eth.Contract(JSON.parse(abi), enderecoContrato);
    const conta = await web3.eth.getAccounts();
    const administrador = await cartorio.methods.administrador().call();

    if (administrador === conta[0]){
      this.setState({administrador:true});
    }

    this.setState({ cartorio, conta: conta[0] });


  }

  render() {
    if (!this.state.conta) {
      return <h1>Metamask detectado, mas nenhuma conta carregada</h1>
    }

    // TODO verificar se a conta que está acessando é uma autorizada e renderizar condicionalmente

    return (
      <div>
        <h1>Página de exemplo</h1>
        {this.state.administrador && (
          <div>
            <hr />
            <AutorizadoForm web3={web3} {...this.state} />
          </div>
        )}
        <hr />
        <CertificadoForm />
      </div>
    );
  };
};