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
import { Services, getEmployeePhoto } from '../../utilities/apiWrapper';
import Icon from '../../components/UI/Icon';
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
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const employeeName = `${params.selectedProvider.name} ${params.selectedProvider.lastName}`;
    const serviceName = params.selectedService.name;
    return ({
      headerTitle: (
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={{
            fontSize: 17,
            color: 'white',
            fontFamily: 'Roboto-Medium',
          }}
          >{employeeName}
          </Text>
          <Text style={{
            fontSize: 11,
            color: 'white',
          }}
          >{serviceName}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} wait={3000} onPress={() => navigation.goBack()}>
          <Icon name="angleLeft" type="regular" color="white" size={22} />
          <Text style={{
            fontSize: 14,
            marginLeft: 8,
            color: 'white',
            fontFamily: 'Roboto',
          }}
          >
            Back
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
  };

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ handleDone: this.handleDone });
    this.state = {
      isLoading: true,
      selectedProvider: params.selectedProvider,
      selectedService: params.selectedService,
      result: null,
    };
  }

  componentDidMount() {
    Services.getServiceEmployeeCheck({
      serviceId: this.state.selectedService.id,
      employeeId: this.state.selectedProvider.id,
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
        {this.state.isLoading ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <ActivityIndicator />
          </View>
        ) : (
          <InputGroup style={{ marginTop: 17, paddingRight: 22 }}>
            {this.state.result === null ? (
              <Text style={{
                color: '#110A24',
                fontSize: 14,
                lineHeight: 44,
                marginLeft: 6,
                fontFamily: 'Roboto-Medium',
              }}
              >
                There was an error. Please try again.
              </Text>
            ) : (
              <View style={{
                  height: 44,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <SalonAvatar
                    wrapperStyle={styles.providerRound}
                    width={30}
                    borderWidth={1}
                    borderColor="transparent"
                    image={{ uri: getEmployeePhoto(result.employeeId) }}
                  />
                  <Text style={{
                      color: '#110A24',
                      fontSize: 14,
                      lineHeight: 44,
                      marginLeft: 6,
                      fontFamily: 'Roboto-Medium',
                    }}
                  >{`${result.employeeFirstName} ${result.employeeLastName}`}
                  </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                      color: '#0C4699',
                      fontSize: 11,
                      lineHeight: 44,
                      fontFamily: 'Roboto-Thin',
                    }}
                  >{`${moment.duration(result.duration).asMinutes()}m`}
                  </Text>
                  <Text style={{
                      color: '#727A8F',
                      fontSize: 14,
                      marginLeft: 26,
                      lineHeight: 44,
                    }}
                  >{`$${result.price}`}
                  </Text>
                </View>
              </View>
            )}
          </InputGroup>
        )}
      </View>
    );
  }
}
