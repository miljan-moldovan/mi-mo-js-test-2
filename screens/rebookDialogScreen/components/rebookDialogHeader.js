import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';


const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  header: {
    backgroundColor: '#115ECD',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 20,
    paddingBottom: 8,
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    paddingTop: 15,
    paddingRight: 7,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
    paddingRight: 5,
    paddingBottom: 3,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    // marginLeft: 6,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    //  marginRight: 10,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});


export default class AppointmentNoteHeader extends React.Component {
  render() {
    return (<View style={styles.header}>

      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => { this.props.rootProps.navigation.state.params.handleGoBack(); }}
      >
        <View style={styles.leftButtonContainer}>
          <Text style={styles.leftButtonText}>
            Cancel
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Rebook</Text>
        <Text style={styles.subTitleText}>{this.props.rootProps.navigation.state.params.appointment.client.fullName}</Text>
      </View>
      <TouchableOpacity
        style={styles.rightButton}
        onPress={() => { this.props.rootProps.navigation.state.params.handlePress(); }}
      >
        <View style={styles.rightButtonContainer}>
          <Text style={styles.rightButtonText}>
            Done
          </Text>
        </View>
      </TouchableOpacity>
            </View>);
  }
}
