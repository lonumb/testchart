import Web3 from 'web3';
import TeemoConfig from './TeemoPool.json';

class TeemoContract {
  constructor(library, address) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._address = address;
  }
  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(TeemoConfig.abi, this._address);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }
  // 池子symbol
  async getSymbol() {
    if (!this.getContract()) return;
    return await this.getContract().methods.symbol().call();
  }

  // 持仓订单列表信息
  queryAllOrderList(address) {
    if (!this.getContract()) return;
    return this.getContract()
      .methods.getAllOrderInfo(address)
      .call()
      .then((res) => {
        let temp = [];
        // 
        res.allOrderID.forEach((element, index) => {
          temp.push({ id: element, symbol: res.allSymbol[index], amount: res.allTokenAmount[index], lever: res.allLever[index], dir: res.allBsFlag[index], price: res.allOpenPrice[index] });
        });
        return temp;
      });
  }
}

export default TeemoContract;
