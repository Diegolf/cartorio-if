import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';
import { mnemonic, url_network } from './.dados.js';

let web3;
let tipoLogin;

verificarWeb3();

async function verificarWeb3(){
    if (window.web3 && window.web3.currentProvider) {
        web3 = new Web3(window.web3.currentProvider);
        let contas = await web3.eth.getAccounts();
        if (contas[0]) {
            tipoLogin = 'metamask';
        }else{
            loginPadrao();
        }
    } else {
        loginPadrao();
    }
}

function loginPadrao() {
    const provider = new HDWalletProvider(mnemonic, url_network);
    web3 = new Web3(provider);
    tipoLogin = 'padrao';
}



export { web3, tipoLogin };