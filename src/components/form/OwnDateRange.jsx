import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import './ownDateRange.scss';
import { getLang } from '../../i18n/LangUtil';

const OwnDateRange = (props) => {
  const lang = getLang();
  return <DateRangePicker {...props} locale={lang} />;
};

export default OwnDateRange;
