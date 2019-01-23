import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { get } from 'lodash';

import {
  InputGroup,
  ProviderInput,
  ServiceInput,
  InputDivider,
} from '../../components/formHelpers';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonHeader from '../../components/SalonHeader';
import Colors from '../../constants/Colors';

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
    fontSize: 14,
    color: 'white',
  },
});

export default class ServiceCheckScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const canCheck = navigation.getParam('canCheck', false);
    const rightBtnStyle = {
      color: canCheck ? Colors.white : 'rgba(0,0,0,0.3)',
    };
    return {
      header: (
        <SalonHeader
          title="Service Check"
          headerLeft={
            <SalonTouchableOpacity
              style={{ paddingLeft: 10 }}
              wait={3000}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              wait={3000}
              disabled={!canCheck}
              style={{ paddingRight: 10 }}
              onPress={navigation.getParam('handleCheck', () => {
              })}
            >
              <Text style={[styles.rightButtonText, rightBtnStyle]}>Check</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({
      handleCheck: this.handleCheck,
      canCheck: false,
    });
    this.state = {
      selectedProvider: null,
      selectedService: null,
    };
    props.navigation.addListener('willFocus', this.validate);
    props.navigation.addListener('willBlur', this.validate);
  }

  componentDidMount() {
    this.validate();
  }

  onChangeProvider = provider => this.setState({ selectedProvider: provider });

  onChangeService = service => this.setState({ selectedService: service });

  validate = () => {
    const { selectedProvider, selectedService } = this.state;
    const canCheck =
      get(selectedProvider, 'id', false) && get(selectedService, 'id', false);
    this.props.navigation.setParams({ canCheck });
    return canCheck;
  };

  handleCheck = () => {
    if (this.validate()) {
      const { navigation: { navigate, setParams } } = this.props;
      const { selectedProvider, selectedService } = this.state;
      setParams({ canCheck: false });
      navigate('ServiceCheckResult', {
        selectedService,
        selectedProvider,
      });
    }
  };

  cancelButton = () => ({
    leftButton: <Text style={styles.navButton}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  });

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
            showAllProviders
            showFirstAvailable={false}
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
            onChange={this.onChangeProvider}
          />
          <InputDivider/>
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
