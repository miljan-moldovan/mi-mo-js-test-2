// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';

import * as actions from '../actions/queue.js';

class QueueDetailScreen extends React.Component {
  state = {
    refreshing: false,
  }
  componentWillMount() {
    this.props.receiveQueue();
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(()=>this.setState({refreshing: false}), 1000);
  }
  _handleDeletePress = () => {

  }
  _handleServicePress = () => {
    this.props.navigation.navigate('Service');
  }
  _handleProviderPress = () => {
    this.props.navigation.navigate('ChangeProvider');
  }
  _handlePromoPress = () => {
    this.props.navigation.navigate('Promotions');
  }
  render() {
    const { item } = this.props.navigation.state.params;
    const employee = item.employees[0].name+' '+item.employees[0].lastName;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.itemContainer} onPress={this._handleServicePress}>
          <View>
            <Text style={styles.serviceTitle}>{item.services[0].description}</Text>
            <Text style={styles.serviceTime}>{item.estimatedTime}min</Text>
          </View>
          <Text style={styles.servicePrice}>$??.??</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={this._handleProviderPress}>
          <View>
            <Text style={styles.providerLabel}>PROVIDER</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
              <View style={styles.providerPicture} />
              <Text style={styles.providerName}>{employee}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={this._handlePromoPress}>
          <View>
            <Text style={styles.providerLabel}>PROMO CODE</Text>
            <Text style={styles.promoCode}>FirstCustomer</Text>
          </View>
          <Text style={styles.promoDiscount}>-$5</Text>
        </TouchableOpacity>

        <Button rounded bordered style={styles.deleteButton} onPress={this._handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete Service</Text>
        </Button>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  console.log('QueueDetailScreen-map', state);
  return {
    waitingQueue: state.queue.waitingQueue,
    serviceQueue: state.queue.serviceQueue
  }
}
export default connect(mapStateToProps, actions)(QueueDetailScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  providerPicture: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderColor: '#67A3C7',
    borderWidth: 2,
    marginRight: 5
  },
  itemContainer: {
    // width: '100%',
    height: 79,
    borderBottomWidth: 1,
    borderBottomColor: '#B2AFAA',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    alignItems: 'center',

  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
  },
  serviceTitle: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 18,
  },
  serviceTime: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 12,
  },
  servicePrice: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 16,
    marginLeft: 'auto',
  },
  providerLabel: {
    fontFamily: 'OpenSans-Regular',
    color: '#B2AFAA',
    fontSize: 11,
  },
  providerName: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 16,
  },
  promoCode: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
    fontSize: 18,
  },
  promoDiscount: {
    fontFamily: 'OpenSans-Regular',
    color: '#CE3333',
    fontSize: 16,
    marginLeft: 'auto'
  },
  deleteButton: {
    width: 250,
    height: 50,
    marginTop: 62,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'transparent',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#DE406A',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20
  },
});
