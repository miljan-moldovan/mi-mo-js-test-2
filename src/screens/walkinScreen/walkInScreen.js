import React, {Component} from 'react';
import {StackActions, NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, ActivityIndicator} from 'react-native';
import {get, isEqual, isNull, isUndefined} from 'lodash';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import ClientInfoButton from '../../components/ClientInfoButton';
import regexs from '../../constants/Regexs';
import ClientPhoneTypes from '../../constants/ClientPhoneTypes';
import {Client} from '../../utilities/apiWrapper';

import {
  InputLabel,
  InputGroup,
  InputDivider,
  SectionTitle,
  ClientInput,
  ValidatableInput,
} from '../../components/formHelpers';
import ServiceSection from './components/serviceSection';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';
import SalonHeader from '../../components/SalonHeader';

class WalkInScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    const handlePress = params && params.handleSave
      ? params.handleSave
      : () => {};

    const handleGoBack = navigation.getParam ('handleGoBack', () => {});
    const waitTime = params && params.waitTime ? params.waitTime : 0;

    let canSave;
    if (params && params.isValidInfo) {
      canSave = params.isValidInfo ();
    }

    return {
      header: (
        <SalonHeader
          title="Walk-in"
          subTitle={`${waitTime}m Est. wait`}
          headerLeft={
            <SalonTouchableOpacity
              style={[styles.sideButtons, {paddingLeft: 10}]}
              onPress={handleGoBack}
            >
              <View style={styles.leftButtonContainer}>
                <FontAwesome style={styles.headerLeftIcon}>
                  {Icons.angleLeft}
                </FontAwesome>
                <Text style={styles.leftButtonText}>
                  Back
                </Text>
              </View>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              disabled={!canSave}
              style={[styles.sideButtons, {paddingRight: 10}]}
              onPress={handlePress}
            >
              <View style={styles.rightButtonContainer}>
                <Text
                  style={[
                    styles.rightButtonText,
                    {color: canSave ? '#FFFFFF' : '#19428A'},
                  ]}
                >
                  Done
                </Text>
              </View>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor (props) {
    super (props);
    this.state = {
      client: null,
      email: '',
      phone: null,
      isValidEmail: true,
      isValidPhone: true,
      services: [],
    };
  }

  componentDidMount () {
    this.props.queueActions.getQueueState (this.setWaitMins);
    this.props.settingsActions.getSettings ();

    const {newAppointment} = this.props.navigation.state.params;
    if (newAppointment) {
      const {client, provider, service} = newAppointment;

      const services = [
        {
          service,
          provider,
          isProviderRequested: false, //! provider.isFirstAvailable,
        },
      ];
      this.setState ({services}, () => this.setStateClientInfo (client));
    }

    const {navigation} = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams ({
      isValidInfo: this.validateFields,
      handleSave: this.handleSave,
      handleGoBack: this.handleGoBack,
    });
  }

  componentWillReceiveProps (nextProps) {
    const prevClientInfo = this.state.client;
    const newClientInfo = nextProps.clientInfoState.client;
    if (
      prevClientInfo &&
      newClientInfo &&
      get (prevClientInfo, 'id') === get (newClientInfo, 'id') &&
      !isEqual (prevClientInfo, newClientInfo)
    ) {
      this.setStateClientInfo (newClientInfo);
    }
  }

  setStateClientInfo = client => {
    const clientId = get (client, 'id', 1);
    if (clientId === 1) {
      this.setState ({
        client,
        email: '',
        phone: '',
        currentPhone: null,
      });
      return;
    }
    const email = get (client, 'email', '');
    const phones = get (client, 'phones', []);
    const currentPhone = phones.find (
      phone => get (phone, 'type', null) === ClientPhoneTypes.cell
    );
    const clientPhone = phones.find (
      item => get (item, 'type', null) === ClientPhoneTypes.cell
    );
    const phone = get (clientPhone, 'value', '');
    this.setState ({
      client,
      email,
      phone,
      currentPhone,
    });
  };

  setWaitMins = () => {
    const {guestWaitMins} = this.props.queue.queueState
      ? this.props.queue.queueState
      : {};
    let waitTime = '-';
    if (guestWaitMins > 0) {
      waitTime = `${guestWaitMins}`;
    } else if (guestWaitMins === 0) {
      waitTime = '0';
    }

    const {navigation} = this.props;
    navigation.setParams ({waitTime});
  };

  getFullName = () => {
    let fullName = '';
    const {client} = this.state;
    if (client) {
      if (client.name) {
        fullName = client.name;
      }
      if (client.lastName) {
        fullName = fullName
          ? `${fullName} ${client.lastName}`
          : client.lastName;
      }
    }
    return fullName;
  };

  handleSave = async () => {
    if (this.validateFields ()) {
      this.shouldUpdateClientInfo ();
      this.handleWalkin ();
    }
  };

  handleGoBack = () => {
    this.shouldUpdateClientInfo ();
    this.props.navigation.goBack ();
  };
  validateFields = () => {
    const {email, phone, currentPhone, services, client} = this.state;
    if (!client) {
      return false;
    }
    let canSave = client.id === 1;
    if (!canSave) {
      canSave =
        this.isValidEmailRegExp.test (email) ||
        (isNull (client.email) && (isNull (email) || email === ''));
      canSave =
        canSave &&
        (this.isValidPhoneRegExp.test (phone) ||
          (isUndefined (currentPhone.phone) &&
            (isNull (phone) || phone === '')));
    }
    for (let i = 0; i < services.length; i += 1) {
      const serviceBlock = services[i];
      canSave =
        canSave &&
        serviceBlock.service !== null &&
        serviceBlock.provider !== undefined;
    }
    this.shouldUpdateClientInfo ();
    return canSave;
  };

  saving = false;

  handleWalkin = async () => {
    if (!this.saving) {
      this.saving = true;
      const {services, client} = this.state;

      const servicesBlock = [];
      for (let i = 0; i < services.length; i += 1) {
        const serviceContainer = services[i];

        const providerBlock = serviceContainer.provider.isFirstAvailable
          ? {}
          : {providerId: serviceContainer.provider.id};

        servicesBlock.push ({
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

      this.props.walkInActions.postWalkinClient (params).then (() => {
        this.saving = false;
        const params = this.props.navigation.state.params || {};
        params.loadQueueData ();
        this.props.navigation.popToTop ({immediate: true});
      });
    }
  };

  handleUpdateClient = client => {
    this.setState ({client}, this.validateFields);
  };

  onChangeClient = client => {
    this.setState (
      {
        client,
      },
      this.validateFields
    );
  };

  renderExtraClientButtons = isDisabled => (
    <ClientInfoButton
      client={this.state.client}
      navigation={this.props.navigation}
      onDonePress={() => {}}
      apptBook={false}
      buttonStyle={{marginHorizontal: 5}}
      iconStyle={{fontSize: 20, color: '#115ECD'}}
    />
  );

  handleRemoveService = index => {
    const {services} = this.state;
    services.splice (index, 1);
    this.setState ({services}, this.validateFields);
  };

  handleUpdateService = (index, service) => {
    const {services} = this.state;
    services[index] = service;
    this.setState ({services}, this.validateFields);
  };

  shouldUpdateClientInfo = async () => {
    const {
      email,
      phone,
      isValidEmail: emailValid,
      isValidPhone: phoneValid,
      client,
    } = this.state;
    const currentPhone = client.phones.find (
      phone => phone.type === ClientPhoneTypes.cell
    );
    const hasEmailChanged = email !== client.email;
    const hasPhoneChanged = phone !== currentPhone.value;
    const isValidEmail = emailValid && email !== '' && hasEmailChanged;
    const isValidPhone = phoneValid && phone !== '' && hasPhoneChanged;
    if (!isValidEmail && !isValidPhone) {
      return false;
    }
    const phones = isValidPhone && hasPhoneChanged
      ? [
          {
            type: ClientPhoneTypes.cell,
            value: phone,
          },
          ...client.phones.filter (
            phone =>
              phone.value &&
              phone.type !== ClientPhoneTypes.cell &&
              this.isValidPhoneRegExp.test (phone.value)
          ),
        ]
      : client.phones.filter (
          phone => phone.value && this.isValidPhoneRegExp.test (phone.value)
        );
    const newEmail = isValidEmail ? email : client.email;
    const updateObject = {
      id: client.id,
      phones,
      confirmationType: 1,
    };
    if (email) {
      updateObject.email = newEmail;
    }

    const updated = await Client.putContactInformation (
      client.id,
      updateObject
    );
    return updated;
  };

  handleAddService = () => {
    const params = this.props.navigation.state.params || {};

    const {employee} = params;

    const service = {
      provider: employee,
      service: null,
      isProviderRequested: false,
    };

    const {services} = this.state;
    services.push (service);
    this.setState ({services}, this.validateFields);
  };

  isValidEmailRegExp = regexs.email;
  isValidPhoneRegExp = regexs.phone;

  renderEmailField = client => {
    const {email} = this.state;
    if (!client || get (client, 'id') === 1) {
      return <InputLabel style={styles.rootStyle} label="Email" value="" />;
    }
    return (
      <ValidatableInput
        keyboardType="email-address"
        validation={this.emailValidation}
        label="Email"
        isValid={
          this.isValidEmailRegExp.test (email) ||
            (isNull (client.email) && (isNull (email) || email === ''))
        }
        onValidated={this.onValidateEmail}
        value={email}
        onChangeText={this.onChangeEmail}
      />
    );
  };

  renderPhoneField = client => {
    const {phone, currentPhone} = this.state;
    if (!client || get (client, 'id') === 1) {
      return <InputLabel style={styles.rootStyle} label="Phone" value="" />;
    }
    return (
      <ValidatableInput
        label="Phone"
        mask="[000]-[000]-[0000]"
        isValid={
          this.isValidPhoneRegExp.test (phone) ||
            (isUndefined (currentPhone.phone) &&
              (isNull (phone) || phone === ''))
        }
        value={phone}
        validation={this.isValidPhoneRegExp}
        onValidated={this.onValidatePhone}
        onChangeText={this.onChangePhone}
      />
    );
  };

  onChangeEmail = email => {
    this.setState ({email}, () => {
      this.props.navigation.setParams ({
        isValidInfo: this.validateFields,
      });
    });
  };

  emailValidation = email => {
    if (email === '' || isNull (email)) {
      return true;
    }

    const result = this.isValidEmailRegExp.test (email);
    return result;
  };

  onChangePhone = phone => {
    this.setState ({phone}, () => {
      this.props.navigation.setParams ({
        isValidInfo: this.validateFields,
      });
    });
  };

  onValidateEmail = isValid =>
    this.setState (state => {
      const newState = state;
      newState.isValidEmail =
        isValid || (isNull (state.client.email) && state.email === '');

      return newState;
    }, this.shouldUpdateClientInfo);

  onValidatePhone = isValid =>
    this.setState (state => {
      const newState = state;
      newState.isValidPhone = newState.phone === '' ? true : isValid;
      return newState;
    }, this.shouldUpdateClientInfo);

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      navigation.goBack ();
    },
  });

  render () {
    const {client} = this.state;
    return (
      <ScrollView style={styles.container}>

        {this.props.walkInState.isLoading
          ? <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
          : <View style={styles.container}>
              <SectionTitle
                value="CLIENT"
                style={styles.sectionTitleRootStyle}
                sectionTitleStyle={styles.sectionTitleStyle}
              />
              <InputGroup style={styles.inputGroupStyle}>
                <ClientInput
                  walkin
                  style={styles.rootStyle}
                  navigate={this.props.navigation.navigate}
                  push={this.props.navigation.push}
                  label={this.state.client === null ? 'Client' : 'Client'}
                  headerProps={{
                    title: 'Clients',
                    leftButton: (
                      <Text style={{fontSize: 14, color: 'white'}}>Cancel</Text>
                    ),
                    leftButtonOnPress: navigation => {
                      navigation.goBack ();
                    },
                  }}
                  selectedClient={client}
                  onChange={this.onChangeClient}
                  extraComponents={
                    client !== null && this.renderExtraClientButtons ()
                  }
                />
                <InputDivider />
                {this.renderEmailField (client)}
                <InputDivider />
                {this.renderPhoneField (client)}
              </InputGroup>
              <SectionTitle
                value="SERVICE AND PROVIDER"
                style={styles.sectionTitleRootStyle}
                sectionTitleStyle={styles.sectionTitleStyle}
              />
              <ServiceSection
                services={this.state.services}
                onAdd={this.handleAddService}
                onRemove={this.handleRemoveService}
                onUpdate={this.handleUpdateService}
                cancelButton={this.cancelButton}
                navigate={this.props.navigation.navigate}
                push={this.props.navigation.push}
                walkin
              />
            </View>}
      </ScrollView>
    );
  }
}

WalkInScreen.defaultProps = {};

WalkInScreen.propTypes = {
  walkInActions: PropTypes.shape ({
    postWalkinClient: PropTypes.func.isRequired,
  }).isRequired,
  settingsActions: PropTypes.shape ({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
  queueActions: PropTypes.shape ({
    getQueueState: PropTypes.func.isRequired,
  }).isRequired,
  queue: PropTypes.any.isRequired,
};

export default WalkInScreen;
