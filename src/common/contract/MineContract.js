import Mine from './abi/Mine.json';
import BaseContract from './BaseContract'

class MineContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(mineAddr) {
    if (!this._web3) return;
    let contract = new this._web3.eth.Contract(Mine, mineAddr, { from: this._userAddress });
    return contract;
  }

  getUserInfo(poolInfo) {
    let contract = this.getContract(poolInfo.mineAddr);
    if (!contract) return;
    return contract.methods.userInfo(this._userAddress).call();
  }
}

export default MineContract;
