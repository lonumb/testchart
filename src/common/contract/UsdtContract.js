import TeemoConfig from './TeemoPool.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_USDT;

class UsdtContract {
  constructor(web3) {
    this.web3 = web3;
  }
  // 获取合约对象
  getContract() {
    let contract = new this.web3.eth.Contract(TeemoConfig.abi, ADDRESS);
    return contract;
  }
}

export default UsdtContract;
