import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  InputGroup,
  SectionTitle,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  InputSwitch,
  InputLabel,
  InputNumber,
  InputButton,
  InputDivider,
  RemoveButton,
} from '../../components/formHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
});

export default class ModifyApptServiceScreen extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      selectedClient: null,
      selectedProvider: null,
      selectedService: null,
      isRequested: false,
      startTime: null,
      endTime: null,
      length: null,
      gap: null,
      gapTime: 0,
      afterGap: 0,
      assignedRoom: null,
      assignedResource: null,
    };
  }

  onPressRemove = () => alert('Not Implemented');

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            navigate={this.props.navigation.navigate}
            selectedService={this.state.selectedService}
            onChange={selectedService => console.log(selectedService)}// this.setState({ selectedService })}
          />
          <InputDivider />
          <ProviderInput
            navigate={this.props.navigation.navigate}
            selectedProvider={this.state.selectedProvider}
            onChange={selectedProvider => this.setState({ selectedProvider })}
          />
          <InputDivider />
          <InputSwitch
            text="Provider is requested"
            value={this.state.isRequested}
            onChange={isRequested => this.setState({ isRequested })}
          />
          <InputDivider />
          <InputLabel
            label="Price"
            value={this.state.selectedService === null ? '' : `$${this.state.selectedService.price}`}
          />
        </InputGroup>
        <SectionTitle value="Time" />
        <InputGroup>
          <InputLabel
            label="Starts"
            value="11:00 am"
          />
          <InputDivider />
          <InputLabel
            label="Ends"
            value="12:00 pm"
          />
          <InputDivider />
          <InputLabel
            label="Length"
            value="60 min"
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={this.state.gap}
            onChange={gap => this.setState({ gap })}
          />
          <InputDivider />
          <InputNumber
            value={this.state.gapTime}
            onChange={(action, gapTime) => this.setState({ gapTime })}
            label="Gap Time"
            singularText="min"
            pluralText="min"
          />
          <InputDivider />
          <InputNumber
            value={this.state.afterGap}
            onChange={(action, afterGap) => this.setState({ afterGap })}
            label="After"
            singularText="min"
            pluralText="min"
          />
        </InputGroup>
        <SectionTitle value="Room & Resource" />
        <InputGroup>
          <InputButton
            onPress={() => alert('Not Implemented')}
            label="Assigned Room"
            value="None"
          />
          <InputDivider />
          <InputButton
            onPress={() => alert('Not Implemented')}
            label="Assigned Resource"
            value="None"
          />
        </InputGroup>
        <SectionDivider />
        <RemoveButton title="Remove Service" onPress={this.onPressRemove} />
        <SectionDivider />
      </ScrollView>
    );
  }
}
