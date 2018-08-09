import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import { getApiInstance } from '../../utilities/apiWrapper/api';
import LoadingOverlay from '../../components/LoadingOverlay';
import styles from './styles';

export default class AddonServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const showCancelButton = params.showCancelButton || false;
    const handleSave = params.handleSave || (() => null);
    const serviceTitle = params.serviceTitle || '';
    const onNavigateBack = params.onNavigateBack || (() => null);
    const handleGoBack = () => {
      onNavigateBack();
      navigation.goBack();
    };
    return ({
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>
            Add-on Services
          </Text>
          <Text style={styles.headerSubtitleText}>
            {serviceTitle}
          </Text>
        </View>
      ),
      headerLeft: showCancelButton ? (
        <SalonTouchableOpacity onPress={() => handleGoBack()}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ) : null,
      headerRight: (
        <SalonTouchableOpacity onPress={() => handleSave()}>
          <Text style={[styles.headerButtonText, styles.robotoMedium]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleSave: this.handleSave });
    const params = this.props.navigation.state.params || {};
    const serviceIds = params.services || [];

    this.state = {
      isLoading: false,
      selected: [],
      services: this.getServices(serviceIds),
    };
  }

  getServices = (ids) => {
    const { services } = this.props;
    const results = [];
    const check = (service, index) => service.id === ids[index].id;
    for (let i = 0; i < ids.length; i += 1) {
      const service = services.find(ser => check(ser, i));
      if (service) { results.push(service); }
    }
    return [{ id: 'none', name: 'No Add-on' }, ...results];
  }

  handlePressRow = (index) => {
    const { services } = this.state;
    const newServices = services.slice();
    if (newServices[index].id === 'none') {
      return this.handleSave(true);
    }
    newServices[index].selected = !newServices[index].selected;
    return this.setState({ services: newServices });
  }

  handleSave = (empty = false) => {
    const { services } = this.state;
    const params = this.props.navigation.state.params || {};
    const onSave = params.onSave || false;
    if (onSave) {
      const selectedServices = services.filter(item => item.selected);
      onSave( empty ? [] : selectedServices);
      this.props.navigation.goBack();
    }
  }

  selectEmpty = () => {
    this.setState(({ services }) => ({
      services: services.map(srv => ({ selected: false, ...srv })),
    }), this.handleSave);
  }

  renderItem = ({ item, index }) => (
    <SalonTouchableOpacity
      style={styles.listItem}
      onPress={() => this.handlePressRow(index)}
    >
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemText}>{item.name}</Text>
        {!!item.price && (
          <Text style={styles.priceText}>{`$${item.price.toFixed(2)}`}</Text>
        )}
      </View>
      <View style={styles.iconContainer}>
        {item.selected && (
          <Icon
            name="checkCircle"
            color="#1DBF12"
            size={14}
            type="solid"
          />
        )}
      </View>
    </SalonTouchableOpacity>
  )

  renderSeparator = () => (
    <View style={styles.listItemSeparator} />
  )

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.isLoading ?
            (
              <LoadingOverlay />
            ) : (
              <FlatList
                style={styles.marginTop}
                data={this.state.services}
                renderItem={this.renderItem}
                ItemSeparatorComponent={this.renderSeparator}
              />
            )
        }
      </View>
    );
  }
}
