import React from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
} from 'react-native';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import LoadingOverlay from '../../components/LoadingOverlay';
import styles from './styles';
import SelectableServiceList from '../../components/SelectableServiceList/SelectableServiceList';

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
    const recommendedTitle = PHONE_WIDTH < 375 ? 'Rec. Services' : 'Recommended Services';
    return ({
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>
            {recommendedTitle}
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
    const services = props.navigation.getParam('services', []);
    this.state = { services };
  }

  handleSave = (selected = []) => {
    const services = this.serviceList.handleSave();
    debugger //eslint-disable-line
    // const { services } = this.state;
    const params = this.props.navigation.state.params || {};
    const onSave = params.onSave || false;
    if (onSave) {
      onSave(selected);
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <SelectableServiceList
        noneButton="No Recommended"
        ref={(ref) => { this.serviceList = ref; }}
      />
    );
  }
}
