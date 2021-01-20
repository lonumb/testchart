import PoolProxy from './abi/PoolProxy.json';
import { getConfigByChainID } from '../../utils/Config'
import BaseContract from './BaseContract'
import ERC20Contract from './ERC20Contract'
import SwapTradeContract from './SwapTradeContract'

class PoolProxyContract extends BaseContract {
  constructor(...args) {
    super(...args);
  }

  // 获取合约对象
  getContract() {
    if (!this._web3) return;
    if (!this._contract) {
      var contractAddress = getConfigByChainID(this._chainId).poolProxyContractAddress;
      let contract = new this._web3.eth.Contract(PoolProxy.abi, contractAddress, { from: this._userAddress });
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
              erc20Pool 
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

            temp.push({ 
              poolAddr, 
              totalAmount,
              totalSupply,
              totalTokenAmountIn,
              totalTokenAmountOut,
              totalTradeP,
              totalTradeL,
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
}

export default PoolProxyContract;
