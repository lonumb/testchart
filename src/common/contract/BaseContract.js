import Web3 from 'web3';
import { ensumeChainId, supportedChainIds } from '../../components/wallet/Config'

class BaseContract {
  constructor(library, chainId, userAddress) {
    this._library = library;
    this._web3 = library && library.provider ? new Web3(library.provider) : null;
    this._chainId = ensumeChainId(chainId);
    this._userAddress = userAddress;
  }

  getArgs() {
    return [this._library, this._chainId, this._userAddress];
  }

  isSupportedChainId(chainId) {
    return supportedChainIds.indexOf(chainId) !== -1;
  }
}

export default BaseContract;
