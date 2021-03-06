import * as React from 'react';
import { Text, View, ViewPropTypes, RegisteredStyle, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ClientInput extends React.Component<any, any> {

  static defaultProps = {
    apptBook: false,
    label: 'Client',
    placeholder: false,
    onPress: () => {
    },
    extraComponents: [],
    selectedClient: null,
    headerProps: {},
    push: () => {
    },
  };

  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    selectedClient: PropTypes.any,
    onPress: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    extraComponents: PropTypes.node,
    headerProps: PropTypes.any,
    apptBook: PropTypes.bool,
    contentStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
    // @ts-ignore
    selectedStyle: Text.propTypes.style,
    // @ts-ignore
    placeholderStyle: Text.propTypes.style,
    // @ts-ignore

    labelStyle: Text.propTypes.style,
    // @ts-ignore
    iconStyle: Text.propTypes.style,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedClient: 'selectedClient' in props ? props.selectedClient : null,
    };
  }

  handleClientSelection = client => {
    this.setState({ selectedClient: client });
    this.props.onChange(client);
  };

  handlePress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }

    let clientScreen = this.props.walkin ? 'ModalClients' : 'ChangeClient';
    clientScreen = this.props.clientDetails ? 'ReferredClients' : 'ChangeClient';
    const nav = this.props.walkin ? this.props.push : this.props.navigate;
    nav(this.props.apptBook ? 'ApptBookClient' : clientScreen, {
      selectedClient: this.state.selectedClient,
      actionType: 'update',
      dismissOnSelect: true,
      isWalkin: this.props.walkin,
      headerProps: this.props.headerProps,
      onChangeWithNavigation: this.props.onChangeWithNavigation || null,
      onChangeClient: client => this.handleClientSelection(client),
      hideAddButton: this.props.hideAddButton,
    });
  };

  render() {
    const { placeholder, label, selectedClient } = this.props;
    const value = selectedClient
      ? `${selectedClient.name} ${selectedClient.lastName}`
      : null;
    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.style]}
        onPress={this.handlePress}
      >
        {label &&
        <Text
          numberOfLines={1}
          style={[styles.labelText, this.props.labelStyle]}
        >
          {label}
        </Text>}
        <View
          style={[
            {
              flex: 1,
              alignItems: !label ? 'flex-start' : 'flex-end',
              justifyContent: 'center',
            },
            this.props.contentStyle,
          ]}
        >
          {value !== null &&
          <Text
            numberOfLines={1}
            style={[styles.inputText, this.props.selectedStyle]}
          >
            {value}
          </Text>}
          {value === null &&
          placeholder &&
          <Text
            numberOfLines={1}
            style={[styles.labelText, this.props.placeholderStyle]}
          >
            {placeholder}
          </Text>}
        </View>
        {'extraComponents' in this.props &&
        <View style={{ marginHorizontal: 5, flexDirection: 'row' }}>
          {this.props.extraComponents}
        </View>}
        <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>
          {Icons.angleRight}
        </FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}
