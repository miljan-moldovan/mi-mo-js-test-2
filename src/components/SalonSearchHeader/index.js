import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import salonSearchHeaderActions from '../../redux/reducers/searchHeader';
import SalonSearchHeader from './SalonSearchHeader';

const mapStateToProps = state => ({
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  salonSearchHeaderActions: bindActionCreators (
    {...salonSearchHeaderActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (SalonSearchHeader);
