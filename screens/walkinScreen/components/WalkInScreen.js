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
  InputLabel,
  InputButton,
  InputGroup,
  InputDivider,
  SectionTitle
} from '../../../components/formHelpers';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

class WalkInScreen extends Component {
componentWillMount() {

}
  render() {
    return (
      <View style={styles.container}>
        <SectionTitle value="CLIENT" />
        <InputGroup>
          <InputLabel label="Email" value="a@a.com" />
        </InputGroup>
      </View>
    );
  }
}

export default WalkInScreen;
