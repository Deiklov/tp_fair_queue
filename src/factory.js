import web3 from './web3';

const address = process.env.REACT_APP_ETH_CONTRACT_ADDRESS_FACTORY;

const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract Queue",
                "name": "ctrctAdr",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "ownerAdr",
                "type": "address"
            }
        ],
        "name": "QueueCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "children",
        "outputs": [
            {
                "internalType": "contract Queue",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "end",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "maxLength",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minFee",
                "type": "uint256"
            }
        ],
        "name": "createQueue",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
export default new web3.eth.Contract(abi, address);
