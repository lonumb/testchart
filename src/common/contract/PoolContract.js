import Web3 from 'web3';
import PoolFactory from './PoolFactory.json';
const ADDRESS = process.env.REACT_APP_ADDRESS_POOL;

class PoolContract {
  constructor(library, address) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._address = address;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(PoolFactory.abi, ADDRESS, { from: this._address });
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
    return contract.methods.balanceOf(this._address).call();
  }
}

export default PoolContract;
