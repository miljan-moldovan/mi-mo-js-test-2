import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';
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
    props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selected: [],
    };
  }

  onChangeSelected = selected => this.setState({ selected })

  handleSave = (empty = false) => {
    const onSave = this.props.navigation.getParam('onSave', null);
    if (empty) {
      return onSave([]);
    }
    const selected = this.serviceList.selectedServices;

    onSave(selected);
    return this.props.navigation.goBack();
  }

  handlePressNone = () => this.handleSave(true)

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
    const {
      selected,
    } = this.state;
    const services = this.props.navigation.getParam('services', []);
    return (
      <SelectableServiceList
        selected={selected}
        services={services}
        onChangeSelected={this.onChangeSelected}
        ref={(ref) => { this.serviceList = ref; }}
        noneButton={{ name: 'No Add-on', onPress: this.handlePressNone }}
      />
    );
  }
}
