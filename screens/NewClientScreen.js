import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import SalonPicker from '../components/SalonPicker';
import SalonMaterialTextInput from '../components/SalonMaterialTextInput';
import SalonBtnSelect from '../components/SalonBtnSelect';

const monthes = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octobre', 'November', 'December'];

const sexes = ['Sex', 'Male', 'Female'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputRow: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleRow: {
    flex: 0.7,
    backgroundColor: '#f3f3f4',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-end',
  },
  firstNameInput: {
    flex: 3,
  },
  middleInput: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: '#1D1D26',
    marginBottom: 8,
  },
});

class newClientScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sex: 'Male',
      birthMonth: 'January',
    };
  }

  handleSexChange = (sex) => {
    this.setState({ sex: sex[0] });
  }

  handleMonthChange = (birthMonth) => {
    this.setState({ birthMonth: birthMonth[0] });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputRow} >
          <SalonMaterialTextInput title="First Name" rootStyle={styles.firstNameInput} />
          <SalonMaterialTextInput title="Middle" rootStyle={styles.middleInput} />
        </View>
        <View style={styles.inputRow} >
          <SalonMaterialTextInput title="Last Name" />
        </View>
        <View style={styles.inputRow} >
          <SalonPicker
            dataSource={sexes}
            selectedValue={this.state.sex}
            title="Sex"
            onPickerConfirm={this.handleSexChange}
          />
        </View>
        <View style={styles.inputRow} >
          <SalonPicker
            dataSource={monthes}
            selectedValue={this.state.birthMonth}
            title="Birth Month"
            onPickerConfirm={this.handleMonthChange}
          />
        </View>
        <View style={styles.inputRow} >
          <SalonMaterialTextInput title="Email" />
        </View>
        <View style={styles.inputRow} >
          <SalonMaterialTextInput title="Cell-phone" />
        </View>
        <View style={styles.inputRow} >
          <SalonMaterialTextInput title="Zip Code" />
        </View>
        <View style={styles.titleRow} >
          <Text style={styles.titleText}>REFERRED BY:</Text>
        </View>
        <View style={styles.inputRow} >
          <SalonBtnSelect selectedValue="Paul Simon" onPress={() => {}} title="Customer" />
        </View>
      </View>
    );
  }
}

export default newClientScreen;
