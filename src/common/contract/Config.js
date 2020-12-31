// REACT_APP_ADDRESS_TEEMO="0xf026Cd01c956B6944EC5876c4b4ba13027769F8e"
// REACT_APP_ADDRESS_USDT="0xcf032413529a3814d7277d1Afb540747e71B364d"

import chainConfig from '../../components/wallet/Config'

const config = {
    3 : {
        teemoContractAddress: '0xf026Cd01c956B6944EC5876c4b4ba13027769F8e',
        usdtContractAddress: '0xcf032413529a3814d7277d1Afb540747e71B364d',
        poolContractAddress: '0xe62514AfAe531eaBEb00fF9a9Df651D1e650EC91',
        quoteContractAddress: '0x6F5a802977D149714Af838259b85F6a0aE32eb09',
    },
}

export default {
    getConfigByChainID : (chainId) => {
        return Object.assign({}, config[chainId], chainConfig.getChainConfig(chainId))
    }
}