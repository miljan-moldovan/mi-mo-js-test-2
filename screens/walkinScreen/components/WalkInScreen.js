import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonAvatar from '../../../components/SalonAvatar';
import WalkInStepHeader from './WalkInStepHeader';
import {
  InputDate,
  InputText,
  InputGroup,
  InputButton,
  InputDivider,
  SectionDivider,
} from '../../../../components/formHelpers';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

class WalkInScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

export default WalkInScreen;
