import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import RemovalReasonTypesScreen from './RemovalReasonTypesScreen';
import removalReasonTypesActions from '../../redux/actions/removalReasonTypes';

const mapStateToProps = state => ({
  removalReasonTypesState: state.removalReasonTypesReducer,
  loading: state.queue.loading,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  removalReasonTypesActions: bindActionCreators (
    {...removalReasonTypesActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (
  RemovalReasonTypesScreen
);
