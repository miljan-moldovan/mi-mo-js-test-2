import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import {
  InputLabel,
  InputButton,
  InputGroup,
  InputDivider,
  SectionTitle,
} from '../../../components/formHelpers';
import ServiceSection from './serviceSection';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

class WalkInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      client: null,
    };
  }

  componentWillMount() {
    const { newAppointment } = this.props.navigation.state.params;
    //debugger
    if (newAppointment) {
      this.handleAddService(_, newAppointment.provider, newAppointment.service);
      this.setState({ client: newAppointment.client })
    }
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

  handleAddService= (_, provider = null, service = null) => {
    const newService = {
      provider,
      service,
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
