import TeemoPool from './abi/TeemoPool.json';
import TeemoWPool from './abi/TeemoWPool.json';
import BaseContract from './BaseContract'

class TeemoPoolContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract(poolInfo) {
    if (!this._web3) return;
    let contract = new this._web3.eth.Contract(poolInfo.erc20Pool ? TeemoPool.abi : TeemoWPool.abi, poolInfo.poolAddr, { from: this._userAddress });
    return contract;
  }

  // 市价建仓
  openMarketSwap(poolInfo, symbol, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice) {
    console.log('openMarketSwap: ', poolInfo.poolAddr, symbol, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice);
    let contract = this.getContract(poolInfo);
    if (!contract) return;
    if (poolInfo.erc20Pool) {
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
    return contract.methods
    .openMarketSwap(symbol, lever, bsFlag, pLimitPrice, lLimitPrice, maxPrice)
    .send({ from: this._userAddress, value: tokenAmount })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('openMarketSwap transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('openMarketSwap receipt: ', receipt);
    });
  }

  // 限价建仓
  openLimitSwap(poolInfo, symbol, limitPrice, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice) {
    console.log('openLimitSwap: ', poolInfo.poolAddr, symbol, limitPrice, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice);
    let contract = this.getContract(poolInfo);
    if (!contract) return;
    if (poolInfo.erc20Pool) {
      return contract.methods
        .openLimitSwap(symbol, limitPrice, tokenAmount, lever, bsFlag, pLimitPrice, lLimitPrice)
        .send({ from: this._userAddress })
        .on('error', function (error) {})
        .on('transactionHash', function (hash) {
          console.log('openLimitSwap transactionHash: ', hash);
        })
        .on('receipt', (receipt) => {
          console.log('openLimitSwap receipt: ', receipt);
        });
    }
    return contract.methods
    .openLimitSwap(symbol, limitPrice, lever, bsFlag, pLimitPrice, lLimitPrice)
    .send({ from: this._userAddress, value: tokenAmount })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('openLimitSwap transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('openLimitSwap receipt: ', receipt);
    });
  }
}

export default TeemoPoolContract;
