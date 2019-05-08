import React, { Component } from 'react';

import './styles.css';

import web3 from '../../services/web3';
import { abi, enderecoContrato } from '../../contracts/cartorio';

import Sidebar from '../../components/Sidebar';

import CertificadoForm from '../../components/CertificadoForm';
import AutorizadoForm from '../../components/AutorizadoForm';

export default class Main extends Component {

  state = {
    cartorio: '', // instância do contrato
    tipoLogin: '', // metamask, padrao
    conta: '', // Endereço da conta
    tipoConta: '', // root, administrador, autorizado, visitante
  };

  async componentDidMount() {

    // TODO para todas as páginas verificar o props anteriormente

    const cartorio = await new web3.eth.Contract(JSON.parse(abi), enderecoContrato);
    const contas = await web3.eth.getAccounts();
    let tipoLogin;
    let tipoConta;

    if (window.web3 && window.web3.currentProvider) { // METAMASK
      tipoLogin = 'metamask';

      const isAutorizado = await cartorio.methods.isAutorizado(contas[0]).call();

      if (isAutorizado) {
        tipoConta = 'autorizado';
      } else {
        const administrador = await cartorio.methods.administrador().call();

        if (administrador === contas[0]) {
          tipoConta = 'administrador';
        } else {
          const root = await cartorio.methods.root().call();

          if (root === contas[0]) {
            tipoConta = 'root';
          } else {
            tipoConta = 'visitante';
          }
        }
      }

    } else { // Conta padrão
      tipoLogin = 'padrao';
      tipoConta = 'visitante';
    }

    this.setState({ cartorio, tipoLogin, conta: contas[0], tipoConta });

  }

  render() {
    if (window.web3 && !this.state.conta) {
      return <h1>Metamask detectado, mas nenhuma conta carregada</h1>
    }

    // TODO verificar se a conta que está acessando é uma autorizada e renderizar condicionalmente

    return (
      <div>
        <h1>Página de exemplo</h1>
        {this.state.tipoConta === 'administrador' && (
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