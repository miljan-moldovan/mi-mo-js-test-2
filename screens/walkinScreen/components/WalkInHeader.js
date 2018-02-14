import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const WalkInHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'OpenSans-Regular',
      color: '#fff',
      fontSize: 20,
    }}
    >
    Walkin
    </Text>),
  subTitle: (
    <Text
      style={{
      fontFamily: 'OpenSans-Regular',
      color: '#fff',
      fontSize: 12,
    }}
    >
    Est wait time
      <Text style={{
      fontFamily: 'OpenSans-Bold',
    }}
      >
        { ` ${props.walkInState.estimatedWaitTime} min` }
      </Text>
    </Text>
  ),
});

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});
export default connect(mapStateToProps)(WalkInHeader);
