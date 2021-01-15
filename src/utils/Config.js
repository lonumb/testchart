import chainConfig from '../components/wallet/Config'

const config = {
    3 : {
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        poolProxyContractAddress: '0xC0bee094F57B82BE8927B9bA962dA0bd3f0D38Bf',

        teemoContractAddress: '0xf026Cd01c956B6944EC5876c4b4ba13027769F8e',
        usdtContractAddress: '0xcf032413529a3814d7277d1Afb540747e71B364d',
        baseUrl: '',
    },
    1337 : {
        quoteContractAddress: '0xb50A641423D12dc05609EA28f972C7eAb20d57e5',
        poolContractAddress: '0x98A9ba7fEC2B9C80a1857Cd649d027696376713d',
        poolProxyContractAddress: '0x65bF2cdF57007Cf626815FF03F87035B92435a01',

        teemoContractAddress: '0x29D8D3ED32cB18e236F563cf806B8d5cE597b685',
        usdtContractAddress: '0x424A9EA15180bc5d746Eb4b81d3Cf9D7A1A0586E',
        baseUrl: '',
    },
}

export const getConfigByChainID = (chainId) => {
    return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId));
}

export default config;