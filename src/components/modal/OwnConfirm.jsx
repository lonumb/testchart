import { useTranslation } from 'react-i18next';
import OwnBase from './OwnBase';
import './confirm.scss';

const OwnConfirm = (props) => {
  const { t } = useTranslation();

  const { visible, title, cancelText = t('btnCancel'), okText = t('btnConfirm') } = props;
  return (
    <OwnBase onClose={props.onClose} visible={visible} title={title}>
      {props.children}
      <div className="confirm-btn">
        <button className="btn-default">{cancelText}</button>
        <button className="btn-primary">{okText}</button>
      </div>
    </OwnBase>
  );
};

export default OwnConfirm;
