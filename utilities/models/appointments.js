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
  elapsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  employees: PropTypes.arrayOf(PropTypes.shape(AppointmentEmployeeModel)),
  enteredTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  estimatedTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  expectedStartTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  finishService: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  groupLead: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  needStylist: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  processTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  queueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  serviced: PropTypes.bool,
  servicedTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  services: PropTypes.arrayOf(PropTypes.shape(AppointmentServiceModel)),
  startTime: PropTypes.string,
  start_time: PropTypes.string,
  status: PropTypes.number,
  store_id: PropTypes.number,
  tZone: PropTypes.string,
  type: PropTypes.string,
};
export default AppointmentModel;
