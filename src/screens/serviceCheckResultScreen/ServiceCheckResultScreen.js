import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import { get } from 'lodash';
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
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

export default class ServiceCheckResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const selectedProvider = navigation.getParam('selectedProvider', null);
    const selectedService = navigation.getParam('selectedService', null);
    const handleDone = navigation.getParam('handleDone', (() => {}));
    const employeeName = `${get(selectedProvider, 'name', '')} ${get(selectedProvider, 'lastName', '')}`;
    const serviceName = get(selectedService, 'name', '');
    return ({
      header: (
        <SalonHeader
          title={employeeName}
          subTitle={serviceName}
          headerLeft={(
            <SalonTouchableOpacity
              style={styles.headerLeftButton}
              wait={3000}
              onPress={navigation.goBack}
            >
              <Icon name="angleLeft" type="regular" color="white" size={22} />
              <Text style={[styles.headerButtonText, styles.marginLeft]}>Back</Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity style={styles.headerRightButton} wait={3000} onPress={handleDone}>
              <Text style={[styles.headerButtonText, styles.robotoMedium]}>Done</Text>
            </SalonTouchableOpacity>
          )}
        />
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
