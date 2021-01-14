export const chainConfig = {
    1 : {
        mainSymbol: "ETH",
        networkName: "Main ETH",
        rpcUrl: 'https://mainnet.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://etherscan.io/'
    },
    3 : {
        mainSymbol: "ETH",
        networkName: "Ropsten",
        rpcUrl: 'https://ropsten.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://ropsten.etherscan.io/'
    },
    4 : {
        mainSymbol: "ETH",
        networkName: "Rinkeby",
        rpcUrl: 'https://rinkeby.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://rinkeby.etherscan.io/'
    },
    5 : {
        mainSymbol: "ETH",
        networkName: "Goerli",
        rpcUrl: 'https://goerli.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://goerli.etherscan.io/'
    },
    42 : {
        mainSymbol: "ETH",
        networkName: "Kovan",
        rpcUrl: 'https://kovan.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://kovan.etherscan.io/'
    },
    56 : {
        mainSymbol: "BNB",
        networkName: "BSC",
        rpcUrl: 'https://bsc-dataseed1.binance.org/', 
        blockTime: 3000,
        explorerName: 'Bscscan',
        explorerUrl: 'https://bscscan.com/'
    },
    97 : {
        mainSymbol: "BNB",
        networkName: "BSC Test",
        rpcUrl: 'https://testnet.bscscan.com/', 
        blockTime: 3000,
        explorerName: 'Bscscan',
        explorerUrl: 'https://testnet.bscscan.com/'
    },
    1337 : {
        mainSymbol: "ETH",
        networkName: "Private Chain",
        rpcUrl: 'https://ropsten.infura.io/v3/34c59a94d8ef460086c55841531e0b67',
        blockTime: 15000,
        explorerName: 'Etherscan',
        explorerUrl: 'https://ropsten.etherscan.io/'
    },
};

export const defaultChainId = process.env.REACT_APP_DEFAULT_CHAIN_ID
export const supportedChainIds = (process.env.REACT_APP_SUPPORT_CHAIN_IDS || '').split(',').filter((item) => parseInt(item) != NaN && chainConfig[item] != undefined).map((item) => parseInt(item));

if (chainConfig[defaultChainId] == undefined) {
    throw new Error(`Not support chainId: ${defaultChainId}`)
}

var url = {};

for (let i = 0;i < supportedChainIds.length; i++) {
    url[supportedChainIds[i]] = chainConfig[supportedChainIds[i]].rpcUrl;
}

export const rpcUrls = url;

export default {
    defaultChainId,
    defaultChainConfig: chainConfig[defaultChainId],
    supportedChainIds,
    rpcUrls: url,
    getChainConfig : (chainId) => {
        return Object.assign({}, chainConfig[chainId])
    }
}
