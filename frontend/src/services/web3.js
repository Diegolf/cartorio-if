import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';
import { mnemonic, url_network } from './.dados.js';

let web3;

if (window.web3 && window.web3.currentProvider)
    web3 = new Web3(window.web3.currentProvider);
else{
    const provider = new HDWalletProvider(mnemonic, url_network);
    web3 = new Web3(provider);
}

export default web3;