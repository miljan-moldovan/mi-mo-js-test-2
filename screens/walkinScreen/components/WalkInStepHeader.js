import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HeaderMiddle from '../../../components/HeaderMiddle';
import WalkInSteps from '../../../constants/WalkInSteps';
import walkInActions from '../../../actions/walkIn';

const WalkInStepHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
          fontFamily: 'OpenSans-Regular',
          color: '#fff',
          fontSize: 20,
        }}
    >
      {props.walkInState[props.dataName]
        ? `${WalkInSteps.update[props.walkInState.currentStep]}`
        : `${WalkInSteps.new[props.walkInState.currentStep]}`}
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
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(WalkInStepHeader);

