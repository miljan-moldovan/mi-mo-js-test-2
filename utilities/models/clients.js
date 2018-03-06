import PropTypes from 'prop-types';

const ClientNotesModel = {

};

const AppointmentClientModel = {
  id: PropTypes.number,
  attributes: PropTypes.any,
  birthday: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  lastName: PropTypes.string,
  member: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  newClientGlobal: PropTypes.bool,
  newClientLocal: PropTypes.bool,
  notes: PropTypes.arrayOf(PropTypes.shape(ClientNotesModel)),
  online: PropTypes.bool,
};

export default AppointmentClientModel;
