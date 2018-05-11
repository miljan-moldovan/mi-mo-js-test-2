import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import {
  InputGroup,
  ProviderInput,
  ServiceInput,
  InputDivider,
} from '../../components/formHelpers';
import apiWrapper from '../../utilities/apiWrapper';
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

export default class ServiceCheckResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Service Check',
    headerLeft: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto' }}>
          Cancel
        </Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.state.params.handleDone()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto-Medium' }}>
          Done
        </Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ handleDone: this.handleDone });
    debugger //eslint-disable-line
    this.state = {
      isLoading: true,
      selectedProvider: params.selectedProvider,
      selectedService: params.selectedService,
      result: null,
    };
  }

  componentDidMount() {
    apiWrapper.doRequest('getServiceEmployeeCheck', {
      path: {
        serviceId: this.state.selectedService.id,
        employeeId: this.state.selectedProvider.id,
      },
    })
      .then(result => this.setState({ result, isLoading: false }))
      .catch((err) => {
        console.warn(err);
        this.setState({ isLoading: false });
      });
  }

  handleDone = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangePosition, onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangePosition) { onChangePosition(this.state.selectedPosition); }
    if (dismissOnSelect) { onNavigateBack(); }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { result } = this.state;
    return (
      <View style={styles.container}>
        {this.state.isLoading ? <ActivityIndicator /> : (
          <InputGroup style={{ marginTop: 17 }}>
            <View style={{
              height: 44,
              flexDirection: 'row',
            }}
            >
              <View style={{ flex: 1 }}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={30}
                  borderWidth={1}
                  borderColor="transparent"
                  image={{ uri: apiWrapper.getEmployeePhoto(result.employeeId) }}
                />
                <Text>{`${result.employeeFirstName} ${result.employeeLastName}`}</Text>
              </View>
              <View>
                <Text style={{
                  color: '#0C4699',
                  fontSize: 11,
                }}
                >{`${moment.duration(result.duration).asMinutes()}m`}
                </Text>
                <Text style={{
                  color: '#727A8F',
                  fontSize: 14,
                }}
                >{`$${result.price}`}
                </Text>
              </View>
            </View>
          </InputGroup>
        )}
      </View>
    );
  }
}
