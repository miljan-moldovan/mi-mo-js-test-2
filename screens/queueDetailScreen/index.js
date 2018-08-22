// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import HeaderRight from '../../components/HeaderRight';
import * as actions from '../../actions/queue.js';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

class QueueDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { name, lastName } = navigation.state.params.item.client;
    return {
      headerTitle: `${name} ${lastName}`,
      headerTintColor: 'white',
      headerBackTitleStyle: styles.headerButton,
      headerRight:
  <HeaderRight
    button={(
      <Text style={styles.headerButton}>Save</Text>
      )}
    handlePress={navigation.state.params.save}
  />,
    };
  };

  state = {
    refreshing: false,
    item: {},
  }
  componentWillMount() {
    this.setState({
      item: this.props.navigation.state.params.item,
    });
  }
  componentDidMount() {
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      save: () => {
        this.props.saveQueueItem(this.state.item);
        navigation.goBack();
      },
    });
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }
  _handleDeletePress = () => {
    this.props.deleteQueueItem(this.state.item.queueId);
    this.props.navigation.goBack();
  }
  _handleServicePress = () => {
    this.props.navigation.navigate('Services', {
      dismissOnSelect: true,
      onChangeService: this._handleServiceChange,
    });
  }
  _handleServiceChange = (service) => {
    this.setState({
      item: {
        ...this.state.item,
        services: [{ id: service.id, description: service.name }],
      },
    });
  }
  _handleProviderPress = () => {
    this.props.navigation.navigate('Providers', {
      dismissOnSelect: true,
      onChangeProvider: this._handleProviderChange,
    });
  }
  _handleProviderChange = (provider) => {
    this.setState({
      item: {
        ...this.state.item,
        employees: [provider],
      },
    });
  }
  _handlePromoPress = () => {
    this.props.navigation.navigate('Promotions', {
      dismissOnSelect: true,
      onChangePromotion: this._handlePromoChange,
    });
  }
  _handlePromoChange = (promotion) => {
    this.setState({
      item: {
        ...this.state.item,
        promotion,
      },
    });
  }
  render() {
    const { item } = this.state;
    const employee = `${item.employees[0].name} ${item.employees[0].lastName}`;
    const promotion = item.promotion;
    return (
      <View style={styles.container}>
        <SalonTouchableOpacity style={styles.itemContainer} onPress={this._handleServicePress}>
          <View>
            <Text style={styles.serviceTitle}>{item.services[0].description}</Text>
            <Text style={styles.serviceTime}>{item.estimatedTime}min</Text>
          </View>
          <Text style={styles.servicePrice}>$??.??</Text>
        </SalonTouchableOpacity>

        <SalonTouchableOpacity style={styles.itemContainer} onPress={this._handleProviderPress}>
          <View>
            <Text style={styles.providerLabel}>PROVIDER</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <View style={styles.providerPicture} />
              <Text style={styles.providerName}>{employee}</Text>
            </View>
          </View>
        </SalonTouchableOpacity>

        <SalonTouchableOpacity style={styles.itemContainer} onPress={this._handlePromoPress}>
          <View>
            <Text style={styles.providerLabel}>PROMO CODE</Text>
            <Text style={styles.promoCode}>{ promotion ? promotion.name.substring(0, 30) : 'None'}</Text>
          </View>
          <Text style={styles.promoDiscount}>{ promotion ? (`-$${promotion.discount}`) : '' }</Text>
        </SalonTouchableOpacity>

        <Button rounded bordered style={styles.deleteButton} onPress={this._handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete Service</Text>
        </Button>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  serviceQueue: state.queue.serviceQueue,
});
export default connect(mapStateToProps, actions)(QueueDetailScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  providerPicture: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderColor: '#67A3C7',
    borderWidth: 2,
    marginRight: 5,
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
    marginLeft: 'auto',
  },
  deleteButton: {
    width: 250,
    height: 50,
    marginTop: 62,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'transparent',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DE406A',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
  },
  headerButton: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
  },
});
