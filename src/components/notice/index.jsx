import React , { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { isMobile } from 'react-device-detect';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider, useSnackbar } from 'notistack';
import './index.scss'
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { decodeEventLog } from '../../common/contract/abi';
import { chainConfig, ensumeChainId } from '../../components/wallet/Config'
import { fromWei } from 'web3-utils';

const CardBox = (props)=>{
    const POSITION = {
        vertical: 'top',
        horizontal: 'right'
    }
    // const AUTO_HIDE_DURATION = 7000000000
    const cardType = ()=>{
        const style = ['cardBox'];
        if(props.className){
            style.push(props.className);
        }
        return style.join(" ");
    }
    const notistackRef = React.createRef();

    const onClickDismiss = key => () => {
        notistackRef.current.closeSnackbar(key);
    }

    return (
        <div className={cardType()} style={props.style}>
            <SnackbarProvider maxSnack={7}
            className="SnackbarProvider_title"
            autoHideDuration={10000000000}
            anchorOrigin={POSITION}
            dense={isMobile}
            ref={notistackRef}
            action={(key) => (
                <IconButton key="close" aria-label="Close" color="inherit" onClick={onClickDismiss(key)}>
                    <CloseIcon style={{fontSize:"20px"}}/>
                </IconButton>
            )}
            >
            <MyApp content={props.content}/>
            </SnackbarProvider>
        </div>
    )

}
function MyApp(props) {
    // const { enqueueSnackbar } = useSnackbar();
    // const handleClick = () => {
    //   enqueueSnackbar(
    //       <div>
    //           <p className="title_first">您的订单已被止盈</p>
    //           <p>盈亏：1231231</p>
    //           <a href="">在浏览器中查看&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
    //       </div>
    //   );
    // };

    const { t } = useTranslation();
    const dispatch = useDispatch();
  
    const context = useWeb3React();
    const { active, account, library, chainId } = context;
    const { poolList } = useSelector((state) => state.contract);
    const { enqueueSnackbar } = useSnackbar();

    const openExplorer = (hash) => {
        window.open(`${chainConfig[ensumeChainId(chainId)].explorerUrl}/tx/${hash}`);
    };


    useEffect(() => {
        var subscription;
        if (active && account && library && library.provider && poolList.length > 0) {
            var web3 = new Web3(library.provider);
            subscription = web3.eth.subscribe('logs', {
            address: poolList.map((item) => item.poolAddr),
            }, (error, result) => {
                if (error) return;
                var log = decodeEventLog(result);
                if (account != log.userAddr) return;
                console.log(log);
                if (log._name === 'OpenMarketSwap' || log._name === 'OpenLimitSwap') {
                    enqueueSnackbar(
                        <div>
                            <p className="title_first">{t('Open_success')}</p>
                            <a onClick={e=> openExplorer(log._origin.transactionHash)}>{t('Show_in_browser')}&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
                        </div>
                    );
                } else if (log._name === 'CloseMarketSwap') {
                    enqueueSnackbar(
                        <div>
                            <p className="title_first">{t('Close_new')}</p>
                            <a onClick={e=> openExplorer(log._origin.transactionHash)}>{t('Show_in_browser')}&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
                        </div>
                    );
                } else if (log._name === 'TradeLimitSwap') {
                    enqueueSnackbar(
                        <div>
                            <p className="title_first">{t('Close_new')}</p>
                            <a onClick={e=> openExplorer(log._origin.transactionHash)}>{t('Show_in_browser')}&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
                        </div>
                    );
                } else if (log._name === 'CloseLimitSwap') {
                    enqueueSnackbar(
                        <div>
                            <p className="title_first">{t(log.plFlag == 1 ? 'TP_new' : log.plFlag == 0 ? (log.tokenAmount === log.plAmount ? 'Liguidated_new' : 'SL_new') : '')}</p>
                            <p>{t('pl__title', {p: fromWei(log.plAmount)})}</p>
                            <a onClick={e=> openExplorer(log._origin.transactionHash)}>{t('Show_in_browser')}&nbsp;<img src="/imgs/icon_scan.png" alt=""/></a>
                        </div>
                    );
                }
            });
        }
        return () => {
            if (subscription) {
                subscription.unsubscribe((error, success) => {
                if (success)
                    console.log('Successfully unsubscribed!');
                });
            }
        };
    }, [active, library, account, poolList]);

    return (
      <React.Fragment>
        {/* <div onClick={handleClick}>
            <span>
                {props.content}
            </span>
        </div> */}
      </React.Fragment>
    );
  }
export default CardBox;

