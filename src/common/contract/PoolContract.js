import Web3 from 'web3';
import PoolFactory from './PoolFactory.json';
import { getConfigByChainID } from '../../utils/Config'

class PoolContract {
  constructor(library, userAddress, chainId) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._userAddress = userAddress;
    this._chainId = chainId;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).poolContractAddress;
      let contract = new this._web3.eth.Contract(PoolFactory.abi, contractAddress, { from: this._userAddress });
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
  // 池子列表基本信息
  getAllPoolInfo() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getAllPoolInfo()
      .call()
      .then((data) => {
        let temp = [];
        if (data.allSymbol && data.allSymbol.length) {
          data.allSymbol.forEach((element, index) => {
            temp.push({ symbol: data.allSymbol[index], tokenAddr: data.allTokenAddr[index], poolAddr: data.allTeemoPoolAddr[index] });
          });
        }
        return temp;
      });
  }
  // 查询余额
  getBalanceOf() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.balanceOf(this._userAddress).call();
  }
}

export default PoolContract;
