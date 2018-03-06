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
import ServiceSection from '../../../components/formHelpers/serviceSection';


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
    };
  }

  handleAddService= () => {
    const service = {
      provider: null,
      service: null,
      start: moment(),
      end: moment().add(1, 'hours'),
    };
    const { services } = this.state;
    services.push(service);
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
    return (
      <ScrollView style={styles.container}>
        <SectionTitle value="CLIENT" />
        <InputGroup>
          <InputButton label="Client" value="Alex" />
          <InputDivider />
          <InputLabel label="Email" value="a@a.com" />
          <InputDivider />
          <InputLabel label="Phone" value="222222" />
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
