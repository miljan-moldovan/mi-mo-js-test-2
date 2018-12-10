import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import rebookDialogActions from '../../redux/actions/rebookDialog';
import RebookDialogScreen from './rebookDialogScreen';

const mapStateToProps = state => ({
  rebookState: state.rebookReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  rebookDialogActions: bindActionCreators ({...rebookDialogActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (
  RebookDialogScreen
);
