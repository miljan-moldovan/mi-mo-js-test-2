import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
  InputGroup,
  ProviderInput,
  ServiceInput,
  InputDivider,
} from '../../components/formHelpers';
import apiWrapper from '../../utilities/apiWrapper';
import WordHighlighter from '../../components/wordHighlighter';
import HeaderLateral from '../../components/HeaderLateral';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import SalonAvatar from '../../components/SalonAvatar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  searchBarContainer: {
    backgroundColor: '#F1F1F1',
  },
  row: {
    height: 43,
    paddingHorizontal: 16,
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    fontSize: 14,
    lineHeight: 44,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  itemRow: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'white',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#C0C1C6',
  },
  inputRow: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  providerName: {
    fontSize: 14,
    marginLeft: 7,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default class ServiceCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Service Check',
    headerLeft: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.state.params.onNavigateBack()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto' }}>
          Cancel
        </Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.state.params.handleCheck()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto-Medium' }}>
          Check
        </Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleCheck: this.handleCheck });
    this.state = {
      isLoading: false,
      selectedProvider: null,
      selectedService: null,
    };
  }

  handleCheck = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;

    const { selectedProvider, selectedService } = this.state;
    this.props.navigation.navigate('ServiceCheckResult', {
      dismissOnSelect,
      onNavigateBack,
      selectedService,
      selectedProvider,
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 17 }}>
          <ProviderInput
            noPlaceholder
            filterByService
            navigate={navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={selectedProvider => this.setState({ selectedProvider })}
          />
          <InputDivider />
          <ServiceInput
            filterByProvider
            navigate={navigate}
            selectedService={this.state.selectedService}
            onChange={selectedService => this.setState({ selectedService })}
          />
        </InputGroup>
      </View>
    );
  }
}
