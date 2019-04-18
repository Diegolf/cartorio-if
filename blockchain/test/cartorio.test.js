const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada