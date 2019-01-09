import { connect } from 'react-redux';
import roomActions from '@/redux/actions/store';
import { AppStore } from '@/models';
import SelectRoomScreen from './SelectRoomScreen';

const mapStateToProps = (state: AppStore) => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SelectRoomScreen);
