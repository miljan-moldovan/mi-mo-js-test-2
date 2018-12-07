import * as React from 'react';
import {
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonDatePicker from '../../modals/SalonDatePicker';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, InputButton } from '../index';

export default class InputDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    if (this.props.required) {
      this.validate(this.props.selectedDate, true);
    }
  }

  onPressDatePicker = (selectedDate) => {
    this.setState({ showModal: false });

    if (this.props.required) {
      this.validate(selectedDate, false);
    }
    this.props.onPress(selectedDate);
  }

  onPressButton = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  onPressCancel = () => {
    this.onPressDatePicker(null);
  }

  validate = (selectedDate, isFirstValidation = false) => {
    const isValid = moment(selectedDate).isValid();
    this.props.onValidated(isValid, isFirstValidation);
  };

  render() {
    const labelStyle = this.props.required ? (this.props.isValid ? {} : { color: '#D1242A' }) : {};
    const format = this.props.format ? this.props.format : 'YYYY-MM-DD';
    const icon = this.props.icon ? this.props.icon : Icons.timesCircle;
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <SalonDatePicker
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          isVisible={this.state.showModal}
          onPress={this.onPressDatePicker}
          selectedDate={this.props.selectedDate}
        />
        <InputButton
          labelStyle={labelStyle}
          style={{ flex: 1 }}
          valueStyle={this.props.valueStyle}
          onPress={this.onPressButton}
          icon={false}
          label={this.props.placeholder}
          value={moment.isMoment(this.props.selectedDate) ? this.props.selectedDate.format(format) : this.props.selectedDate}
        />
        {!this.props.noIcon && (
          <SalonTouchableOpacity
            onPress={this.onPressCancel}
            style={styles.dateCancelButtonStyle}
          >
            <View style={styles.dateCancelStyle}>
              <FontAwesome style={[styles.iconStyle, { marginLeft: 0 }]}>{icon}</FontAwesome>
            </View>
          </SalonTouchableOpacity>
        )}
      </View>
    );
  }
}
