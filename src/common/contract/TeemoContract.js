import Web3 from 'web3';
import TeemoConfig from './TeemoPool.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_TEEMO;

class TeemoContract {
  constructor(library, address) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._address = address || ADDRESS;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(TeemoConfig.abi, this._address);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
  // 池子symbol
  async getSymbol() {
    if (!this.getContract()) return;
    return await this.getContract().methods.symbol().call();
  }

  // 订单列表
  async queryAllOrderList(address) {
    if (!this.getContract()) return;
    return await this.getContract().methods.getAllOrderInfo(address).call();
  }
}

export default TeemoContract;
