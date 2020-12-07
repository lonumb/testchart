import Web3 from 'web3';
import TeemoConfig from './TeemoPool.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_TEEMO;

class TeemoContract {
  constructor(library) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
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

  async getSymbol() {
    if (!this.getContract()) return;
    return await this.getContract().methods.symbol().call();
  }
}

export default TeemoContract;
