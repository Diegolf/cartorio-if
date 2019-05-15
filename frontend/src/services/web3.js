import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';
import { mnemonic, url_network } from './.dados.js';

let web3;
let tipoLogin;

if (window.web3 && window.web3.currentProvider) {
    const contas = getContasMetamask();
    if (contas[0]) {
        web3 = new Web3(window.web3.currentProvider);
        tipoLogin = 'metamask';
    }else{
        loginPadrao();
    }
} else {
    loginPadrao();
}

function loginPadrao() {
    const provider = new HDWalletProvider(mnemonic, url_network);
    web3 = new Web3(provider);
    tipoLogin = 'padrao';
}

async function getContasMetamask() {
    const contas = await window.web3.eth.getAccounts();
    return contas;
}

export { web3, tipoLogin };