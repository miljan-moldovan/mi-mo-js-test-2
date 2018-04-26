import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, Switch } from 'react-native';

import SalonMaterialTextInput from '../../../components/SalonMaterialTextInput';
import SalonPicker from '../../../components/SalonPicker';
import SalonBtnSelect from '../../../components/SalonBtnSelect';
import SalonFlatPicker from '../../../components/SalonFlatPicker';
import FloatingButton from '../../../components/FloatingButton';
import plusIcon from '../../../assets/images/clientDetails/icon_plus_small.png';
import removeIcon from '../../../assets/images/clientDetails/icon_close_w.png';
import sendIcon from '../../../assets/images/clientDetails/send_sms.png';
import callIcon from '../../../assets/images/clientDetails/call.png';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

const confirmations = ['Email', 'SMS'];

const monthes = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octobre', 'November', 'December'];

const genderes = ['Male', 'Female', 'Unspecified'];

const referredType = ['Customer', 'Other'];

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#fff',
  },
  titleRow: {
    height: 50,
    backgroundColor: '#f3f3f4',
    justifyContent: 'flex-end',
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    height: 73,
    borderBottomWidth: 1,
    borderColor: '#1D1D2626',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnRow: {
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: '#1D1D26',
    marginBottom: 8,
  },
  rowText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#1D1D26',
  },
  firstNameInput: {
    flex: 3,
  },
  middleInput: {
    flex: 1,
  },
  blueText: {
    color: '#3078A4',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  btn: {
    height: 73,
  },
  imageAdd: {
    marginRight: 8,
  },
  imageRemove: {
    tintColor: '#80BBDF',
    width: 15,
    height: 15,
    marginTop: 20,
  },
  addressInput: {
    flex: 1,
  },
  referredRow: {
    height: 146,
    flexDirection: 'column',
  },
  referredInnerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#1D1D2626',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  deleteText: {
    color: '#DE406A',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  btnDelete: {
    borderRadius: 25,
    backgroundColor: '#fff',
    height: 50,
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 146,
  },
  btnStyle: {
    position: 'relative',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  btnText: {
    fontSize: 11,
    color: '#7A7681',
    fontFamily: 'OpenSans-Regular',
    paddingTop: 5,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class ClientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  handleGenderChange=(ev, selectedIndex) => {
    this.setState({ selectedIndex });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>Name</Text>
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput value="Juan" editable={false} title="First Name" rootStyle={styles.firstNameInput} />
          <SalonMaterialTextInput title="Middle" editable={false} rootStyle={styles.middleInput} value="Diego" />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput value="Mendez" editable={false} title="Last Name" />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>MAIN INFO</Text>
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Email" editable={false} rootStyle={styles.middleInput} value="juan.mendez@salonultimate.com" />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Home" editable={false} rootStyle={styles.middleInput} value="111-555-2255" />
          <SalonTouchableOpacity>
            <Image style={styles.imageRemove} source={removeIcon} />
          </SalonTouchableOpacity>
        </View>
        <SalonTouchableOpacity>
          <View style={styles.row}>
            <Image style={styles.imageAdd} source={plusIcon} />
            <Text style={styles.blueText}>Add Contact</Text>
          </View>
        </SalonTouchableOpacity>
        <View style={styles.row}>
          <SalonPicker title="Confirmation" dataSource={confirmations} selectedValue="Email" onPickerConfirm={() => {}} disabled />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Loyalty" editable={false} value="1234356789" />
        </View>
        <View style={styles.row}>
          <SalonPicker title="Birth Month" dataSource={monthes} selectedValue="August" onPickerConfirm={() => {}} disabled />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Client ID" editable={false} value="11111" />
        </View>
        <View style={styles.row}>
          <SalonFlatPicker dataSource={genderes} onItemPress={this.handleGenderChange} selectedIndex={this.state.selectedIndex} title="Gender" disabled />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Occupation" editable={false} value="Consultant" />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>ADDRESS</Text>
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Street" editable={false} value="124 Elm Street" />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="State" editable={false} value="MA" rootStyle={styles.addressInput} />
          <SalonMaterialTextInput title="Zip" editable={false} value="11020" rootStyle={styles.addressInput} />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>REFERRED BY</Text>
        </View>
        <View style={[styles.row, styles.referredRow]}>
          <View style={[styles.referredInnerRow, styles.borderBottom]}>
            <SalonFlatPicker
              dataSource={referredType}
              onItemPress={this.handleGenderChange}
              selectedIndex={this.state.selectedIndex}
              disabled
            />
          </View>
          <View style={styles.referredInnerRow}>
            <SalonBtnSelect selectedValue="Paul Simon" onPress={() => {}} title="Customer" />
          </View>
        </View>
        <View style={styles.titleRow} />
        <View style={[styles.row, styles.spaceBetween]}>
          <Text style={styles.rowText}>Req. Card on file to book</Text>
          <Switch disabled />
        </View>
        <View style={styles.row}>
          <SalonMaterialTextInput title="Note" editable={false} value="You probably have not heard of them" rootStyle={styles.addressInput} />
        </View>
        <View style={[styles.titleRow, styles.deleteContainer]}>
          <SalonTouchableOpacity style={styles.btnDelete}>
            <Text style={styles.deleteText}>Delete Client</Text>
          </SalonTouchableOpacity>
        </View>
        <View style={styles.btnRow}>
          <View style={styles.btnContainer}>
            <FloatingButton handlePress={() => {}} rootStyle={styles.btnStyle}>
              <Image source={callIcon} />
            </FloatingButton>
            <Text style={styles.btnText}>CALL</Text>
          </View>
          <View style={styles.btnContainer}>
            <FloatingButton handlePress={() => {}} rootStyle={styles.btnStyle}>
              <Image source={sendIcon} />
            </FloatingButton>
            <Text style={styles.btnText}>SEND SMS</Text>
          </View>
          <View style={styles.btnContainer}>
            <FloatingButton handlePress={() => {}} rootStyle={styles.btnStyle}>
              <Image source={callIcon} />
            </FloatingButton>
            <Text style={styles.btnText}>EMAIL</Text>
          </View>
          <View style={styles.btnContainer}>
            <FloatingButton handlePress={() => {}} rootStyle={styles.btnStyle}>
              <Image source={sendIcon} />
            </FloatingButton>
            <Text style={styles.btnText}>NEW APPT.</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ClientDetails;
