import PropTypes from 'prop-types';

const AppointmentEmployeeModel = {
  id: PropTypes.number,
  lastName: PropTypes.string,
  middleName: PropTypes.oneOf([null, PropTypes.string]),
  name: PropTypes.string,
  serviceId: PropTypes.number,
  storeId: PropTypes.number,
};
