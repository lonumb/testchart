import OwnBase from './OwnBase';

const OwnAlert = (props) => {
  const { visible, title, okText = '我知道了' } = props;
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
