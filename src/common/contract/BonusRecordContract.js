import BonusRecord from './abi/BonusRecord.json';
import BaseContract from './BaseContract'
import { getConfigByChainID } from '../../utils/Config'

class BonusRecordContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    var contractAddress = getConfigByChainID(this._chainId).bonusRecordContractAddress;
    let contract = new this._web3.eth.Contract(BonusRecord, contractAddress, { from: this._userAddress });
    return contract;
  }

  getBonus() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods.getBonus(this._userAddress).call().then((res) => {
        return {
            userLBonus: res.userLBonus || res['0'],
            userSBonus: res.userSBonus || res['1'],
        };
    });
  }
}

export default BonusRecordContract;
