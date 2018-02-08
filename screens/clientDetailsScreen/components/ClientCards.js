import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D5',
    flexDirection: 'column',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    borderBottomColor: '#D3D3D5',
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#1D1D26',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    maxHeight: 80,
  },
  primary: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#2C2C33',
  },
  creditNumber: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#2C2C33',
    marginRight: 10,
  },
  leftContainer: {
    flex: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1 / 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemSeparator: {
    backgroundColor: '#D3D3D5',
    opacity: 1,
    height: 1,
  },
  cardLogo: {
    marginLeft: 5,
    height: 30,
    width: 60,
    marginRight: 20,
  },
});

export default class ClientCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CARDS</Text>
        </View>
        <View style={styles.cardsContainer}>

          <View style={styles.leftContainer}>
            <View style={styles.containerLine}>
              <Image style={styles.cardLogo} source={require('../../../assets/images/icons8-visa-96.png')} />
              <Text style={styles.creditNumber}>****</Text>
              <Text style={styles.creditNumber}>345</Text>
            </View>
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.containerLine}>
              <Text style={styles.primary}>PRIMARY</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.containerLine}>
              <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
            </View>
          </View>
        </View>

        <View style={styles.itemSeparator} />


        <View style={styles.cardsContainer}>

          <View style={styles.leftContainer}>
            <View style={styles.containerLine}>
              <Image style={styles.cardLogo} source={require('../../../assets/images/icons8-american-express-96.png')} />
              <Text style={styles.creditNumber}>****</Text>
              <Text style={styles.creditNumber}>112</Text>
            </View>
          </View>
          <View style={styles.middleContainer}>
            <View style={styles.containerLine}>
              <Text style={styles.primary} />
            </View>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.containerLine}>
              <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
            </View>
          </View>
        </View>

        <View style={styles.itemSeparator} />

      </View>
    );
  }
}
