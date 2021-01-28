import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';
import './sureModal.scss'
import * as Types from '../../store/types';
import { useSelector, useDispatch } from 'react-redux';
import { actionTransactionHashModal } from '../../store/actions/CommonAction';

const SureModal = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    //const { visible, title} = props;

    const { visible, hash } = useSelector((state) => {
        return state.common.transaction;
    });

    console.log(`visible: ${visible}`);

    const openExplorer = () => {
        alert('openExplorer');
    };
    const onClose = () => {
        //dispatch({ type: Types.TRANSACTION_HASH_VISIBLE, payload: { visible: false } });
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
