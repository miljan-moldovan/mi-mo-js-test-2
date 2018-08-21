import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import Icon from '../../components/UI/Icon';

import {
  InputLabel,
  InputGroup,
  InputDivider,
  SectionTitle,
  ClientInput,
} from '../../components/formHelpers';
import ServiceSection from './components/serviceSection';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';

class WalkInScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params &&
    navigation.state.params.walkin ?
      navigation.state.params.walkin : () => {};

    const waitTime = navigation.state.params &&
    navigation.state.params.waitTime ?
      navigation.state.params.waitTime : 0;
    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Walk-in</Text>
          <Text style={styles.subTitleText}>{waitTime}m Est. wait</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={() => { navigation.goBack(); }}>
          <View style={styles.leftButtonContainer}>
            <FontAwesome style={styles.headerLeftIcon}>
              {Icons.angleLeft}
            </FontAwesome>
            <Text style={styles.leftButtonText}>
              Back
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity style={styles.rightButton} onPress={handlePress}>
          <View style={styles.rightButtonContainer}>
            <Text style={styles.rightButtonText}>
              Done
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      service: null,
      provider: null,
      client: null,
      isProviderRequested: false,
    };
  }

  componentWillMount() {
    this.props.queueActions.getQueueState(this.setWaitMins);

    const { newAppointment } = this.props.navigation.state.params;
    if (newAppointment) {
      const { client, provider, service } = newAppointment;
      this.setState({ client, provider, service });
    }
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkin: () => {
        this.handleWalkin();
        // navigation.navigate('Main');
      },
    });
  }


  setWaitMins = () => {
    const { guestWaitMins } = this.props.queue.queueState ? this.props.queue.queueState : {};
    let waitTime = '-';
    if (guestWaitMins > 0) {
      waitTime = `${guestWaitMins}`;
    } else if (guestWaitMins === 0) {
      waitTime = '0';
    }

    const { navigation } = this.props;
    navigation.setParams({ waitTime });
  }

  getFullName = () => {
    let fullName = '';
    const { client } = this.state;
    if (client) {
      if (client.name) {
        fullName = client.name;
      }
      if (client.lastName) {
        fullName = fullName ? `${fullName} ${client.lastName}` : client.lastName;
      }
    }
    return fullName;
  }

  saving = false

  handleWalkin = () => {
    if (!this.saving) {
      this.saving = true;
      const {
        service,
        provider,
        client,
        isProviderRequested,
      } = this.state;



      console.log('provider ', provider);

      const params = {
        clientId: client.id,
        phoneNumber: client.phone,
        email: client.email,
        services: [
          {
            serviceId: service.id,
            providerId: provider.id,
            isProviderRequested,
            isFirstAvailable: provider.isFirstAvailable,
          },
        ],
      };
      this.props.walkInActions.postWalkinClient(params).then(() => {
        this.saving = false;
        this.props.navigation.navigate('Main');
      });
    }
  }

  handleUpdateService= (service) => {
    this.setState({ service });
  }

  handleUpdateProvider= (provider) => {
    this.setState({ provider });
  }

  handleUpdateIsProviderRequested= () => {
    this.setState({ isProviderRequested: !this.state.isProviderRequested });
  }


  handleUpdateClient= (client) => {
    this.setState({ client });
  }

  onChangeClient = (client) => {
    this.setState({
      client,
    });
  }

  goToClientInfo = () => {
    this.props.navigation.navigate('ClientInfo', { client: this.state.client });
  }


    renderExtraClientButtons = isDisabled =>

      (<SalonTouchableOpacity
        onPress={this.goToClientInfo}
        style={{
          marginHorizontal: 5,
        }}
      >
        <Icon
          name="infoCircle"
          size={20}
          color="#115ECD"
          type="regular"
        />
       </SalonTouchableOpacity>)
    ;

    render() {
      const fullName = this.getFullName();
      const email = this.state.client && this.state.client.email ? this.state.client.email : '';
      const phones = this.state.client && this.state.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');
      return (
        <ScrollView style={styles.container}>
          <SectionTitle value="CLIENT" />
          <InputGroup>
            <ClientInput
              navigate={this.props.navigation.navigate}
              label={this.state.client === null ? 'Client' : 'Client'}
              headerProps={{
              title: 'Clients',
              leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
                leftButtonOnPress: (navigation) => {
                  navigation.goBack();
                },
              }}
              selectedClient={this.state.client}
              onChange={this.onChangeClient}
              extraComponents={this.state.client !== null && this.renderExtraClientButtons()}
            />
            <InputDivider />
            <InputLabel label="Email" value={email} />
            <InputDivider />
            <InputLabel label="Phone" value={phones} />
          </InputGroup>
          <SectionTitle value="SERVICE AND PROVIDER" />
          <ServiceSection
            service={this.state.service}
            provider={this.state.provider}
            navigate={this.props.navigation.navigate}
            onRemove={this.handleRemoveService}
            onUpdateService={this.handleUpdateService}
            onUpdateProvider={this.handleUpdateProvider}
            onUpdateIsProviderRequested={this.handleUpdateIsProviderRequested}
            isProviderRequested={this.state.isProviderRequested}
          />
        </ScrollView>
      );
    }
}

WalkInScreen.defaultProps = {

};

WalkInScreen.propTypes = {
  walkInActions: PropTypes.shape({
    postWalkinClient: PropTypes.func.isRequired,
  }).isRequired,
  queueActions: PropTypes.shape({
    getQueueState: PropTypes.func.isRequired,
  }).isRequired,
  queue: PropTypes.any.isRequired,
};

export default WalkInScreen;
