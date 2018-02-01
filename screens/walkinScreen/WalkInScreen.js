import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import rightArrow from '../../assets/images/walkinScreen/icon_arrow_right_xs.png';
import serchImage from '../../assets/images/walkinScreen/icon_search_w.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f4',
  },
  titleContainer: {
    backgroundColor: '#f3f3f4',
    flex: 7,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  inputContainer: {
    flex: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
  },
  listItemContainer: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  btnContainer: {
    flex: 10,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: '#000',
    letterSpacing: 1,
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#000',
  },
  textBtn: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
  },
  searchImage: {
    tintColor: '#231F20',
  },
});

class WalkInScreen extends Component {
  componentWillMount() {
    console.log('test');
  }

  renderTitle = title => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        {this.renderTitle('CLIENT INFO')}
        <View style={styles.listItemContainer}>
          <Text style={styles.textInput}>Client</Text>
          <Image style={styles.searchImage} source={serchImage} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInput}>Email</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInput}>Phone</Text>
        </View>
        {this.renderTitle('SERVICE')}
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            const { navigate } = this.props.navigation;

            navigate('Services', { currentStep: 1 });
          }}
        >
          <Text style={styles.textInput}>Service</Text>
          <Image source={rightArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            const { navigate } = this.props.navigation;

            navigate('Providers');
          }}
        >
          <Text style={styles.textInput}>Provider</Text>
          <Image source={rightArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() => {
            const { navigate } = this.props.navigation;

            navigate('Promotions');
          }}
        >
          <Text style={styles.textInput}>Promo</Text>
          <Image source={rightArrow} />
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          <Text style={styles.textBtn}>ADD TO QUEUE</Text>
        </View>
      </View>
    );
  }
}

export default WalkInScreen;
