import { connect } from 'react-redux';
import { AppStore, ServiceItem } from '@/models';
import SelectResourceScreen from './SelectResourceScreen';
import newAppointmentActions from '@/redux/actions/newAppointment';

const mapStateToProps = (state: AppStore) => ({
  newApptState: state.newAppointmentReducer,
});
const mapDispatchToProps = dispatch => ({
  updateServiceItems: (serviceItems: ServiceItem[]) => dispatch(newAppointmentActions.updateServiceItems(serviceItems)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SelectResourceScreen);
