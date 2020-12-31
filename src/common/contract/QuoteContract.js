import Web3 from 'web3';
import QuoteFactory from './QuoteFactory.json';
import { getConfigByChainID } from '../../utils/Config'

class QuoteContract {
  constructor(library, chainId) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._chainId = chainId;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).quoteContractAddress;
      let contract = new this._web3.eth.Contract(QuoteFactory.abi, contractAddress);
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
