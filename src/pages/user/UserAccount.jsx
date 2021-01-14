import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '../../components/table/OwnTable';
import TableHead from '../../components/table/OwnTableHead';
import TableBody from '../../components/table/OwnTableBody';
import TableRow from '../../components/table/OwnTableRow';
import TableCell from '../../components/table/OwnTableCell';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import { actionRechargeModal, actionWithdrawModal } from '../../store/actions/CommonAction';
import './userAccount.scss';
import chainConfig from '../../components/wallet/Config'

import { useWeb3React } from '@web3-react/core';
import TeemoContract from '../../common/contract/TeemoContract';
import UsdtContract from '../../common/contract/UsdtContract';
import QuoteContract from '../../common/contract/QuoteContract';
import PoolContract from '../../common/contract/PoolContract';
import CommonContract from '../../common/contract/CommonContract';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [createData('BTC', 882931.762814, '0.000000', '0.000000', '0.000000'), createData('USDT', 11.000128, '0.000000', '0.000000', '0.000000')];

let commonContract = null;
// 查询余额方法
const getBalance = (address, tokenAddr) => {
  if (!commonContract || !address || !tokenAddr) return;
  return commonContract.getBalanceOf(address, tokenAddr);
};
// 查询可质押余额
const getBalancePledge = (address, tokenAddr) => {
  if (!commonContract || !address || !tokenAddr) return;
  return commonContract.getBalanceOf(address, tokenAddr);
};
// 查询可解锁余额
const getBalanceUnlock = (address, tokenAddr) => {
  if (!commonContract || !address || !tokenAddr) return;
  return commonContract.getBalanceOf(address, tokenAddr);
};

const UserAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { library, account, chainId } = useWeb3React();
  const withdrawVisible = useSelector((state) => state.common.withdrawVisible); // 充值弹窗
  const rechargeVisible = useSelector((state) => state.common.rechargeVisible); // 提现弹窗
  const { poolList = [] } = useSelector((state) => state.contract); // 流动池账户列表
  const [poolBalance, setPoolBalance] = useState({}); // 余额map

  // 测试
  useEffect(() => {
    let teemoContract = new TeemoContract(library);
    let usdtContract = new UsdtContract(library);
    let quoteContract = new QuoteContract(library);
    let poolContract = new PoolContract(library, chainId || chainConfig.defaultChainId, account);
    let test = async () => {
      console.log(await teemoContract.getSymbol());
      console.log(await usdtContract.getSymbol());
      console.log('teemo:', await teemoContract.getContract());
      console.log('usdt:', await usdtContract.getContract());
      console.log('quote:', await quoteContract.getContract());
      console.log('pool:', await poolContract.getContract());
      console.log('pool:', await poolContract.getAllPoolInfo());
    };
    test();
  }, [library]);

  // 查询余额
  useEffect(() => {
    if (!library || !account) return;
    commonContract = new CommonContract(library);
    let temp = {};
    poolList.forEach(async (element) => {
      temp[element.symbol] = await getBalance(account, element.tokenAddr);
    });
    setPoolBalance(temp);
  }, [library, account, poolList]);

  function pledgeFunc() {}
  function unlockFunc() {}

  return (
    <div className="user-account">
      <div className="account-total">
        <div className="title">{t('accountTitle')}</div>
        <div className="amount">
          <span>0.34468139</span> BTC ≈ $ 3975.54363818
        </div>
      </div>
      <div className="gap-row"></div>
      <div className="table-wrap">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('textCurrency')}</TableCell>
              <TableCell>
                <span className="tip-text">{t('textAvailable')}(Layer2)</span>
              </TableCell>
              <TableCell>{t('textFreeze')}</TableCell>
              <TableCell>
                <span className="tip-text">{t('textAvailable')}(ETH Main)</span>
              </TableCell>
              <TableCell>{t('textOperation')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.calories}</TableCell>
                <TableCell>{row.fat}</TableCell>
                <TableCell>{row.carbs}</TableCell>
                <TableCell>
                  <span className="table-link" onClick={() => actionRechargeModal({ visible: !rechargeVisible, code: 'BTC' })(dispatch)}>
                    {t('textRecharge')}
                  </span>
                  <span className="table-link" onClick={() => actionWithdrawModal({ visible: !withdrawVisible, code: 'BTC' })(dispatch)}>
                    {t('textWithdraw')}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="gap-row"></div>
      <div className="table-wrap">
        <div className="table-title">{t('accountPool')}</div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('textCurrency')}</TableCell>
              <TableCell>
                <span className="tip-text">{t('textAvailable')}(Layer2)</span>
              </TableCell>
              <TableCell>{t('textOperation')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {poolList.map((item, index) => (
              <TableRow key={`pool-list-${index}`}>
                <TableCell component="th" scope="row">
                  {item.symbol}-TLP
                </TableCell>
                <TableCell>{poolBalance[item.symbol] || 0}</TableCell>
                <TableCell>
                  <span className="table-link">{t('btnPledge')}</span>
                  <span className="table-link">{t('btnUnlock')}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserAccount;
