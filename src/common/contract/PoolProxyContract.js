import PoolProxy from './abi/PoolProxy.json';
import { getConfigByChainID } from '../../utils/Config'
import BaseContract from './BaseContract'
import ERC20Contract from './ERC20Contract'
import SwapTradeContract from './SwapTradeContract'
import TeemoPool from './abi/TeemoPool.json';
const abicoder = require('web3-eth-abi');

class PoolProxyContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).poolProxyContractAddress;
      let contract = new this._web3.eth.Contract(PoolProxy, contractAddress, { from: this._userAddress });
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  // 池子列表基本信息
  async getAllPoolInfo() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getAllPoolInfo()
      .call()
      .then((data) => {
        let temp = [];
        if (data.allSymbol && data.allSymbol.length) {
          data.allSymbol.forEach((element, index) => {
            var poolAddr = data.allTeemoPoolAddr[index];
            var tokenAddr = data.allTokenAddr[index];
            var fundAddr = data.allFundAddr[index];
            var riskAddr = data.allRiskAddr[index];
            var swapTradeAddr = data.allSwapTradeAddr[index];
            var mineAddr = data.allMineAddr[index];
            var symbol = data.allSymbol[index];
            var decimals = data.allDecimals[index];
            var erc20Pool = tokenAddr !== '0x0000000000000000000000000000000000000000'
            if (!erc20Pool) {
              symbol = getConfigByChainID(this._chainId).mainSymbol;
            }
            //目前都是2
            var openDecimal = 2;
            temp.push({ 
              poolAddr, 
              tokenAddr, 
              lptokenAddr: poolAddr, 
              fundAddr, 
              riskAddr, 
              swapTradeAddr, 
              mineAddr, 
              symbol, 
              decimals, 
              lpdecimals: 18,
              erc20Pool,
              openDecimal,
            });
          });
        }
        return temp;
      });
  }

  //获取头寸信息
  async getAllPositionInfo() {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getAllPositionInfo()
      .call()
      .then((data) => {
        let temp = [];
        if (data.allTeemoPoolAddr && data.allTeemoPoolAddr.length) {
          data.allTeemoPoolAddr.forEach((element, index) => {
            var poolAddr = data.allTeemoPoolAddr[index];
            var totalAmount = data.allTotalAmount[index];
            var totalSupply = data.allTotalSupply[index];
            var totalTokenAmountIn = data.allTotalTokenAmountIn[index];
            var totalTokenAmountOut = data.allTotalTokenAmountOut[index];
            var totalTradeP = data.allTotalTradeP[index];
            var totalTradeL = data.allTotalTradeL[index];
            var longOrderTotalAmount = data.allLongOrderTotalAmount[index];
            var shortOrderTotalAmount = data.allShortOrderTotalAmount[index];
            var totalP = data.allTotalP[index];
            var totalL = data.allTotalL[index];

            temp.push({ 
              poolAddr, 
              totalAmount,
              totalSupply,
              totalTokenAmountIn,
              totalTokenAmountOut,
              totalTradeP,
              totalTradeL,
              longOrderTotalAmount,
              shortOrderTotalAmount,
              totalP,
              totalL,
            });
          });
        }
        return temp;
      });
  }

  async getPositionInfo(poolAddr) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getPositionInfo(poolAddr)
      .call();
  }

  async getLPAmount(poolAddr, tokenAmount) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getLPAmount(poolAddr, tokenAmount)
      .call();
  }

  async getTokenAmount(poolAddr, lpAmount) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getTokenAmount(poolAddr, lpAmount)
      .call();
  }

  getBalanceByPoolInfo(poolInfo, address = this._userAddress) {
    if (!this._web3 && !poolInfo) return Promise.error('web3 == null || poolInfo == null');
    if (poolInfo.erc20Pool) {
      var contract = new ERC20Contract(...this.getArgs());
      return contract.getBalanceOf(address, poolInfo.tokenAddr);
    } else {
      return this._web3.eth.getBalance(address);
    }
  }

  getPoolBalanceByPoolInfo(poolInfo) {
    if (!this._web3 && !poolInfo) return Promise.error('web3 == null || poolInfo == null');
    if (poolInfo.erc20Pool) {
      var contract = new ERC20Contract(...this.getArgs());
      return contract.getBalanceOf(poolInfo.poolAddr, poolInfo.tokenAddr);
    } else {
      return this._web3.eth.getBalance(poolInfo.poolAddr);
    }
  }

  getOrder(teemoPoolAddr, orderID) {
    let contract = this.getContract();
    if (!contract) return;
    return contract.methods
      .getOrder(teemoPoolAddr, orderID)
      .call();
  }

  getAllOrder(poolList, status = 0) {
    var swapTradeContract = new SwapTradeContract(this._library, this._chainId, this._userAddress);
    if (!swapTradeContract) return [];
    var promises = [];
    for (let poolInfo of poolList) {
      promises.push(swapTradeContract.getAllOrder(poolInfo, status).then((item) => {
        return item;
      }));
    }
    return Promise.all(promises).then((res) => {
      var list = [];
      for (let array of res) {
        // for (let item of array) {
        //   list.push(item);
        // }
        list = list.concat(array);
      }
      return list;
    });
  }

  getAllLimitOrder(poolList, status = 0) {
    var swapTradeContract = new SwapTradeContract(this._library, this._chainId, this._userAddress);
    if (!swapTradeContract) return [];
    var promises = [];
    for (let poolInfo of poolList) {
      promises.push(swapTradeContract.getAllLimitOrder(poolInfo, status));
    }
    return Promise.all(promises).then((res) => {
      var list = [];
      for (let array of res) {
        // for (let item of array) {
        //   list.push(item);
        // }
        list = list.concat(array);
      }
      return list;
    });
  }

  getLocalLastTrades(symbol) {
    var lastLogsStr = global.localStorage.getItem(`lastLogs_${this._chainId}_${symbol}`);
    let lastLogs = JSON.parse(lastLogsStr) || [];
    return lastLogs;
  }

  async queryLastTrades(poolList, symbol = 'btc/usdt') {
    if (!this._web3 || poolList.length == 0) return this.getLocalLastTrades() || [];
    const size = 30;
    var lastLogsStr = global.localStorage.getItem(`lastLogs_${this._chainId}_${symbol}`);
    let lastLogs = JSON.parse(lastLogsStr) || [];

    let lastScanBlock = 0;
    if (lastLogs && lastLogs.length > 0) {
      var log = lastLogs[lastLogs.length - 1];
      lastScanBlock = log.origin.blockNumber;
    }
    var blockNumber = await this._web3.eth.getBlockNumber();
    console.log('lastScanBlock: ', lastScanBlock, ' blockNumber: ', blockNumber);
    var logs = [];
    try {
      logs = await this.queryPoolEvents(poolList, lastScanBlock + 1, blockNumber);
      console.log('logs: ', logs);
    } catch (e) {
      console.log(e);
      return lastLogs;
    }
  
    let promises = [];
    for (let log of logs) {
      let contract = this.getContract();
      promises.push(log.order ? Promise.resolve(log.order) : contract.methods.getOrder(log.origin.address, log.orderID).call().then((res) => {
        log.order = res;
        return res;
      }));
    }
    try {
      let orders = await Promise.all(promises);
      console.log('orders: ', orders);
    } catch (e) {
      console.log(e);
      return lastLogs;
    }

    logs = logs.filter((item) => item.order.symbol == symbol)

    if (logs.length > size) {
      logs = logs.slice(logs.length - size, logs.length);
    }
    if (logs.length < size) {
        let index = lastLogs.length - 1;
        while (logs.length < size && index >= 0) {
            logs = [lastLogs[index]].concat(logs);
            index--;
        }
    }
    global.localStorage.setItem(`lastLogs_${this._chainId}_${symbol}`, JSON.stringify(logs));
    //global.localStorage.setItem(`lastScanBlock_${contractAddress}`, blockNumber);
    return logs.filter((item) => item.order.openPrice != 0);
  }

  queryPoolEvents(poolList, fromBlock = 1, toBlock) {
    if (!this._web3) return [];
    console.log('pool addrs: ', poolList.map((item) => item.poolAddr));
    return this._web3.eth.getPastLogs({
        fromBlock,
        toBlock,
        address: poolList.map((item) => item.poolAddr)
    }).then((res) => {
        var eventAbi = {};
        TeemoPool.forEach((item) => { 
            if (item.type === 'event') {
                let sign = item.name + '('
                let seq = '';
                for (let p of item['inputs']) {
                    sign += (seq + p.type);
                    seq = ',';
                }
                sign += ')'

                eventAbi[this._web3.utils.sha3(sign)] = item;
            }
        });
        //console.log(eventAbi);

        var result = [];
        res.forEach(async (item) => {
            //console.log(item);
            let abi = eventAbi[item.topics[0]];
            //console.log(abi);
            if (abi && abi.name) {
              let inputs = abi.inputs;
              let res = abicoder.decodeLog(inputs, item.data, item.topics.slice(1, item.topics.length));

              // if (abi.name == 'CloseMarketSwap' && res.closePrice != 0) {
              //   console.log('ss');
              // }
              if ((abi.name == 'OpenMarketSwap' && res.openPrice != 0)
              || abi.name == 'TradeLimitSwap'
              || abi.name == 'SetOrderPrice'
              || (abi.name == 'CloseMarketSwap' && res.closePrice != 0)) {
                
                res._name = abi.name;
                res._origin_name = abi.name;
                res.orderID = res.orderID || res._orderID;
                res.origin = item;

                if (res._name == 'SetOrderPrice') {
                  res._name = 'OpenMarketSwap';
                  res.openPrice = res._price;
                }
                if (res._name == 'TradeLimitSwap') {
                  res._name = 'OpenMarketSwap';
                }

                let pool = poolList.find((e) => e.poolAddr == item.address);

                res.openSymbol = pool.symbol;
                res.decimals = pool.decimals;

                if (res.timestamp) {
                  res.timestamp *= 1000;
                } else {
                  res.timestamp = new Date().getTime();
                }
                result.push(res);
              }
            }
        });
        return result.filter((item) => item._name != 'OpenMarketSwap' || item.openPrice != 0);
    });
  }
}

export default PoolProxyContract;
