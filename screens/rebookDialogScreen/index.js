import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import rebookDialogActions from '../../actions/rebookDialog';
import RebookDialogScreen from './rebookDialogScreen';

const mapStateToProps = state => ({
  rebookDialogState: state.rebookDialogReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  rebookDialogActions: bindActionCreators({ ...rebookDialogActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(RebookDialogScreen);
