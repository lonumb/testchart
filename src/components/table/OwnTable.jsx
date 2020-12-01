import Table from '@material-ui/core/Table';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const OwnTable = withStyles((theme) => ({
  root: {
    width: useStyles.table,
  },
}))(Table);

export default OwnTable;
