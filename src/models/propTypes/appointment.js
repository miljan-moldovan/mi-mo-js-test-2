import PropTypes from 'prop-types';
import Client from './client';

export default PropTypes.shape({
  id: PropTypes.number,
  fromTime: PropTypes.string,
  toTime: PropTypes.string,
  date: PropTypes.string,
  client: Client,
});
