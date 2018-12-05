import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  appointmentCalendarActions,
} from '../../../redux/actions/appointmentBook';

import {InputSwitch} from '../../formHelpers';

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: '#110A24',
    fontFamily: 'Roboto',
    fontSize: 10,
    fontWeight: '500',
  },
  switchStyle: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}],
  },
});

const firstAvailableBtn = ({
  rootStyles,
  switchStyle,
  showFirstAvailable,
  appointmentBookAction,
}) => (
  <View style={[styles.container, rootStyles]}>
    <InputSwitch
      text="First Available"
      onChange={appointmentBookAction.changeFirstAvailable}
      textStyle={styles.textStyle}
      switchStyle={styles.switchStyle}
      textRight
      value={showFirstAvailable}
    />
  </View>
);

const mapStateToProps = state => ({
  showFirstAvailable: state.appointmentBookReducer.filterOptions
    .showFirstAvailable,
});

const mapActionsToProps = dispatch => ({
  appointmentBookAction: bindActionCreators (
    {...appointmentCalendarActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (firstAvailableBtn);
