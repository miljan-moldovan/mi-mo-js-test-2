import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';

import SalonTouchableOpacity from '../SalonTouchableOpacity';
import Icon from '../UI/Icon';
import LoadingOverlay from '../LoadingOverlay';
import styles from './styles';

class SelectableServiceList extends React.Component {
  constructor(props) {
    super(props);
    const { services = [] } = props;
    this.state = {
      isLoading: false,
      services: this.getServices(services),
    };
  }

  getServices = (ids) => {
    const { services, noneButton } = this.props;
    const results = [];
    const check = (service, index) => service.id === ids[index].id;
    for (let i = 0; i < ids.length; i += 1) {
      const service = services.find(ser => check(ser, i));
      if (service) { results.push(service); }
    }
    if (noneButton) {
      results.unshift({ id: 'none', name: noneButton });
    }
    return results;
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
      onSave(empty ? [] : selectedServices);
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
        {this.state.isLoading ? (
          <LoadingOverlay />
        ) : (
          <FlatList
            style={styles.marginTop}
            data={this.state.services}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
          />
          )}
      </View>
    );
  }
}
export default SelectableServiceList;
