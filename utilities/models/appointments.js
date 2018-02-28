import PropTypes from 'prop-types';

import AppointmentClientModel from './clients';
import AppointmentEmployeeModel from './employees';

const AppointmentServiceModel = {
  id: PropTypes.number,
  description: PropTypes.string,
};

const AppointmentModel = {
  background: PropTypes.string,
  checked_in: PropTypes.bool,
  client: PropTypes.shape(AppointmentClientModel),
  date: PropTypes.string,
  elapsed: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  employees: PropTypes.arrayOf(PropTypes.shape(AppointmentEmployeeModel)),
  enteredTime: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  estimatedTime: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  expectedStartTime: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  finishService: PropTypes.oneOf([null, PropTypes.string, PropTypes.bool]),
  groupId: PropTypes.oneOf([null, PropTypes.string, PropTypes.bool]),
  groupLead: PropTypes.oneOf([null, PropTypes.string, PropTypes.bool]),
  length: PropTypes.oneOf([null, PropTypes.string, PropTypes.number]),
  level: PropTypes.oneOf([null, PropTypes.string, PropTypes.number]),
  needStylist: PropTypes.oneOf([null, PropTypes.string, PropTypes.bool]),
  processTime: PropTypes.oneOf([null, PropTypes.string, PropTypes.number]),
  queueId: PropTypes.oneOf([null, PropTypes.string, PropTypes.number]),
  serviced: PropTypes.bool,
  servicedTime: PropTypes.oneOf([null, PropTypes.string, PropTypes.number]),
  services: PropTypes.arrayOf(PropTypes.shape(AppointmentServiceModel)),
  startTime: PropTypes.string,
  start_time: PropTypes.string,
  status: PropTypes.number,
  store_id: PropTypes.number,
  tZone: PropTypes.string,
  type: PropTypes.string,
};
export default AppointmentModel;
