import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

const OwnPopover = withStyles(() => ({
  paper: {
    background: 'transparent',
    borderRadius: '4px',
    color: '#ffffff',
    // padding: '16px',
  },
}))(Popover);

export default OwnPopover;
