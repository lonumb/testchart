import PoolFactory from './abi/PoolFactory.json';
import { getConfigByChainID } from '../../utils/Config'
import BaseContract from './BaseContract'

class PoolFactoryContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }
  
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).poolFactoryContractAddress;
      console.log(`contractAddress: ${contractAddress}`);
      let contract = new this._web3.eth.Contract(PoolFactory, contractAddress, { from: this._userAddress });
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  getOpenFee() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.openFee().call();
  }
}

export default PoolFactoryContract;
