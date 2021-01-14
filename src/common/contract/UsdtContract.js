import Web3 from 'web3';
import TeemoConfig from './abi/TeemoPool.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_USDT;

class UsdtContract {
  constructor(library) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._contract = null;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(TeemoConfig.abi, ADDRESS);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
  // 获取symbol
  async getSymbol() {
    if (!this.getContract()) return;
    return await this.getContract().methods.symbol().call();
  }
}

export default UsdtContract;
