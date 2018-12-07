import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import BlockTimesReasonsScreen from './BlockTimesReasonsScreen';
import blockTimesReasonsActions from '../../redux/actions/blockTimesReasons';

const mapStateToProps = state => ({
  blockTimesReasonsState: state.blockTimesReasonsReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  blockTimesReasonsActions: bindActionCreators (
    {...blockTimesReasonsActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (
  BlockTimesReasonsScreen
);
