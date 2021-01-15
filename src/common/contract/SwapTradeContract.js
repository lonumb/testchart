import SwapTrade from './abi/SwapTrade.json';
import BaseContract from './BaseContract'

class SwapTradeContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(poolInfo) {
    if (!this._web3) return;
    let contract = new this._web3.eth.Contract(SwapTrade.abi, poolInfo.swapTradeAddr, { from: this._userAddress });
    return contract;
  }

  //0所有 1已平仓 2未平仓
  getAllOrder(poolInfo, status = 0) {
    let contract = this.getContract(poolInfo);
    if (!contract) return;
    return contract.methods.getAllOrder(this._userAddress, status).call().then((data) => {
      let temp = [];
      let orderIds = data.orderIds || [];
      let orders = data.orders || [];
      orders.forEach((element, index) => {
        temp.push({...element, orderId: orderIds[index]});
      });
      return temp;
    });
  }

  //0所有 1:已撤单 2未成交 3已成交 4已撤单-已成交
  getAllLimitOrder(poolInfo, status = 0) {
    let contract = this.getContract(poolInfo);
    if (!contract) return;

    //return contract.methods.getAllLimitOrder(this._userAddress, status).call();
    return contract.methods.getAllLimitOrder(this._userAddress, status).call().then((data) => {
      let temp = [];
      let orderIds = data.orderIds || [];
      let orders = data.orders || [];
      orders.forEach((element, index) => {
        temp.push({...element, orderId: orderIds[index]});
      });
      return temp;
    });
  }

  // async getAllOrder(poolInfo) {
  //   let contract = this.getContract(poolInfo);
  //   if (!contract) return;
  //   var orderIds = contract.methods.allOrderUser(this._userAddress, 0).call();
  //   var promises = [];
  //   for (let i = 0;i < orderIds.length; i++) {
  //     promises[i] = contract.methods.allOrderHash(orderIds[i]).call().map((item) => {
  //       item.orderId = orderIds[i];
  //       return item;
  //     });
  //   }
  //   return Promise.all(promises).then((res) => {
  //     //排序
  //     console.log('order item: ', res);
  //     return res;
  //   });
  // }
}

export default SwapTradeContract;
