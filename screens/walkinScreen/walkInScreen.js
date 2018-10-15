import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { isEqual } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import ClientInfoButton from '../../components/ClientInfoButton';

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

    const canSave = navigation.state.params.canSave || false;

    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Walk-in</Text>
          <Text style={styles.subTitleText}>{waitTime}m Est. wait</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.sideButtons} onPress={() => { navigation.goBack(); }}>
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
        <SalonTouchableOpacity disabled={!canSave} style={styles.sideButtons} onPress={handlePress}>
          <View style={styles.rightButtonContainer}>
            <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
          </View>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      client: null,
      services: [],
    };
  }

  componentWillMount() {
    this.props.queueActions.getQueueState(this.setWaitMins);
    this.props.settingsActions.getSettings();

    const { newAppointment } = this.props.navigation.state.params;
    if (newAppointment) {
      const { client, provider, service } = newAppointment;

      const services = [{
        service,
        provider,
        isProviderRequested: false, //! provider.isFirstAvailable,
      }];

      this.setState({ client, services }, this.checkCanSave);
    }
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkin: () => {
        this.handleWalkin();
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const prevClientInfo = this.state.client;
    const newClientInfo = nextProps.clientInfoState.client;
    if (prevClientInfo.id === newClientInfo.id && 
      !isEqual(prevClientInfo, newClientInfo)) {
      this.setState({ client: newClientInfo }, this.checkCanSave);
    }
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
        services,
        client,
      } = this.state;

      const servicesBlock = [];
      for (let i = 0; i < services.length; i += 1) {
        const serviceContainer = services[i];

        const providerBlock =
        serviceContainer.provider.isFirstAvailable ?
          {} : { providerId: serviceContainer.provider.id };

          //! provider.isFirstAvailable,

        servicesBlock.push({
          serviceId: serviceContainer.service.id,
          ...providerBlock,
          isProviderRequested: serviceContainer.isProviderRequested,
          isFirstAvailable: serviceContainer.provider.isFirstAvailable,
        });
      }

      const params = {
        clientId: client.id,
        phoneNumber: client.phone,
        email: client.email,
        services: servicesBlock,
      };
      this.props.walkInActions.postWalkinClient(params).then(() => {
        this.saving = false;
        const params = this.props.navigation.state.params || {};
        params.loadQueueData();
        this.props.navigation.navigate('Main', {transition: 'slideFromRight'});
      });
    }
  }

  handleUpdateClient= (client) => {
    this.setState({ client }, this.checkCanSave);
  }

  onChangeClient = (client) => {
    this.setState({
      client,
    }, this.checkCanSave);
  }

  renderExtraClientButtons = isDisabled => (<ClientInfoButton
    client={this.state.client}
    navigation={this.props.navigation}
    onDonePress={() => {}}
    apptBook={false}
    buttonStyle={{ marginHorizontal: 5 }}
    iconStyle={{ fontSize: 20, color: '#115ECD' }}
  />)
  ;


  handleRemoveService= (index) => {
    const { services } = this.state;
    services.splice(index, 1);
    this.setState({ services }, this.checkCanSave);
  }

    handleUpdateService= (index, service) => {
      const { services } = this.state;
      services[index] = service;
      this.setState({ services }, this.checkCanSave);
    }

    checkCanSave = () => {
      const {
        services,
      } = this.state;

      let canSave = true;

      for (let i = 0; i < services.length; i += 1) {
        const serviceBlock = services[i];
        canSave = canSave && serviceBlock.service !== null && serviceBlock.provider !== undefined;
      }

      this.props.navigation.setParams({ canSave });
    }

    handleAddService= () => {
      const params = this.props.navigation.state.params || {};

      const {
        employee,
      } = params;

      const service = {
        provider: employee,
        service: null,
        isProviderRequested: false,
      };

      const { services } = this.state;
      services.push(service);
      this.setState({ services }, this.checkCanSave);
    }


    cancelButton = () => ({
      leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
      leftButtonOnPress: (navigation) => {
        navigation.goBack();
      },
    })

    render() {
      const email = this.state.client && this.state.client.id !== 1 && this.state.client.email ? this.state.client.email : '';
      const phones = this.state.client && this.state.client.id !== 1 && this.state.client.phones && this.state.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');
      return (
        <ScrollView style={styles.container}>

          {this.props.walkInState.isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
        ) : (
          <View style={styles.container}>
            <SectionTitle value="CLIENT" style={styles.sectionTitleRootStyle} sectionTitleStyle={styles.sectionTitleStyle} />
            <InputGroup style={styles.inputGroupStyle}>
              <ClientInput
                walkin
                style={styles.rootStyle}
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
              <InputLabel style={styles.rootStyle} label="Email" value={email} />
              <InputDivider />
              <InputLabel style={styles.rootStyle} label="Phone" value={phones} />
            </InputGroup>
            <SectionTitle value="SERVICE AND PROVIDER" style={styles.sectionTitleRootStyle} sectionTitleStyle={styles.sectionTitleStyle} />
            <ServiceSection
              services={this.state.services}
              onAdd={this.handleAddService}
              onRemove={this.handleRemoveService}
              onUpdate={this.handleUpdateService}
              cancelButton={this.cancelButton}
              navigate={this.props.navigation.navigate}
              walkin
            />
          </View>)}
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
  settingsActions: PropTypes.shape({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
  queueActions: PropTypes.shape({
    getQueueState: PropTypes.func.isRequired,
  }).isRequired,
  queue: PropTypes.any.isRequired,
};

export default WalkInScreen;
