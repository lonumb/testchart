import Web3 from 'web3';
import PoolProxy from './PoolProxy.json';
import { getConfigByChainID } from '../../utils/Config'

class PoolProxyContract {
  constructor(library, userAddress, chainId) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._userAddress = userAddress;
    this._chainId = chainId;
  }

  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).poolProxyContractAddress;
      let contract = new this._web3.eth.Contract(PoolProxy.abi, contractAddress, { from: this._userAddress });
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
            var symbol = data.allSymbol[index];
            var tokenAddr = data.allTokenAddr[index];
            var poolAddr = data.allTeemoPoolAddr[index];
            var erc20Pool = tokenAddr !== '0x0000000000000000000000000000000000000000'
            if (!erc20Pool) {
              symbol = getConfigByChainID(this._chainId).mainSymbol;
            }
            temp.push({ symbol, tokenAddr, poolAddr, erc20Pool });
          });
        }
        return temp;
      });
  }
}

export default PoolProxyContract;
