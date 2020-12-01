import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const OwnInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: 0,
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#1F253D',
    border: '1px solid #455069',
    color: '#788AAE',
    fontSize: 16,
    minWidth: '134px',
    padding: '10px 12px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

export default OwnInput;
