import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';
import WalkInSteps from '../../../constants/WalkInSteps';

const WalkInStepHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
          fontFamily: 'OpenSans-Regular',
          color: '#fff',
          fontSize: 20,
        }}
    >
      {`${WalkInSteps[props.walkInState.currentStep]}`}
    </Text>
  ),
  subTitle: (
    <Text
      style={{
          fontFamily: 'OpenSans-Regular',
          color: '#fff',
          fontSize: 12,
        }}
    >{`Walkin Service - ${props.walkInState.currentStep} of 4`}
    </Text>
  ),
});

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});
export default connect(mapStateToProps)(WalkInStepHeader);

