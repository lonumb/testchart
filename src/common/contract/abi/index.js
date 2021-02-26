//import { sha3 } from 'web3-utils';
import TeemoPool from './TeemoPool.json';
const abicoder = require('web3-eth-abi');

//export const teemoPoolEventAbi = TeemoPool.filter((item) => item.type == 'event');

export const teemoPoolEventMap = (() => {
    var eventAbi = {};
    TeemoPool.filter((item) => item.type == 'event').forEach((item) => {
        eventAbi[item.hash] = item;
    });
    return eventAbi;
})();

export const decodeEventLog = (log) => {
    if (!log || !log.topics) return {};
    let abi = teemoPoolEventMap[log.topics[0]];
    if (!abi || !abi.name) return {};
    let inputs = abi.inputs;
    var res = abicoder.decodeLog(inputs, log.data, log.topics.slice(1, log.topics.length));
    res._name = abi.name;
    return res;
};