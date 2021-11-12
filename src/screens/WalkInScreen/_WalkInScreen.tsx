import * as React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { get, isEqual, isNull, isUndefined } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import ClientInfoButton from '../../components/ClientInfoButton';
import regexs from '../../constants/Regexs';
import ClientPhoneTypes from '../../constants/ClientPhoneTypes';

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
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';
import {
  WalkInClient,
  WalkInProvider,
  WalkInService,
  ServiceItem,
  WalkInActions,
} from '../../models/WalkIn';
import { SettingsActions } from '../../models/Settings';
import Icon from '@/components/common/Icon';
import Colors from '../../constants/Colors';
import LoadingOverlay from '../../components/LoadingOverlay';
import { Client } from '@/models/Client';
import { InfoClient } from '@/models';

export interface NavigationParams {
  handleSave: () => void;
  canSave: boolean;
  waitTime: number;
  newAppointment?: ApptFromParams;
}

export interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  walkInActions: WalkInActions;
  settingsActions: SettingsActions,
  queueActions: any;
  queue: any;
}

export interface State {
  client?: Client | null;
  email: string | null;
  phone: string | null;
  isValidEmail: boolean;
  isValidPhone: boolean;
  currentPhone: any;
  services: ServiceItem[];
}

export interface ApptFromParams {
  client: WalkInClient,
  provider: WalkInProvider,
  service: WalkInService,
}

class WalkInScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const handleSave = navigation.getParam('handleSave', () => { });
    const waitTime = navigation.getParam('waitTime', 0);
    const canSave = navigation.getParam('canSave', false);
    const doneButtonStyle = [
      styles.rightButtonText,
      { color: canSave ? Colors.white : Colors.doneButtonDisabled },
    ];
    return {
      header: (
        <SalonHeader
          title="Walk-in"
          subTitle={`${waitTime}m Est. wait`}
          headerLeft={
            <SalonTouchableOpacity style={styles.headerLeft} onPress={navigation.goBack}>
              <Icon name="angleLeft" style={styles.headerLeftIcon} size={24} color={Colors.white} />
              <Text style={styles.leftButtonText}>Back</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity disabled={!canSave} style={styles.headerRight} onPress={handleSave}>
              <Text style={doneButtonStyle}>Done</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      client: null,
      email: '',
      phone: null,
      isValidEmail: true,
      isValidPhone: true,
      currentPhone: '',
      services: [],
    };
  }

  componentDidMount() {
    const {
      settingsActions: { getSettings },
      queueActions: { getQueueState },
      navigation: { getParam, setParams },
    } = this.props;
    getSettings();
    getQueueState(this.setWaitMins);
    const newAppointment = getParam('newAppointment', null);
    if (newAppointment) {
      const { client, provider, service } = newAppointment;
      const services = [
        {
          service,
          provider,
          isProviderRequested: false,
        },
      ];
      this.setState({ services }, () => this.setStateClientInfo(client));
    }
    setParams({
      canSave: this.validateFields(),
      handleSave: this.handleSave,
    });
  }

  componentWillReceiveProps(nextProps) {
    const prevClientInfo = this.state.client;
    const newClientInfo = nextProps.clientInfoState.client;
    if (
      prevClientInfo &&
      prevClientInfo.id === newClientInfo.id &&
      !isEqual(prevClientInfo, newClientInfo)
    ) {
      this.setStateClientInfo(newClientInfo);
    }
  }

  setStateClientInfo = client => {
    const email = client && client.id === 1 ? '' : get(client, 'email', '');
    const currentPhone = client && client.phones ? client.phones.find(
      phone => phone.type === ClientPhoneTypes.cell
    ) : { type: ClientPhoneTypes.cell, value: '' };
    const phones = get(client, 'phones', []);
    const clientPhone = phones.find(
      item => get(item, 'type', null) === ClientPhoneTypes.cell
    );
    const phone = get(clientPhone, 'value', '');

    this.setState({
      client,
      email,
      phone,
      currentPhone: get(currentPhone, 'value', ''),
    });
  };

  setWaitMins = () => {
    const { guestWaitMins } = this.props.queue.queueState
      ? this.props.queue.queueState
      : {};
    let waitTime = '-';
    if (guestWaitMins > 0) {
      waitTime = `${guestWaitMins}`;
    } else if (guestWaitMins === 0) {
      waitTime = '0';
    }

    const { navigation } = this.props;
    navigation.setParams({ waitTime });
  };

  getFullName = () => {
    let fullName = '';
    const { client } = this.state;
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
    if (this.validateFields()) {
      this.shouldUpdateClientInfo();
      this.handleWalkin();
    }
  };

  validateFields = () => {
    const { email, phone, currentPhone, services, client } = this.state;
    let canSave = client && client.id === 1;
    if (!canSave) {
      canSave =
        this.isValidEmailRegExp.test(email) ||
        (isNull(get(client, 'email', null)) && (isNull(email) || email === ''));
      canSave =
        canSave &&
        (this.isValidPhoneRegExp.test(phone) ||
          (isUndefined(currentPhone.phone) &&
            (isNull(phone) || phone === '')));
    }
    for (let i = 0; i < services.length; i += 1) {
      const serviceBlock = services[i];
      canSave =
        canSave &&
        serviceBlock.service !== null &&
        serviceBlock.provider !== undefined;
    }

    return canSave;
  };

  saving = false;

  handleWalkin = async () => {
    if (!this.saving) {
      this.saving = true;
      const { services, client } = this.state;

      const servicesBlock = [];
      for (let i = 0; i < services.length; i += 1) {
        const serviceContainer = services[i];

        const providerBlock = serviceContainer.provider.isFirstAvailable
          ? {}
          : { providerId: serviceContainer.provider.id };

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
        this.props.navigation.popToTop({ immediate: true });
      });
    }
  };

  handleUpdateClient = client => {
    this.setState({ client }, this.validateFields);
  };

  onChangeClient = client => {
    this.setState(
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
      onDonePress={() => { }}
      apptBook={false}
      buttonStyle={{ marginHorizontal: 5 }}
      iconStyle={{ fontSize: 20, color: '#115ECD' }}
    />
  );

  handleRemoveService = index => {
    const { services } = this.state;
    services.splice(index, 1);
    this.setState({ services }, this.validateFields);
  };

  handleUpdateService = (index, service) => {
    const { services } = this.state;
    services[index] = service;
    this.setState({ services }, this.validateFields);
  };

  shouldUpdateClientInfo = async () => {
    const {
      email,
      phone,
      isValidEmail: emailValid,
      isValidPhone: phoneValid,
      client,
    } = this.state;
    if (!client) {
      return;
    }
    const currentPhone = client.phones.find(
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
        ...client.phones.filter(
          phone =>
            phone.value &&
            phone.type !== ClientPhoneTypes.cell &&
            this.isValidPhoneRegExp.test(phone.value)
        ),
      ]
      : client.phones.filter(
        phone => phone.value && this.isValidPhoneRegExp.test(phone.value)
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

    const updated = await Client.putContactInformation(
      client.id,
      updateObject
    );
    return updated;
  };

  handleAddService = () => {
    const params = this.props.navigation.state.params || {};

    const { employee } = params;

    const service = {
      provider: employee,
      service: null,
      isProviderRequested: false,
    };

    const { services } = this.state;
    services.push(service);
    this.setState({ services }, this.validateFields);
  };

  isValidEmailRegExp = regexs.email;
  isValidPhoneRegExp = regexs.phone;

  renderEmailField = client => {
    const { email } = this.state;
    if (!client || get(client, 'id', null) === 1) {
      return <InputLabel style={styles.rootStyle} label="Email" value="" />;
    }
    return (
      <ValidatableInput
        keyboardType="email-address"
        validation={this.emailValidation}
        label="Email"
        isValid={
          this.isValidEmailRegExp.test(email) ||
          (isNull(client.email) && (isNull(email) || email === ''))
        }
        onValidated={this.onValidateEmail}
        value={email}
        onChangeText={this.onChangeEmail}
      />
    );
  };

  renderPhoneField = client => {
    const { phone, currentPhone } = this.state;
    if (!client || get(client, 'id', null) === 1) {
      return <InputLabel style={styles.rootStyle} label="Phone" value="" />;
    }
    return (
      <ValidatableInput
        label="Phone"
        mask="[000]-[000]-[0000]"
        isValid={
          this.isValidPhoneRegExp.test(phone) ||
          (isUndefined(currentPhone.phone) &&
            (isNull(phone) || phone === ''))
        }
        value={phone}
        validation={this.isValidPhoneRegExp}
        onValidated={this.onValidatePhone}
        onChangeText={this.onChangePhone}
      />
    );
  };

  onChangeEmail = email => {
    this.setState({ email }, () => {
      this.props.navigation.setParams({
        isValidInfo: this.validateFields,
      });
    });
  };

  emailValidation = email => {
    if (email === '' || isNull(email)) {
      return true;
    }
    const result = this.isValidEmailRegExp.test(email);
    return result;
  };

  onChangePhone = phone => {
    this.setState({ phone }, () => {
      this.props.navigation.setParams({
        isValidInfo: this.validateFields,
      });
    });
  };

  onValidateEmail = isValid =>
    this.setState(state => {
      const newState = state;
      newState.isValidEmail =
        isValid || (isNull(state.client.email) && state.email === '');

      return newState;
    });

  onValidatePhone = isValid =>
    this.setState(state => {
      const newState = state;
      newState.isValidPhone = newState.phone === '' ? true : isValid;
      return newState;
    });

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      navigation.goBack();
    },
  });

  render() {
    const { client } = this.state;
    return (
      <ScrollView style={styles.container}>

        {
          this.props.walkInState.isLoading
            ? <LoadingOverlay />
            : (
              <View style={styles.container}>
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
                        <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>
                      ),
                      leftButtonOnPress: navigation => {
                        navigation.goBack();
                      },
                    }}
                    selectedClient={client}
                    onChange={this.onChangeClient}
                    extraComponents={
                      client !== null && this.renderExtraClientButtons()
                    }
                  />
                  <InputDivider />
                  {this.renderEmailField(client)}
                  <InputDivider />
                  {this.renderPhoneField(client)}
                </InputGroup>
                <SectionTitle
                  value="SERVICE AND PROVIDER"
                  style={styles.sectionTitleRootStyle}
                  sectionTitleStyle={styles.sectionTitleStyle}
                />
                <ServiceSection
                  walkin
                  services={this.state.services}
                  onAdd={this.handleAddService}
                  onRemove={this.handleRemoveService}
                  onUpdate={this.handleUpdateService}
                  cancelButton={this.cancelButton}
                  navigate={this.props.navigation.navigate}
                  push={this.props.navigation.push}
                />
              </View>
            )
        }
      </ScrollView>
    );
  }
}

WalkInScreen.defaultProps = {};

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
