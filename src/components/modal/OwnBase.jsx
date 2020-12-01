import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import './base.scss';

const OwnDialog = withStyles(() => ({
  paper: {
    background: '#252B44',
    boxShadow: '0px 10px 32px 0px rgba(38, 38, 38, 0.18)',
    borderRadius: '4px',
    color: '#ffffff',
    // minWidth: '384px',
    padding: '24px',
  },
}))(Dialog);

const OwnBaseDialog = (props) => {
  const { visible, title } = props;
  return (
    <OwnDialog onClose={props.onClose} open={visible}>
      <div className="modal-title">
        {title}
        <span className="close-icon" onClick={props.onClose}>
          <CloseRoundedIcon />
        </span>
      </div>
      {props.children}
    </OwnDialog>
  );
};

export default OwnBaseDialog;
