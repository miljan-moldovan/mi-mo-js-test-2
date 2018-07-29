import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class BlockTimesReasonInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labelText: 'labelText' in this.props ? this.props.labelText : 'BlockTimesReason',
      selectedBlockTimesReason: 'selectedBlockTimesReason' in this.props ? this.props.selectedBlockTimesReason : null,
    };
  }

    handleBlockTimesReasonSelection = (blockTimesReason) => {
      
      this.setState({ selectedBlockTimesReason: blockTimesReason });
      this.props.onChange(blockTimesReason);
    }

    handlePress = () => {
      if (this.props.onPress) { this.props.onPress(); }
      
      this.props.navigate('BlockTimesReasons', {
        selectedBlockTimesReason: this.state.selectedBlockTimesReason,
        actionType: 'update',
        dismissOnSelect: true,
        onChangeBlockTimesReason: blockTimesReason => this.handleBlockTimesReasonSelection(blockTimesReason),
      });
    }

    render() {
      let placeholder = 'placeholder' in this.props ? this.props.placeholder : 'Select BlockTimesReason';
      if (this.props.noPlaceholder) {
        placeholder = null;
      }

      const value = this.state.selectedBlockTimesReason !== null && 'name' in this.state.selectedBlockTimesReason ?
        `${this.state.selectedBlockTimesReason.name}` : null;


      return (
        <SalonTouchableOpacity
          style={[styles.inputRow, { justifyContent: 'center' }, this.props.rootStyle]}
          onPress={this.handlePress}
        >
          {!this.props.noLabel && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{this.state.labelText}</Text>
          )}
          <View style={[
            { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
            this.props.contentStyle,
          ]}
          >
            {value !== null && (
              <View style={{ flexDirection: 'row' }}>
                <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
              </View>
            )}
            {value === null && placeholder !== null && (
              <Text numberOfLines={1} style={[styles.labelText, this.props.placeholderStyle]}>{placeholder}</Text>
            )}
          </View>
          <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
        </SalonTouchableOpacity>
      );
    }
}
