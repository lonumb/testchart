import Web3 from 'web3';
import QuoteFactory from './QuoteFactory.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_QUOTE;

class QuoteContract {
  constructor(library) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(QuoteFactory.abi, ADDRESS);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
}

export default QuoteContract;
