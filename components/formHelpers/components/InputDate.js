import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonDatePicker from '../../../components/modals/SalonDatePicker';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, InputButton } from '../index';

export default class InputDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <SalonDatePicker
          isVisible={this.state.showModal}
          onPress={(selectedDate) => {
              this.setState({ showModal: false });
              this.props.onPress(selectedDate);
            }}
          selectedDate={this.props.selectedDate}
        />
        <InputButton
          style={{ flex: 1 }}
          valueStyle={this.props.valueStyle}
          onPress={() => {
              this.setState({ showModal: !this.state.showModal });
            }}
          noIcon
          label={this.props.placeholder}
          value={moment.isMoment(this.props.selectedDate) ? this.props.selectedDate.format('YYYY-MM-DD') : this.props.selectedDate}
        />
        {!this.props.noIcon && (
        <SalonTouchableOpacity
          onPress={() => {
                this.props.onPress(null);
              }}
          style={styles.dateCancelButtonStyle}
        >
          <View style={styles.dateCancelStyle}>
            <FontAwesome style={[styles.iconStyle, { marginLeft: 0 }]}>{Icons.timesCircle}</FontAwesome>
          </View>
        </SalonTouchableOpacity>
          )}
      </View>
    );
  }
}
