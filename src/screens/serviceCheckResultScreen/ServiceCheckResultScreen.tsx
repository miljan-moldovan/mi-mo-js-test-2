import * as React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import { get } from 'lodash';
import { DefaultAvatar } from '../../components/formHelpers';
import { Services } from '../../utilities/apiWrapper';
import Icon from '@/components/common/Icon';
import SalonAvatar from '../../components/SalonAvatar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import LoadingOverlay from '../../components/LoadingOverlay';

import styles from './styles';
import SalonHeader from '../../components/SalonHeader';
import { showErrorAlert } from '../../redux/actions/utils';
import SalonFlatList from '@/components/common/SalonFlatList';
import SalonListItem from '@/components/common/SalonListItem';

const initialState = {
  isLoading: false,
  employees: [],
};

export default class ServiceCheckResultScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const selectedProvider = navigation.getParam('selectedProvider', null);
    const selectedService = navigation.getParam('selectedService', null);
    const handleDone = navigation.getParam('handleDone', () => {});
    const employeeName = `${get(selectedProvider, 'name', '')} ${get(selectedProvider, 'lastName', '')}`;
    const serviceName = get(selectedService, 'name', '');
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
              <Icon name="angleLeft" color="white" size={22}/>
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

  constructor(props) {
    super(props);
    this.state = { ...initialState };
    props.navigation.setParams({ handleDone: this.handleDone });
    props.navigation.addListener('willFocus', this.refresh);
    props.navigation.addListener('willBlur', this.refresh);
  }

  componentDidMount() {
    this.refresh();
  }

  loadDefaultEmployeeCheck = (serviceId, employeeId) => {
    Services.getServiceEmployeeCheck({
      serviceId,
      employeeId,
      setCancelToken: false,
    })
      .then(result => {
        const employeeFirstName = get(result, 'employeeFirstName', '');
        const employeeLastName = get(result, 'employeeLastName', '');
        const price = get(result, 'price', 0);
        const duration = get(result, 'duration', 0);
        this.setState({
          isLoading: false,
          employees: [{ price, duration, employeeFirstName, employeeLastName }],
        });
      })
      .catch(err =>
        this.setState({ ...initialState }, () => showErrorAlert(err)),
      );
  };

  loadAllEmployeeCheck = serviceId => {
    Services.getServiceForAllEmployeeCheck({
      serviceId,
      setCancelToken: false,
    })
      .then(result => {
        this.setState({
          isLoading: false,
          employees: result,
        });
      })
      .catch(err =>
        this.setState({ ...initialState }, () => showErrorAlert(err)),
      );
  };

  refresh() {
    const { navigation: { getParam } } = this.props;
    const serviceId = get(getParam('selectedService', {}), 'id', null);
    const employeeId = get(getParam('selectedProvider', {}), 'id', null);
    if (serviceId && employeeId) {
      let request;
      if (employeeId === -1) {
        request = () => this.loadAllEmployeeCheck(serviceId);
      } else {
        request = () => this.loadDefaultEmployeeCheck(serviceId, employeeId);
      }
      this.setState({ isLoading: true }, request);
    }
  }

  handleDone = () => {
    this.props.navigation.navigate('ApptBookViewOptions', {
      transition: 'SlideFromBottom',
    });
  };

  renderItem = ({ item }) => {
    const {
      price,
      employeeFirstName,
      employeeLastName,
      duration,
      employeeId,
    } = item;
    const defaultAvatar = {
      name: employeeFirstName,
      lastName: employeeLastName,
    };
    return (
      <SalonListItem
        onPress={() => {}}
        key={`employeeId_${employeeId}`}
      >
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <SalonAvatar
              width={30}
              borderWidth={1}
              borderColor="transparent"
              defaultComponent={<DefaultAvatar provider={defaultAvatar}/>}
            />
            <Text
              style={styles.resultEmployeeText}
            >{`${employeeFirstName} ${employeeLastName}`}</Text>
          </View>
          <View style={styles.resultService}>
            <Text style={styles.resultServiceDuration}>
              {`${moment.duration(duration).asMinutes()}m`}
            </Text>
            <Text style={styles.resultServicePrice}>
              {`$${price.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </SalonListItem>
    );
  };

  render() {
    const {
      isLoading,
      employees,
    } = this.state;
    return (
      <View style={styles.container}>
        {isLoading && <LoadingOverlay/>}
        <SalonFlatList
          style={styles.container}
          renderItem={this.renderItem}
          data={employees}
        />
      </View>
    );
  }
}
