import PropTypes from 'prop-types';

const ClientNotesModel = {

};

const AppointmentClientModel = {
  attributes: PropTypes.any,
  birthday: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  id: PropTypes.number,
  lastName: PropTypes.string,
  member: PropTypes.oneOf([PropTypes.bool, PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  newClientGlobal: PropTypes.bool,
  newClientLocal: PropTypes.bool,
  notes: PropTypes.arrayOf(PropTypes.shape(ClientNotesModel)),
  online: PropTypes.bool,
};

export default AppointmentClientModel;
