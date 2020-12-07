import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '../../components/table/OwnTable';
import TableHead from '../../components/table/OwnTableHead';
import TableBody from '../../components/table/OwnTableBody';
import TableRow from '../../components/table/OwnTableRow';
import TableCell from '../../components/table/OwnTableCell';
import { useSelector, useDispatch } from 'react-redux';
import * as Types from '../../store/types';
import './userAccount.scss';

import { useWeb3React } from '@web3-react/core';
import TeemoContract from '../../common/contract/TeemoContract';
import UsdtContract from '../../common/contract/UsdtContract';
import QuoteContract from '../../common/contract/QuoteContract';
import PoolContract from '../../common/contract/PoolContract';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [createData('BTC', 882931.762814, '0.000000', '0.000000', '0.000000'), createData('USDT', 11.000128, '0.000000', '0.000000', '0.000000')];

const UserAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const withdrawVisible = useSelector((state) => state.common.withdrawVisible);
  const rechargeVisible = useSelector((state) => state.common.rechargeVisible);

  const { library } = useWeb3React();

  useEffect(() => {
    let teemoContract = new TeemoContract(library);
    let usdtContract = new UsdtContract(library);
    let quoteContract = new QuoteContract(library);
    let poolContract = new PoolContract(library);
    let test = async () => {
      console.log(await teemoContract.getSymbol());
      console.log(await usdtContract.getSymbol());
      console.log('teemo:', await teemoContract.getContract());
      console.log('usdt:', await usdtContract.getContract());
      console.log('quote:', await quoteContract.getContract());
      console.log('pool:', await poolContract.getContract());
    };
    test();
  }, [library]);

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
                  <span className="table-link" onClick={() => dispatch({ type: Types.RECHARGE_VISIBLE, payload: { visible: !rechargeVisible, code: 'BTC' } })}>
                    {t('textRecharge')}
                  </span>
                  <span className="table-link" onClick={() => dispatch({ type: Types.WITHDRAW_VISIBLE, payload: { visible: !withdrawVisible, code: 'BTC' } })}>
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
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}-TLP
                </TableCell>
                <TableCell>{row.calories}</TableCell>
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
