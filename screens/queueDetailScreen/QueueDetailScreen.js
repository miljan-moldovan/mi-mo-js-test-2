import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { get } from 'lodash';
import { Button } from 'native-base';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

import styles from './style';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';
import Colors from '../../constants/Colors';

class QueueDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { name, lastName } = params.item.client;
    const canSave = get(params, 'canSave', true);
    const handleDone = get(params, 'save', (() => null));
    return {
      header: (
        <SalonHeader
          title={`${name} ${lastName}`}
          headerLeft={
            <SalonTouchableOpacity style={{ paddingLeft: 10 }} onPress={navigation.goBack}>
              <Text style={{ fontSize: 14, color: Colors.white }}>Back</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity onPress={handleDone} disabled={!canSave}>
              <Text style={styles.headerButton}>Done</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
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
            <Text style={styles.promoCode}>{promotion ? promotion.name.substring(0, 30) : 'None'}</Text>
          </View>
          <Text style={styles.promoDiscount}>{promotion ? (`-$${promotion.discount}`) : ''}</Text>
        </SalonTouchableOpacity>

        <Button rounded bordered style={styles.deleteButton} onPress={this._handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete Service</Text>
        </Button>
      </View>
    );
  }
}
export default QueueDetailScreen;
