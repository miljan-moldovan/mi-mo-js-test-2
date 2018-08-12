import React from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import { includes } from 'lodash';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';

import styles from './styles';

const PHONE_WIDTH = Dimensions.get('window').width;

export default class RecommendedServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const serviceTitle = params.serviceTitle || '';
    const showCancelButton = params.showCancelButton || false;
    const handleSave = params.handleSave || (() => null);
    const onNavigateBack = params.onNavigateBack || (() => null);
    const handleGoBack = () => {
      onNavigateBack();
      navigation.goBack();
    };
    const title = PHONE_WIDTH < 375 ? 'Req. Services' : 'Required Services';
    return ({
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>
            {title}
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
      // headerRight: (
      //   <SalonTouchableOpacity onPress={() => handleSave()}>
      //     <Text style={[styles.headerButtonText, styles.robotoMedium]}>Done</Text>
      //   </SalonTouchableOpacity>
      // ),
    });
  };

  constructor(props) {
    super(props);
    props.navigation.setParams({ handleSave: this.handleSave });
    this.state = {
      selected: [],
    };
  }

  onChangeSelected = selected => this.setState({ selected }, this.handleSave)

  handleSave = (empty = false) => {
    const { navigation: { goBack, getParam }, services: allServices } = this.props;
    const { selected } = this.state;
    const onSave = getParam('onSave', srv => srv);
    if (empty) {
      onSave([]);
      return goBack();
    }
    const services = allServices.filter(srv => includes(selected, srv.id));
    onSave(services);
    return goBack();
  }

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
      />
    );
  }
}
