import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text
} from 'react-native';

import {
  InputLabel,
  InputButton,
  InputGroup,
  InputDivider,
  SectionTitle,
} from '../../../components/formHelpers';
import ServiceSection from './serviceSection';
import HeaderRight from '../../../components/HeaderRight';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerButton: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
});

class WalkInScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const handlePress = navigation.state.params && navigation.state.params.walkin ? navigation.state.params.walkin : ()=>{};
    //const { name, lastName } = navigation.state.params.item.client;
    return {
      // headerTitle: `${name} ${lastName}`,
      headerRight:
  <HeaderRight
    button={(
      <Text style={styles.headerButton}>Done</Text>
      )}
    handlePress={handlePress}
  />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      service: null,
      provider: null,
      client: null,
      isProviderRequested: false,
      isFirstAvailable: false,
    };
  }

  componentWillMount() {
    const { newAppointment } = this.props.navigation.state.params;
    if (newAppointment) {
      const { client, provider, service } = newAppointment;
      this.setState({ client, provider, service })
    }
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkin: () => {
        this.handleWalkin();
        debugger
        navigation.navigate('Main');
      },
    });
  }

  getFullName = () => {
    let fullName = '';
    const { client } = this.state
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

  handleWalkin = () => {
    const {
      service,
      provider,
      client,
      isProviderRequested,
      isFirstAvailable,
    } = this.state;
    const params = {
      clientId: client.id,
      email: client.email,
      phone: client.phone,
      isFirstAvailable,
      providerId: provider.id,
      isProviderRequested,
      serviceId: service.id,
    };
    this.props.walkInActions.postWalkinClient(params);
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

  handlePressClient = () => {
    this.props.navigation.navigate('Clients', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: this.handleClientSelection,
    });
  }

  render() {
    const fullName = this.getFullName();
    const email = this.state.client && this.state.client.email ? this.client.email : '';
    const phone = this.state.client && this.state.client.phone ? this.client.phone : '';
    return (
      <ScrollView style={styles.container}>
        <SectionTitle value="CLIENT" />
        <InputGroup>
          <InputButton label="Client" value={fullName} onPress={this.handlePressClient} />
          <InputDivider />
          <InputLabel label="Email" value={email} />
          <InputDivider />
          <InputLabel label="Phone" value={phone} />
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

export default WalkInScreen;
