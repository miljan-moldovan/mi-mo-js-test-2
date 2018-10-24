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
  navButton: {
    fontSize: 14,
    color: 'white',
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
  headerButton: { fontSize: 14, color: 'white', fontFamily: 'Roboto' },
  robotoMedium: { fontFamily: 'Roboto-Medium' },
  leftButtonText: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    fontSize: 14,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  rightButtonText: {
    backgroundColor: 'transparent',
    paddingRight: 10,
    fontSize: 14,
    color: 'white',
  },
});

export default class ServiceCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
              Service Check
        </Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.goBack()}>
        <Text style={styles.leftButtonText}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity wait={3000} onPress={navigation.getParam('handleCheck', () => {})}>
        <Text style={styles.rightButtonText}>Check</Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleCheck: this.handleCheck });
    this.state = {
      selectedProvider: null,
      selectedService: null,
    };
  }

  onChangeProvider = provider => this.setState({ selectedProvider: provider })

  onChangeService = service => this.setState({ selectedService: service })

  handleCheck = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { dismissOnSelect } = this.props.navigation.state.params;

    const { selectedProvider, selectedService } = this.state;
    this.props.navigation.navigate('ServiceCheckResult', {
      dismissOnSelect,
      selectedService,
      selectedProvider,
    });
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.navButton}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  })


  render() {
    const { navigate } = this.props.navigation;
    const { selectedProvider, selectedService } = this.state;
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 17 }}>
          <ProviderInput
            apptBook
            noPlaceholder
            filterByService
            navigate={navigate}
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
            onChange={this.onChangeProvider}
          />
          <InputDivider />
          <ServiceInput
            apptBook
            filterByProvider
            navigate={navigate}
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
            onChange={this.onChangeService}
          />
        </InputGroup>
      </View>
    );
  }
}
