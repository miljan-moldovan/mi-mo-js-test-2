import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';

import {
  InputGroup,
  DefaultAvatar,
} from '../../components/formHelpers';
import { Services } from '../../utilities/apiWrapper';
import Icon from '../../components/UI/Icon';
import SalonAvatar from '../../components/SalonAvatar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import getEmployeePhotoSource from '../../utilities/helpers/getEmployeePhotoSource';
import LoadingOverlay from '../../components/LoadingOverlay';

import styles from './styles';

export default class ServiceCheckResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const employeeName = `${params.selectedProvider.name} ${params.selectedProvider.lastName}`;
    const serviceName = params.selectedService.name;
    const doneFunc = () => navigation.state.params.handleDone();
    return ({
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>{employeeName}</Text>
          <Text style={styles.headerSubtitleText}>{serviceName}</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity
          style={styles.headerLeftButton}
          wait={3000}
          onPress={navigation.goBack}
        >
          <Icon name="angleLeft" type="regular" color="white" size={22} />
          <Text style={[styles.headerButtonText, styles.marginLeft]}>Back</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity style={styles.headerRightButton} wait={3000} onPress={doneFunc}>
          <Text style={[styles.headerButtonText, styles.robotoMedium]}>Done</Text>
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
    const {
      onChangePosition,
      dismissOnSelect,
    } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangePosition) {
      onChangePosition(this.state.selectedPosition);
    }
    if (dismissOnSelect) {
      this.props.navigation.navigate('ApptBookViewOptions', { transition: 'SlideFromBottom' });
    }
  }

  render() {
    const { result } = this.state;
    const params = this.props.navigation.state.params || {};
    const selectedProvider = params.selectedProvider || null;
    const image = getEmployeePhotoSource(selectedProvider);
    return (
      <View style={styles.container}>
        {
          this.state.isLoading ?
            (
              <LoadingOverlay />
            ) : (
              <InputGroup style={styles.inputGroup}>
                {
                  this.state.result === null ?
                    (
                      <Text style={styles.errorText}>There was an error. Please try again.</Text>
                    ) : (
                      <View style={styles.resultContainer}>
                        <View style={styles.resultRow}>
                          <SalonAvatar
                            width={30}
                            borderWidth={1}
                            borderColor="transparent"
                            image={image}
                            defaultComponent={(
                              <DefaultAvatar
                                provider={selectedProvider}
                              />
                            )}
                          />
                          <Text style={styles.resultEmployeeText}>{`${result.employeeFirstName} ${result.employeeLastName}`}</Text>
                        </View>
                        <View style={styles.resultService}>
                          <Text style={styles.resultServiceDuration}>{`${moment.duration(result.duration).asMinutes()}m`}
                          </Text>
                          <Text style={styles.resultServicePrice}>{`$${result.price}`}
                          </Text>
                        </View>
                      </View>
                    )
                }
              </InputGroup>
            )
        }
      </View>
    );
  }
}
