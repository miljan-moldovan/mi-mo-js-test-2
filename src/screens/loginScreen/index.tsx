import * as React from 'react';
import { Icons } from 'react-native-fontawesome';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/login';
import LoginScreen from './LoginScreen';


const mapStateToProps = state => ({
  auth: state.auth,
});

// Todo need correct add types for connect
// @ts-ignore
export default connect(mapStateToProps, actions)(LoginScreen);
