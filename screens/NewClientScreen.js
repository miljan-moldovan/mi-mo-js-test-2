import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Picker from 'react-native-picker';

import SalonMaterialTextInput from '../components/SalonMaterialTextInput';

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
  },
  firstNameInput: {
    flex: 3,
  },
  middleInput: {
    flex: 1,
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

  showSexPicker =() => {
    Picker.init({
      pickerData: sexes,
      selectedValue: [this.state.sex],
      pickerTitleText: 'Select sex',
      pickerFontSize: 18,
      pickerToolBarFontSize: 18,
      onPickerConfirm: (pickedValue) => {
        this.setState({ sex: pickedValue });
      },
    });
    Picker.show();
  }

  showBirthMontPicker =() => {
    Picker.init({
      pickerData: monthes,
      selectedValue: [this.state.birthMonth],
      pickerFontSize: 18,
      pickerToolBarFontSize: 18,
      onPickerConfirm: (pickedValue) => {
        this.setState({ birthMonth: pickedValue });
      },
    });
    Picker.show();
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
          <TouchableOpacity onPress={this.showSexPicker} style={{flex:1}}>
            <Text>{this.state.sex}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow} >
          <TouchableOpacity onPress={this.showBirthMontPicker} style={{flex:1}}>
            <Text>{this.state.birthMonth}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow} />
        <View style={styles.inputRow} />
        <View style={styles.inputRow} />
        <View style={styles.inputRow} />
        <View style={styles.titleRow} />
        <View style={styles.inputRow} />
      </View>
    );
  }
}

export default newClientScreen;
