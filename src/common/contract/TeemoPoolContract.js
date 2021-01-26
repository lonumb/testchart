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
    let contract = new this._web3.eth.Contract(poolInfo.erc20Pool ? TeemoPool : TeemoWPool, poolInfo.poolAddr, { from: this._userAddress });
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

  //永续合约市价平仓
  closeMarketSwap(poolInfo, order) {
    console.log('closeMarketSwap: ', order);
    let contract = this.getContract(poolInfo);
    if (!contract) return;
   
    return contract.methods
    .closeMarketSwap(order.orderId)
    .send({ from: this._userAddress })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('closeMarketSwap transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('closeMarketSwap receipt: ', receipt);
    });
  }

  // 永续合约取消限价单
  cancelLimitSwap(poolInfo, order) {
    console.log('cancelLimitSwap: ', order);
    let contract = this.getContract(poolInfo);
    if (!contract) return;
   
    return contract.methods
    .cancelLimitSwap(order.orderId)
    .send({ from: this._userAddress })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('cancelLimitSwap transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('cancelLimitSwap receipt: ', receipt);
    });
  }

  // 永续合约订单更新止盈止损根据价格
  updateSwapByPrice(poolInfo, order, pLimitPrice, lLimitPrice) {
    console.log('updateSwapByPrice: ', poolInfo, order, pLimitPrice, lLimitPrice);
    let contract = this.getContract(poolInfo);
    if (!contract) return;

    return contract.methods
    .updateSwapByPrice(order.orderId, pLimitPrice, lLimitPrice)
    .send({ from: this._userAddress })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('updateSwapByPrice transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('updateSwapByPrice receipt: ', receipt);
    });
  }

  // 永续合约订单更新止盈止损根据比例
  updateSwapByRate(poolInfo, order, pLimitRate, lLimitRate) {
    console.log('updateSwapByRate: ', poolInfo, order, pLimitRate, lLimitRate);
    let contract = this.getContract(poolInfo);
    if (!contract) return;

    return contract.methods
    .updateSwapByPrice(order.orderId, pLimitRate, lLimitRate)
    .send({ from: this._userAddress })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('updateSwapByRate transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('updateSwapByRate receipt: ', receipt);
    });
  }

  // LP充值
  lpDeposit(poolInfo, tokenAmount, mine = false) {
    console.log('lpDeposit: ', poolInfo, tokenAmount, mine);
    let contract = this.getContract(poolInfo);
    if (!contract) return;

    if (poolInfo.erc20Pool) {
      return contract.methods
      .lpDeposit(tokenAmount, mine)
      .send({ from: this._userAddress })
      .on('error', function (error) {})
      .on('transactionHash', function (hash) {
        console.log('lpDeposit transactionHash: ', hash);
      })
      .on('receipt', (receipt) => {
        console.log('lpDeposit receipt: ', receipt);
      });
    }
    return contract.methods
    .lpDeposit(mine)
    .send({ from: this._userAddress, value: tokenAmount })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('lpDeposit transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('lpDeposit receipt: ', receipt);
    });
  }

  // LP提现
  lpWithdraw(poolInfo, lpAmount) {
    console.log('lpWithdraw: ', poolInfo, lpAmount);
    let contract = this.getContract(poolInfo);
    if (!contract) return;

    return contract.methods
    .lpWithdraw(lpAmount)
    .send({ from: this._userAddress })
    .on('error', function (error) {})
    .on('transactionHash', function (hash) {
      console.log('lpWithdraw transactionHash: ', hash);
    })
    .on('receipt', (receipt) => {
      console.log('lpWithdraw receipt: ', receipt);
    });
  }
}

export default TeemoPoolContract;
