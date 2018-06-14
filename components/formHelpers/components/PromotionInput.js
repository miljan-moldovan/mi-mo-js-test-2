import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class PromotionInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPromotion: null,
    };
  }

    handlePromoSelection = (promotion) => {
      this.setState({ selectedPromotion: promotion });
      this.props.onChange(promotion);
    }

    handlePress = () => {
      this.props.navigate('Promotions', {
        actionType: 'update',
        dismissOnSelect: true,
        onChangePromotion: promotion => this.handlePromoSelection(promotion),
      });
    }

    render() {
      const value = this.state.selectedPromotion ? this.state.selectedPromotion.name : null;
      return (
        <SalonTouchableOpacity
          style={[styles.inputRow, { justifyContent: 'center' }]}
          onPress={this.handlePress}
        >
          <Text style={[styles.labelText]}>Promotion</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text numberOfLines={1} style={[styles.inputText]}>{value}</Text>
          </View>
          <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
        </SalonTouchableOpacity>
      );
    }
}
