import TeemoPool from './abi/TeemoPool.json';
import BaseContract from './BaseContract'

class TeemoPoolContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(contractAddress) {
    if (!this._web3) return;
    let contract = new this._web3.eth.Contract(TeemoPool.abi, contractAddress, { from: this._userAddress });
    return contract;
  }

  // 市价建仓
  openMarketSwap(poolAddr, symbol, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice) {
    console.log('openMarketSwap: ', poolAddr, symbol, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice);
    let contract = this.getContract(poolAddr);
    if (!contract) return;
    return contract.methods
      .openMarketSwap(symbol, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice)
      .send({ from: this._userAddress })
      .on('error', function (error) {})
      .on('transactionHash', function (hash) {
        console.log('openMarketSwap transactionHash: ', hash);
      })
      .on('receipt', (receipt) => {
        console.log('openMarketSwap receipt: ', receipt);
      });
  }
}

export default TeemoPoolContract;
