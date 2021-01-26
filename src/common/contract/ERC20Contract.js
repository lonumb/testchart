import ERC20 from './abi/ERC20.json';
import BaseContract from './BaseContract'

import { getConfigByChainID } from '../../utils/Config'
import { MAX_UINT256_VALUE } from '../../utils/Constants'

class ERC20Contract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(tokenContractAddress) {
    if (!this._web3) return;
    // if (!this._contract) {
    //   let contract = new this._web3.eth.Contract(ERC20, tokenContractAddress);
    //   this._contract = contract;
    //   return contract;
    // } else {
    //   return this._contract;
    // }
    let contract = new this._web3.eth.Contract(ERC20, tokenContractAddress);
    return contract;
  }

  // 查询余额
  getBalanceOf(userAddress, tokenContractAddress) {
    let contract = this.getContract(tokenContractAddress);
    if (!contract) return;
    //console.log('contract.methods', contract.methods);
    return contract.methods.balanceOf(userAddress).call();
  }

  // 获取授权额度
  getAllowance(userAddress, tokenContractAddress, spender) {
    //console.log('getAllowance', userAddress, tokenContractAddress, spender);
    let contract = this.getContract(tokenContractAddress);
    if (!contract) return;
    return contract.methods.allowance(userAddress, spender).call();
  }

  // 授权扣款
  approve(userAddress, tokenContractAddress, spender) {
    let contract = this.getContract(tokenContractAddress);
    if (!contract) return;
    return contract.methods
      .approve(spender, MAX_UINT256_VALUE)
      .send({ from: userAddress })
      .on('error', function (error) {})
      .on('transactionHash', function (hash) {
        console.log('approve transactionHash: ', hash);
      })
      .on('receipt', (receipt) => {
        console.log('approve receipt: ', receipt);
      });
  }
}

export default ERC20Contract;
