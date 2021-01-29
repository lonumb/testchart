import Fund from './abi/Fund.json';
import BaseContract from './BaseContract'
import { toBN, toWei } from 'web3-utils';

class FundContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(poolInfo) {
    if (!this._web3) return;
    let contract = new this._web3.eth.Contract(Fund, poolInfo.fundAddr, { from: this._userAddress });
    return contract;
  }

  //获取池子总量
  getPoolTotalAmount(poolInfo) {
    let contract = this.getContract(poolInfo);
    if (!contract) return;
    return contract.methods.totalAmount().call().then((res) => {
      return toBN(res).add(toWei('100000')).toString();
    });
  }

  //获取用户质押
  getUserFundInfo(poolInfo) {
    let contract = this.getContract(poolInfo);
    if (!contract) return;
    return contract.methods.allUserFund(this._userAddress).call();
  }
}

export default FundContract;
