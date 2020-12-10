import Web3 from 'web3';
import QuoteFactory from './QuoteFactory.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_QUOTE;

class QuoteContract {
  constructor(library, address) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._address = address || ADDRESS;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(QuoteFactory.abi, this._address);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
  // 最新价
  queryNewPrice(symbol) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.getNewPrice(symbol).call();
  }
}

export default QuoteContract;
