import Web3 from 'web3';
//overrides metamask v0.2 for our v 1.0
if (window.ethereum) {
    window.ethereum.send('eth_requestAccounts').then(() => window.web3 = new Web3(window.ethereum));
}

export default new Web3(window.ethereum);