import ERD20 from './ERC20.json';
import Web3 from 'web3';

import { getConfigByChainID } from '../../utils/Config'

class CommonContract {
  constructor(library, chainId) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._chainId = chainId;
  }

  // 获取合约对象
  getContract(contractAddress) {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(ERD20.abi, contractAddress);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  // 查询余额
  getBalanceOf(userAddress, contractAddress) {
    let contract = this.getContract(contractAddress);
    if (!contract) return;
    return contract.methods.balanceOf(userAddress).call();
  }

  // 获取授权额度
  getAllowance(userAddress, contractAddress) {
    let contract = this.getContract(contractAddress);
    if (!contract) return;
    return contract.methods.allowance(userAddress, getConfigByChainID(this._chainId).teemoContractAddress).call();
  }

  // 授权扣款
  approve(userAddress, contractAddress) {
    let contract = this.getContract(contractAddress);
    if (!contract) return;
    let amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    return contract.methods
      .approve(getConfigByChainID(this._chainId).teemoContractAddress, amount)
      .send({ from: userAddress })
      .on('error', function (error) {})
      .on('transactionHash', function (hash) {
        console.log(hash);
      })
      .on('receipt', (receipt) => {});
  }
}

export default CommonContract;
