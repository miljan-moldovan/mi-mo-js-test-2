import * as React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import HeaderMiddle from '../../../components/HeaderMiddle';
import WalkInSteps from '../../../constants/WalkInSteps';
import walkInActions from '../../../redux/actions/walkIn';

const WalkInStepHeader = props =>
  HeaderMiddle ({
    title: (
      <Text
        style={{
          fontFamily: 'OpenSans-Regular',
          color: '#fff',
          fontSize: 20,
        }}
      >
        {props.rootProps.navigation.state.params !== undefined &&
          props.rootProps.navigation.state.params.actionType === 'update'
          ? `${WalkInSteps.update[props.walkInState.currentStep]}`
          : `${WalkInSteps.new[props.walkInState.currentStep]}`}
      </Text>
    ),
    // subTitle: (
    //   <Text
    //     style={{
    //         fontFamily: 'OpenSans-Regular',
    //         color: '#fff',
    //         fontSize: 12,
    //       }}
    //   >{props.rootProps.navigation.state.params !== undefined &&
    //     props.rootProps.navigation.state.params.actionType === 'update'
    //        ? 'WalkIn Service'
    //        : `Walkin Service - ${props.walkInState.currentStep} of 4`}
    //   </Text>
    // ),
  });

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});
const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators ({...walkInActions}, dispatch),
});
export default connect (mapStateToProps, mapActionsToProps) (WalkInStepHeader);
