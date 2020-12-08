import ERD20 from './ERC20.json';
import Web3 from 'web3';

class CommonContract {
  constructor(library) {
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
  }

  // 获取合约对象
  getContract(contractAddress) {
    if (!this._web3) return;
    if (!this._contract) {
      let contract = new this._web3.eth.Contract(ERD20.abi, contractAddress);
      this._contract = contract;
      return contract;
    } else {
      return this._contract;
    }
  }

  // 查询余额
  getBalanceOf(userAddress, contractAddress) {
    let contract = this.getContract(contractAddress);
    if (!contract) return;
    return contract.methods.balanceOf(userAddress).call();
  }

  // // 获取授权额度 ----- 待定
  // async getAllowance(web3, erc20ContractAddress, userAddress, senderContractAddress = config.tenet_contract_address) {
  //   var contract = new web3.eth.Contract(config.erc20_abi, erc20ContractAddress);
  //   var allowanceAmount = await contract.methods.allowance(userAddress, senderContractAddress).call();

  //   return allowanceAmount;
  // }

  // // 授权扣款 ----- 待定
  // approve(web3, erc20ContractAddress, userAddress, amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
  //   var contract = new web3.eth.Contract(config.erc20_abi, erc20ContractAddress);
  //   return contract.methods
  //     .approve(config.tenet_contract_address, amount)
  //     .send({ from: userAddress })
  //     .on('error', function (error) {})
  //     .on('transactionHash', function (transactionHash) {})
  //     .on('receipt', (receipt) => {});
  // }
}

export default CommonContract;
