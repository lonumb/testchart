import OwnBase from './OwnBase';
import './confirm.scss';

const OwnConfirm = (props) => {
  const { visible, title, cancelText = '取消', okText = '确认' } = props;
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
