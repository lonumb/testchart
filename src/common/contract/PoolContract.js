import Web3 from 'web3';
import PoolFactory from './abi/PoolFactory.json';
import { getConfigByChainID } from '../../utils/Config'

class PoolContract {
  constructor(library, chainId, userAddress) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._userAddress = userAddress;
    this._chainId = chainId;
  }
  
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      console.log(`this._chainId: ${this._chainId}`);
      console.log(`this._chainId: ${this._chainId}, `, getConfigByChainID(this._chainId));
      var contractAddress = getConfigByChainID(this._chainId).poolContractAddress;
      console.log(`contractAddress: ${contractAddress}`);
      let contract = new this._web3.eth.Contract(PoolFactory, contractAddress, { from: this._userAddress });
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  // 查询余额
  getBalanceOf() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.balanceOf(this._userAddress).call();
  }
}

export default PoolContract;
