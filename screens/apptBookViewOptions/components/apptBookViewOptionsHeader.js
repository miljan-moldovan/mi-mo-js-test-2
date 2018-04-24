import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';


const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  headerContainer: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#115ECD',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  topSearchBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  filterBarContainer: {
    backgroundColor: '#115ECD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
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
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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


export default class ApptBookViewOptionsHeader extends React.Component {
  render() {
    return (<View style={styles.header}>

      <SalonTouchableOpacity
        style={styles.leftButton}
        onPress={() => { this.props.rootProps.navigation.state.params.handleGoBack(); }}
      >
        <View style={styles.leftButtonContainer}>
          <Text style={styles.leftButtonText}>
            Cancel
          </Text>
        </View>
      </SalonTouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>View Options</Text>
      </View>
      <SalonTouchableOpacity
        style={styles.rightButton}
        onPress={() => { this.props.rootProps.navigation.state.params.handlePress(); }}
      >
        <View style={styles.rightButtonContainer}>
          <Text style={styles.rightButtonText}>
            Done
          </Text>
        </View>
      </SalonTouchableOpacity>
            </View>);
  }
}
