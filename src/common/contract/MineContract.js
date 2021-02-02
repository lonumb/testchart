import Mine from './abi/Mine.json';
import BaseContract from './BaseContract';
import * as Tools from '../../utils/Tools';

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

  pendingTeemo(poolInfo) {
    let contract = this.getContract(poolInfo.mineAddr);
    if (!contract) return;
    return contract.methods.pendingTeemo(this._userAddress).call();
  }

  async getAllPoolPendingTeemo(poolList) {
    if (!this._web3 || !poolList || poolList.length == 0) return;
    let promises = [];
    for (let pool of poolList) {
      promises.push(this.pendingTeemo(pool));
    }
    // var array = await Promise.all(promises);
    // let sum = 0;
    // for (let balanceOf of (array || [])) {
    //   sum = Tools.plus(sum, balanceOf);
    // }
    // return sum;
    return Promise.all(promises).then((res) => {
      let sum = 0;
      for (let balanceOf of (res || [])) {
        sum = Tools.plus(sum, balanceOf);
      }
      return sum;
    });
  }
}

export default MineContract;
