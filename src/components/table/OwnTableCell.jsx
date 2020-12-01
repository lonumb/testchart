import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

const OwnTableCell = withStyles((theme) => ({
  head: {
    fontSize: 14,
    color: '#8A94A6',
    padding: '10px',
    height: '20px',
    borderBottomColor: 'rgba(120, 138, 174,0.2)',
  },
  body: {
    fontSize: 14,
    color: '#F4F9FF',
    padding: '10px',
    height: '20px',
    borderBottomColor: 'rgba(120, 138, 174,0.2)',
  },
}))(TableCell);

export default OwnTableCell;
