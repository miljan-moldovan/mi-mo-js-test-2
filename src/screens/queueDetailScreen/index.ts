import {connect} from 'react-redux';
import * as actions from '../../redux/actions/queue';
import QueueDetailScreen from './QueueDetailScreen';

const mapStateToProps = state => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
});
export default connect (mapStateToProps, actions) (QueueDetailScreen);
