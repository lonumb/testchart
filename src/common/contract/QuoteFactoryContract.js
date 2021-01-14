import QuoteFactory from './abi/QuoteFactory.json';
import BaseContract from './BaseContract'
import { getConfigByChainID } from '../../utils/Config'

class QuoteFactoryContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).quoteContractAddress;
      let contract = new this._web3.eth.Contract(QuoteFactory.abi, contractAddress, { from: this._userAddress });
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  // 最新价
  getNewPrice(symbol) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.getNewPrice(symbol).call();
  }
}

export default QuoteFactoryContract;
