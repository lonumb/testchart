import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';
import './sureModal.scss'
import * as Types from '../../store/types';
import { useSelector, useDispatch } from 'react-redux';
import { actionTransactionHashModal } from '../../store/actions/CommonAction';
import { chainConfig, ensumeChainId } from '../../components/wallet/Config'
import { useWeb3React } from '@web3-react/core';

const SureModal = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { chainId } = useWeb3React();

    const { visible, hash } = useSelector((state) => {
        return state.common.transaction;
    });

    const openExplorer = () => {
        window.open(`${chainConfig[ensumeChainId(chainId)].explorerUrl}tx/${hash}`);
    };

    const onClose = () => {
        actionTransactionHashModal({ visible: false })(dispatch);
    };

    return (
        <div className="sureModalBox">
            <OwnBase visible={visible} onClose={onClose} title=''>
                <div className="sureModal">
                    <span className='submitted'>{t('Submitted')}</span>
                    <img src="/imgs/img_successful.png" alt=""/>
                    <span className='look' onClick={openExplorer}>{t('Show_in_browser')}</span>
                    <div className='sureModalBtn'>
                        <button onClick={onClose}>{t('Notice_button2')}</button>
                    </div>
                </div>
            </OwnBase>
        </div>
    )
};

export default SureModal;
