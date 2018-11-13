import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, includes, remove, isNumber } from 'lodash';

import LoadingOverlay from '../../components/LoadingOverlay';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import Icon from '../UI/Icon';
import styles from './styles';

class SelectableServiceList extends React.Component {
  onPressItem = (item) => {
    if (item.isNone) {
      return item.onPress();
    }
    const { onChangeSelected, selected, returnFullObject } = this.props;
    if (this.isSelected(item.id)) {
      remove(selected, id => id === item.id);
    } else {
      selected.push(item.id);
    }

    const obj = returnFullObject ? item : selected;
    return onChangeSelected(obj);
  }

  get services() {
    const { services = false, allServices = [], noneButton = false } = this.props;
    if (!services) {
      return allServices;
    }
    const ids = services.map(srv => (isNumber(srv) ? srv : get(srv, 'id', null)));
    const list = allServices.filter(srv => includes(ids, srv.id));
    if (noneButton) {
      list.unshift({ ...noneButton, isNone: true });
    }
    return list;
  }

  selectedServices = () => this.props.allServices.filter(srv => this.isSelected(srv.id))

  isSelected = id => includes(this.props.selected, id)

  renderItem = ({ item }) => {
    const price = item.price || 0;
    return (
      <SalonTouchableOpacity
        style={styles.listItem}
        onPress={() => this.onPressItem(item)}
      >
        <View style={styles.listItemContainer}>
          <Text style={styles.listItemText} numberOfLines={1} ellipsizeMode="tail">{item.name.slice(0,30)}{item.name.length > 30 ? '...' : ''}</Text>
          {
            !item.isNone && !this.props.hidePrice && (
              <Text style={styles.priceText}>{`$${price.toFixed(2)}`}</Text>
            )
          }
        </View>
        <View style={styles.iconContainer}>
          {this.isSelected(item.id) && (
            <Icon
              name="checkCircle"
              color="#1DBF12"
              size={14}
              type="solid"
            />
          )}
        </View>
      </SalonTouchableOpacity>
    );
  }

  renderSeparator = () => (
    <View style={styles.listItemSeparator} />
  )

  render() {
    const { isLoading } = this.props.servicesState;

    return isLoading ? (
      <LoadingOverlay />
    ) : (
      <View style={styles.container}>
        <FlatList
          style={styles.marginTop}
          data={this.services}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
export default SelectableServiceList;
