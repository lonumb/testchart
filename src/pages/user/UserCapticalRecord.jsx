import React, { useState } from 'react';
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
  const [type, setType] = useState(1); // 类型
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
        <div className="title">交易账户总价值</div>
        <ul className="tab-box">
          <li className={`item ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
            充值
          </li>
          <li className={`item ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
            提现
          </li>
          <li className={`item ${type === 3 ? 'active' : ''}`} onClick={() => setType(3)}>
            委托
          </li>
          <li className={`item ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
            平仓
          </li>
          <li className={`item ${type === 5 ? 'active' : ''}`} onClick={() => setType(5)}>
            流动池
          </li>
        </ul>
      </div>
      <div className="search-box">
        <div className="form-ele-box">
          <label htmlFor="">时间(UTC+8)</label>
          <div className="from-ele">
            <OwnDateRange onChange={setDateRange} value={dateRange} clearIcon={null} format="y-MM-dd" />
          </div>
        </div>
        <div className="form-ele-box">
          <label htmlFor="">币种</label>
          <div className="from-ele">
            <NativeSelect value={currency} onChange={currencyChange} input={<OwnInput />}>
              <option value="">请选择</option>
              <option value="BTC">BTC</option>
              <option value="USDT">USDT</option>
            </NativeSelect>
          </div>
        </div>

        <div className="form-ele-box">
          <label htmlFor=""></label>
          <div className="from-ele">
            <button className="btn-default" onClick={() => handleReset()}>
              重置
            </button>
            <button className="btn-primary" onClick={() => handleSearch()}>
              搜索
            </button>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        {(type === 1 || type === 2) && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>时间</TableCell>
                <TableCell>币种</TableCell>
                <TableCell>数量</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>状态</TableCell>
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
                <TableCell>时间(UTC+8)</TableCell>
                <TableCell>交易对</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>方向</TableCell>
                <TableCell>价格</TableCell>
                <TableCell>保证金</TableCell>
                <TableCell>杠杆</TableCell>
                <TableCell>止盈</TableCell>
                <TableCell>止损</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>状态</TableCell>
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
                <TableCell>平仓时间(UTC+8)</TableCell>
                <TableCell>交易对</TableCell>
                <TableCell>平仓价</TableCell>
                <TableCell>保证金</TableCell>
                <TableCell>杠杆</TableCell>
                <TableCell>盈亏</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>平仓类型</TableCell>
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
                <TableCell>平仓时间(UTC+8)</TableCell>
                <TableCell>流动池</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>数量</TableCell>
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
