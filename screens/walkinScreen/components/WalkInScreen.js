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
      services: [],
      client: null,
    };
  }

  componentWillMount() {
    const { newAppointment } = this.props.navigation.state.params;
    if (newAppointment) {
      this.handleAddService(_, newAppointment.provider, newAppointment.service, false, true);
      this.setState({ client: newAppointment.client })
    }
    const { navigation } = this.props;
    // We can only set the function after the component has been initialized
    navigation.setParams({
      walkin: () => {
        this.handleWalkin();
        navigation.navigate('Queue');
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
    const { services, client } = this.state;
    const service = services[0];
    const params = {
      clientId: client.id,
      email: client.email,
      phone: client.phone,
      isFirstAvailable: service.isFirstAvailable,
      providerId: service.provider.id,
      isProviderRequested: service.isProviderRequested,
    };
    this.props.walkInActions.postWalkinClient(params);
  }

  handleAddService= (_, provider = null, service = null, isFirstAvailable = false, isProviderRequested = false) => {
    const newService = {
      provider,
      service,
      isFirstAvailable,
      isProviderRequested,
    };
    const { services } = this.state;
    services.push(newService);
    this.setState({ services });
  }

  handleRemoveService= (index) => {
    const { services } = this.state;
    services.splice(index, 1);
    this.setState({ services });
  }

  handleUpdateService= (index, service) => {
    const { services } = this.state;
    services[index] = service;
    this.setState({ services });
  }

  render() {
    const fullName = this.getFullName();
    const email = this.state.client && this.state.client.email ? this.client.email : '';
    const phone = this.state.client && this.state.client.phone ? this.client.phone : '';
    return (
      <ScrollView style={styles.container}>
        <SectionTitle value="CLIENT" />
        <InputGroup>
          <InputButton label="Client" value={fullName} />
          <InputDivider />
          <InputLabel label="Email" value={email} />
          <InputDivider />
          <InputLabel label="Phone" value={phone} />
        </InputGroup>
        <SectionTitle value="SERVICE AND PROVIDER" />
        <ServiceSection
          services={this.state.services}
          onAdd={this.handleAddService}
          navigate={this.props.navigation.navigate}
          onRemove={this.handleRemoveService}
          onUpdate={this.handleUpdateService}
        />
      </ScrollView>
    );
  }
}

export default WalkInScreen;
