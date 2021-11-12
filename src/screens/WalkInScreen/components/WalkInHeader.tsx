import * as React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import styles from '../styles';

const WalkInHeader = props => (
  <View style={styles.titleContainer}>
    <Text style={styles.titleText}>WalkIn</Text>
    <Text style={styles.subTitleText}>  { `${props.walkInState.estimatedWaitTime}m Est. Wait` }</Text>
  </View>);

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});
export default connect(mapStateToProps)(WalkInHeader);
