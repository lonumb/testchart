import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

// slider定制
const OwnSlider = withStyles({
  root: {
    color: '#0081FF',
    height: 4,
    padding: '15px 0',
  },
  thumb: {
    height: 10,
    width: 10,
    backgroundColor: '#0081FF',
    border: '1px solid currentColor',
    marginTop: -3,
    // marginLeft: -12,
    // '&:focus, &:hover, &:active': {
    //   boxShadow: 'inherit',
    // },
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  mark: {
    backgroundColor: '#0081FF',
    height: 8,
    width: 8,
    borderRadius: 4,
    marginTop: -2,
    marginLeft: -4,
  },
  markLabel: {
    color: '#788AAE',
    fontSize: '12px',
  },
  markActive: {
    opacity: 1,
  },
  rail: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#252B44',
  },
})(Slider);

export default OwnSlider;
