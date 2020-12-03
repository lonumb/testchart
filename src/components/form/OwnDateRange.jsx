import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import './ownDateRange.scss';

const OwnDateRange = (props) => {
  return <DateRangePicker {...props} />;
};

export default OwnDateRange;
