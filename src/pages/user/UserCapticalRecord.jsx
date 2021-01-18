import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '../../components/table/OwnTable';
import TableHead from '../../components/table/OwnTableHead';
import TableBody from '../../components/table/OwnTableBody';
import TableRow from '../../components/table/OwnTableRow';
import TableCell from '../../components/table/OwnTableCell';
import NativeSelect from '@material-ui/core/NativeSelect';
import OwnInput from '../../components/form/OwnInput';
import OwnDateRange from '../../components/form/OwnDateRange';

import './userCapticalRecord.scss';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [createData('BTC', 882931.762814, '0.000000', '0.000000', '0.000000'), createData('USDT', 11.000128, '0.000000', '0.000000', '0.000000')];

const UserAccount = () => {
  const { t } = useTranslation();
  const [type, setType] = useState(3); // 类型
  const [currency, setCurrency] = useState(''); // 币种
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const currencyChange = (event) => {
    setCurrency(event.target.value);
  };
  // 搜索查询
  function handleSearch() {
    console.log(dateRange);
  }

  // 重置
  function handleReset() {}

  return (
    <div className="user-capital-record">
      <div className="head-box">
        <div className="title">{t('menuRecord')}</div>
        <ul className="tab-box">
          {/* <li className={`item ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
            {t('textRecharge')}
          </li>
          <li className={`item ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
            {t('textWithdraw')}
          </li> */}
          <li className={`item ${type === 3 ? 'active' : ''}`} onClick={() => setType(3)}>
            {t('textEntrust')}
          </li>
          <li className={`item ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
            {t('textClose')}
          </li>
          <li className={`item ${type === 5 ? 'active' : ''}`} onClick={() => setType(5)}>
            {t('navPool')}
          </li>
        </ul>
      </div>
      <div className="search-box">
        {/* <div className="form-ele-box">
          <label htmlFor="">{t('textTime')}(UTC+8)</label>
          <div className="from-ele">
            <OwnDateRange onChange={setDateRange} value={dateRange} clearIcon={null} format="y-MM-dd" />
          </div>
        </div> */}
        <div className="form-ele-box">
          <label htmlFor="">{t('textCurrency')}</label>
          <div className="from-ele">
            <NativeSelect value={currency} onChange={currencyChange} input={<OwnInput />}>
              <option value="">{t('textSelectTip')}</option>
              <option value="BTC">BTC</option>
              <option value="USDT">USDT</option>
            </NativeSelect>
          </div>
        </div>

        {/* <div className="form-ele-box">
          <label htmlFor=""></label>
          <div className="from-ele">
            <button className="btn-default" onClick={() => handleReset()}>
              {t('btnReset')}
            </button>
            <button className="btn-primary" onClick={() => handleSearch()}>
              {t('btnSearch')}
            </button>
          </div>
        </div> */}
      </div>
      <div className="table-wrap">
        {(type === 1 || type === 2) && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textTime')}</TableCell>
                <TableCell>{t('textCurrency')}</TableCell>
                <TableCell>{t('textNum')}</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>{t('textStatus')}</TableCell>
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
                  <TableCell>已提交</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 3 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textTime')}(UTC+8)</TableCell>
                <TableCell>{t('textProductCode')}</TableCell>
                <TableCell>{t('textType')}</TableCell>
                <TableCell>{t('textDir')}</TableCell>
                <TableCell>{t('textPrice')}</TableCell>
                <TableCell>{t('textBond')}</TableCell>
                <TableCell>{t('textLever')}</TableCell>
                <TableCell>{t('textProfit')}</TableCell>
                <TableCell>{t('textStop')}</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>{t('textStatus')}</TableCell>
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
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 4 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textCloseTime')}(UTC+8)</TableCell>
                <TableCell>{t('textProductCode')}</TableCell>
                <TableCell>{t('textClosePrice')}</TableCell>
                <TableCell>{t('textBond')}</TableCell>
                <TableCell>{t('textLever')}</TableCell>
                <TableCell>{t('textProfitStop')}</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>{t('textCloseType')}</TableCell>
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
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 5 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('textCloseTime')}(UTC+8)</TableCell>
                <TableCell>{t('navPool')}</TableCell>
                <TableCell>{t('textType')}</TableCell>
                <TableCell>{t('textNum')}</TableCell>
                <TableCell>LPToken</TableCell>
                <TableCell>Txid</TableCell>
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
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
