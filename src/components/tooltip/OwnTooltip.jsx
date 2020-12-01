import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const OwnTooltip = withStyles(() => ({
  root: {
    marginTop: '-10px',
  },
  arrow: { color: '#252B44' },
  tooltip: {
    backgroundColor: '#252B44',
    color: 'rgba(255,255,255,0.68)',
    lineHeight: '1.5',
  },
}))(Tooltip);

export default OwnTooltip;
