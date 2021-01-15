// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import '../entrust.scss';
// import OwnTooltip from '../../../tooltip/OwnTooltip';

// const HoldPositionComponent = (props) => {
//     const { t } = useTranslation();

//     let active = props.active || false;
//     let recordList = props.recordList || [];
//     return (
//         <div className="table-box">
//         <div className="table-head">
//           <div className="table-column">合约</div>
//           <div className="table-column">{t('textDir')}</div>

//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('entrustPriceDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('entrustPrice')}</span>
//             </OwnTooltip>
//           </div>

//           <div className="table-column">{t('textBond')}</div>
//           <div className="table-column">{t('textLever')}</div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('textCapitalDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('textCapital')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('textPositionDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('textPosition')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('entrustCalcClosePriceDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('entrustCalcClosePrice')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('entrustCalcProfitStopDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('entrustCalcProfitStop')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('textProfitPriceDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('textProfitPrice')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column tip-text">
//             <OwnTooltip title={<React.Fragment>{t('textStopPriceDesc')}</React.Fragment>} arrow placement="bottom">
//               <span>{t('textStopPrice')}</span>
//             </OwnTooltip>
//           </div>
//           <div className="table-column">{t('textOperation')}</div>
//         </div>

//         {active ? (
//           recordList.map((item, index) => {
//             return (
//               <div className="table-row" key={`en${index}`}>
//                 <div className="table-column">BTCUSDT</div>
//                 <div className="table-column green">买涨</div>
//                 <div className="table-column">17526.22</div>
//                 <div className="table-column">9129.22 USDT</div>
//                 <div className="table-column">10x</div>
//                 <div className="table-column">+7182.92 USDT</div>
//                 <div className="table-column">88.88 USDT</div>
//                 <div className="table-column">171292.11</div>
//                 <div className="table-column">+9128.23 USDT</div>
//                 <div className="table-column" onClick={() => setVisible(true)}>
//                   18101.22 <Edit style={{ fontSize: '14px' }} />
//                 </div>
//                 <div className="table-column" onClick={() => setVisible(true)}>
//                   {t('entrustSPPriceTip')} <Edit style={{ fontSize: '14px' }} />
//                 </div>
//                 <div className="table-column">
//                   <span className="link">{t('textClose')}</span>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="no-login">
//             <button className="btn-primary">{t('walletUnconnectTip')}</button>
//           </div>
//         )}
//       </div>
//     );
// }

// export default HoldPositionComponent;