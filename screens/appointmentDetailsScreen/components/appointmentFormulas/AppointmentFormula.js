import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonDatePicker from '../../../../components/modals/SalonDatePicker';
import SalonHeader from '../../../../components/SalonHeader';
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
    backgroundColor: '#F1F1F1',
  },
  navButton: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
});

const NavButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <FontAwesome style={styles.navButton}>{icon}</FontAwesome>
  </TouchableOpacity>
);

export default class AppointmentFormula extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'white' }}>New Formula</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Roboto-Regular', color: 'white' }}>Rod Stewart</Text>
      </View>
    ),
    headerLeft: <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'Roboto-Regular' }}>Cancel</Text>,
    headerRight: <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'Roboto-Regular' }}>Save</Text>,
  };

  constructor(props) {
    super(props);

    this.state = {
      formula: {
        date: '',
      },
    };
  }

  handleClientSelection = (client) => {
    console.log('selected this dude', client);
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <InputButton
            onPress={() => {
              this.props.navigation.navigate('Clients', {
                actionType: 'update',
                dismissOnSelect: true,
                onChangeClient: this.handleClientSelection,
              });
            }}
            placeholder="Entered by"
            value="Your Cousin"
          />
          <InputDivider />
          <InputButton
            onPress={() => {}}
            placeholder="Type"
            value="Nail"
          />
          <InputDivider />
          <InputText
            placeholder="Write formula"
          />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <InputButton
            onPress={() => {}}
            placeholder="Associated appt."
          />
          <InputDivider />
          <InputDate
            placeholder="Date"
            onPress={(selectedDate) => {
              const { formula } = this.state;
              formula.date = selectedDate;
              this.setState({ formula });
            }}
            selectedDate={this.state.formula.date ? this.state.formula.date : false}
          />
          <InputDivider />
          <InputButton
            onPress={() => {}}
            placeholder="Provider"
            value="BJ Penn"
          />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <InputButton
            onPress={() => {}}
            placeholder="Copy formula to"
          />
        </InputGroup>
      </View>
    );
  }
}
