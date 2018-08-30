import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { get, includes } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';
import LoadingOverlay from '../../components/LoadingOverlay';
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
    const params = props.navigation.state.params || {};
    const selected = params.selectedIds || [];
    props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selected,
    };
  }

  onChangeSelected = selected => this.setState({ selected })

  handleSave = (empty = false) => {
    const { navigation: { goBack, state }, services: allServices } = this.props;
    const { selected } = this.state;
    const params = state.params || {};
    const onSave = get(params, 'onSave', srv => srv);
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
    const { isLoading } = this.props.servicesState;
    const {
      selected,
    } = this.state;
    const params = this.props.navigation.state.params || {};
    const services = get(params, 'services', []);
    return isLoading ? (
      <LoadingOverlay />
    ) : (
      <SelectableServiceList
        selected={selected}
        services={services}
        onChangeSelected={this.onChangeSelected}
        noneButton={{ name: 'No Add-on', onPress: this.handlePressNone }}
      />
    );
  }
}
