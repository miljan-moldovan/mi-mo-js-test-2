import React from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import {get} from 'lodash';
import {InputGroup, DefaultAvatar} from '../../components/formHelpers';
import {Services} from '../../utilities/apiWrapper';
import Icon from '../../components/UI/Icon';
import SalonAvatar from '../../components/SalonAvatar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import getEmployeePhotoSource
  from '../../utilities/helpers/getEmployeePhotoSource';
import LoadingOverlay from '../../components/LoadingOverlay';

import styles from './styles';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';
import {showErrorAlert} from '../../redux/actions/utils';

const initialState = {
  isLoading: false,
  price: 0,
  duration: 0,
  employeeFirstName: '',
  employeeLastName: '',
};

export default class ServiceCheckResultScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const selectedProvider = navigation.getParam ('selectedProvider', null);
    const selectedService = navigation.getParam ('selectedService', null);
    const handleDone = navigation.getParam ('handleDone', () => {});
    const employeeName = `${get (selectedProvider, 'name', '')} ${get (selectedProvider, 'lastName', '')}`;
    const serviceName = get (selectedService, 'name', '');
    return {
      header: (
        <SalonHeader
          title={employeeName}
          subTitle={serviceName}
          headerLeft={
            <SalonTouchableOpacity
              style={styles.headerLeftButton}
              wait={3000}
              onPress={navigation.goBack}
            >
              <Icon name="angleLeft" type="regular" color="white" size={22} />
              <Text style={[styles.headerButtonText, styles.marginLeft]}>
                Back
              </Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              style={styles.headerRightButton}
              wait={3000}
              onPress={handleDone}
            >
              <Text style={[styles.headerButtonText, styles.robotoMedium]}>
                Done
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor (props) {
    super (props);
    this.state = {...initialState};
    props.navigation.setParams ({handleDone: this.handleDone});
    props.navigation.addListener ('willFocus', this.refresh);
    props.navigation.addListener ('willBlur', this.refresh);
  }

  componentDidMount () {
    this.refresh ();
  }

  refresh () {
    const {navigation: {getParam}} = this.props;
    const serviceId = get (getParam ('selectedService', {}), 'id', null);
    const employeeId = get (getParam ('selectedProvider', {}), 'id', null);
    if (serviceId && employeeId) {
      this.setState ({isLoading: true}, () => {
        Services.getServiceEmployeeCheck ({
          serviceId,
          employeeId,
          setCancelToken: false,
        })
          .then (result => {
            const employeeFirstName = get (result, 'employeeFirstName', '');
            const employeeLastName = get (result, 'employeeLastName', '');
            const price = get (result, 'price', 0);
            const duration = get (result, 'duration', 0);
            this.setState ({
              isLoading: false,
              price,
              duration,
              employeeFirstName,
              employeeLastName,
            });
          })
          .catch (err =>
            this.setState ({...initialState}, () => showErrorAlert (err))
          );
      });
    }
  }

  handleDone = () => {
    this.props.navigation.navigate ('ApptBookViewOptions', {
      transition: 'SlideFromBottom',
    });
  };

  render () {
    const {
      price,
      employeeFirstName,
      employeeLastName,
      duration,
      isLoading,
    } = this.state;
    const params = this.props.navigation.state.params || {};
    const selectedProvider = params.selectedProvider || null;
    const image = getEmployeePhotoSource (selectedProvider);
    return (
      <View style={styles.container}>
        {isLoading && <LoadingOverlay />}
        <InputGroup style={styles.inputGroup}>
          <View style={styles.resultContainer}>
            <View style={styles.resultRow}>
              <SalonAvatar
                width={30}
                borderWidth={1}
                borderColor="transparent"
                image={image}
                defaultComponent={<DefaultAvatar provider={selectedProvider} />}
              />
              <Text
                style={styles.resultEmployeeText}
              >{`${employeeFirstName} ${employeeLastName}`}</Text>
            </View>
            <View style={styles.resultService}>
              <Text style={styles.resultServiceDuration}>
                {`${moment.duration (duration).asMinutes ()}m`}
              </Text>
              <Text style={styles.resultServicePrice}>
                {`$${price.toFixed (2)}`}
              </Text>
            </View>
          </View>
        </InputGroup>
      </View>
    );
  }
}
