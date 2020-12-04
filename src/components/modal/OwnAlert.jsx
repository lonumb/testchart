import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';

const OwnAlert = (props) => {
  const { t } = useTranslation();

  const { visible, title, okText = t('btnKnow') } = props;
  return (
    <OwnBase onClose={props.onClose} visible={visible} title={title}>
      {props.children}
      <button className="btn-primary" style={{ height: '48px', marginTop: '24px' }}>
        {okText}
      </button>
    </OwnBase>
  );
};

export default OwnAlert;
