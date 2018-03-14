import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  headerContainer: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#115ECD',
    height: 64,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
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
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backIcon: {
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});


export default class ProductsHeader extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);
  }

  render() {
    return (<View style={styles.header}>

      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => { this.props.goBack(); }}
      >
        <View style={styles.leftButtonContainer}>

          { this.props.showCancel &&
            <Text style={styles.leftButtonText}>
              Cancel
            </Text>
          }

          { this.props.showArrow &&
            <FontAwesome style={styles.backIcon}>
              {Icons.angleLeft}
            </FontAwesome>
          }

        </View>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>

      <View style={styles.rightButton} />
            </View>);
  }
}
