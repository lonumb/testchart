import OwnBase from './OwnBase';

const OwnDialog = (props) => {
  const { visible, title, onClose, children } = props;
  return (
    <OwnBase onClose={onClose} visible={visible} title={title}>
      {children}
    </OwnBase>
  );
};

export default OwnDialog;
