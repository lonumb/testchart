import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';
import './sureModal.scss'
const SureModal = (props) => {
    const { t } = useTranslation();

    const { visible, title} = props;
  return (
      <div className="sureModalBox">
            <OwnBase onClose={props.onClose} visible={visible} title={title}>
                <div className="sureModal" visible={true}>
                    <span className='submitted'>{t('Submitted')}</span>
                    <img src="/imgs/img_successful.png" alt=""/>
                    <span className='look'>{t('Show_in_browser')}</span>
                    <div className='sureModalBtn'>
                        <button>{t('Notice_button2')}</button>
                    </div>
                </div>
            </OwnBase>
      </div>

  )
};

export default SureModal;
