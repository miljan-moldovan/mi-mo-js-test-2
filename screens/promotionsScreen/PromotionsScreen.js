import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, isNumber } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import {
  InputButton, InputDivider,
} from '../../components/formHelpers';

import Colors from '../../constants/Colors';
import styles from './styles';

class PromotionsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Promotions',
    headerLeft: (
      <SalonTouchableOpacity onPress={navigation.goBack}>
        <Text style={styles.headerButton}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const { selectedPromotion = null } = props.navigation.state.params || {};
    this.state = {
      selectedPromotion,
    };
  }

  componentDidMount() {
    const {
      promotionsActions: {
        getProductPromos,
        getServicePromos,
      },
    } = this.props;
    switch (this.mode) {
      case 'product':
        return getProductPromos();
      case 'service':
      default:
        return getServicePromos();
    }
  }

  onChangePromotion = (item) => {
    const {
      dismissOnSelect,
      onChangePromotion = (itm => itm),
    } = this.props.navigation.state.params || {};
    onChangePromotion(item);
    if (dismissOnSelect) {
      this.props.navigation.goBack();
    }
  }

  get mode() {
    const { mode = 'service' } = this.props.navigation.state.params || {};
    return mode;
  }

  get currentData() {
    const {
      promotionsState: { servicePromos, productPromos },
    } = this.props;
    switch (this.mode) {
      case 'product':
        return productPromos;
      case 'service':
      default:
        return servicePromos;
    }
  }

  keyExtractor = item => get(item, 'id');

  renderSeparator = () => <View style={styles.itemSeparator} />

  renderItem = ({ item }) => {
    const { selectedPromotion } = this.state;
    const isSelected = (
      isNumber(get(selectedPromotion, 'id', null)) && isNumber(get(item, 'id', null))
      && item.id === selectedPromotion.id
    );
    const name = get(item, 'name', '');
    const selectedStyle = isSelected ? styles.selectedText : {};
    const icon = isSelected ? (
      <Icon
        type="solid"
        name="checkCircle"
        color={Colors.selectedGreen}
        size={14}
      />
    ) : null;
    const onPress = () => this.onChangePromotion(item);
    return (
      <SalonTouchableOpacity
        onPress={onPress}
        style={styles.itemRow}
      >
        <Text style={[styles.itemText, styles.container, selectedStyle]}>{name}</Text>
        {icon}
      </SalonTouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.container, styles.whiteBg]}>
        <FlatList
          data={this.currentData}
          style={styles.container}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
PromotionsScreen.propTypes = {
  promotionsActions: PropTypes.shape({
    getProductPromos: PropTypes.func,
    getServicePromos: PropTypes.func,
  }).isRequired,
  promotionsState: PropTypes.shape({
    isLoading: PropTypes.bool,
    servicePromos: PropTypes.array,
    productPromos: PropTypes.array,
  }).isRequired,
};
export default PromotionsScreen;
