import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const WalkInHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
        fontFamily: 'Roboto',
        color: '#fff',
        fontSize: 17,
      }}
    >
      WalkIn
    </Text>),
  subTitle: (
    <Text
      style={{
        fontFamily: 'Roboto',
        color: '#fff',
        fontSize: 10,
      }}
    >
      { `${props.walkInState.estimatedWaitTime}m Est. Wait` }
    </Text>
  ),
});

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});
export default connect(mapStateToProps)(WalkInHeader);
