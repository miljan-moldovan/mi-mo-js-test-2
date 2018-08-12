import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { includes } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';
import Icon from '../../components/UI/Icon';
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
    const { navigation: { goBack }, services: allServices } = this.props;
    const { selected } = this.state;
    const onSave = this.props.navigation.getParam('onSave', null);
    if (empty) {
      onSave([]);
      return goBack();
    }
    const services = allServices.filter(srv => includes(selected, srv.id));
    onSave(services);
    return goBack();
  }

  handlePressNone = () => this.handleSave(true)

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
