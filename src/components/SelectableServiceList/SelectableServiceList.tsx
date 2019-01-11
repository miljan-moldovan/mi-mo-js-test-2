import * as React from 'react';
import { Text, View, FlatList } from 'react-native';
import { get, includes, remove, isNumber } from 'lodash';

import LoadingOverlay from '../LoadingOverlay';
import SalonFlatList from '../common/SalonFlatList';
import SalonListItem from '../common/SalonListItem';
import Colors from '@/constants/Colors';
import { Service } from '@/models';
import { ServicesReducer } from '@/redux/reducers/service';
import styles from './styles';

export interface SelectableServiceListProps {
  onChangeSelected: (obj: Service | number[]) => void;
  returnFullObject?: boolean;
  selected: number[];
  services: number[];
  allServices: Service[];
  servicesState: ServicesReducer;
  noneButton?: {
    name: string;
    onPress: () => void;
  };
  hidePrice?: boolean;
}

export interface SelectableServiceListState {

}

class SelectableServiceList extends React.Component<SelectableServiceListProps, SelectableServiceListState> {
  onPressItem = item => {
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
  };

  get services() {
    const { services = false, allServices = [], noneButton = false } = this.props;
    if (!services) {
      return allServices;
    }
    const ids = services.map(srv => (isNumber(srv) ? srv : get(srv, 'id', null)));
    const list: any[] = allServices.filter(srv => includes(ids, srv.id));
    if (noneButton) {
      list.unshift({ ...noneButton, isNone: true });
    }
    return list;
  }

  selectedServices = () => this.props.allServices.filter(srv => this.isSelected(srv.id));

  isSelected = (id: number) => includes(this.props.selected, id);

  renderItem = ({ item }) => {
    const price = item.price || 0;
    const onPress = () => this.onPressItem(item);
    const icons = this.isSelected(item.id)
      ? [{
        name: 'checkCircle',
        color: Colors.selectedGreen,
        size: 14,
        type: 'solid',
      }] : [];
    return (
      <SalonListItem onPress={onPress} icons={icons}>
        <Text
          style={styles.listItemText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name.slice(0, 30)}{item.name.length > 30 ? '...' : ''}
        </Text>
        {
          !item.isNone && !this.props.hidePrice &&
          <Text style={styles.priceText}>{`$${price.toFixed(2)}`}</Text>
        }
      </SalonListItem>
    );
  };

  renderSeparator = () => <View style={styles.listItemSeparator} />;

  render() {
    const { isLoading } = this.props.servicesState;

    return (
      <View style={styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <SalonFlatList
          data={this.services}
          style={styles.marginTop}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
export default SelectableServiceList;
