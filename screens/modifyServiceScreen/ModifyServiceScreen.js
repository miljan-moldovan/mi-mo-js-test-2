import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  InputGroup,
  InputDivider,
  SectionTitle,
  InputSwitch,
  InputText,
  InputButton,
  LabeledButton,
} from '../../components/formHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
});

export default class ModifyServiceScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      whatever: true,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup>
          <InputButton
            placeholder="Service"
            value={null}
            onPress={() => alert('Muffins, dawg')}
          />
          <InputDivider />
          <LabeledButton
            label="Provider"
            value="Corrective Color"
            onPress={() => alert('Muffins, Brah')}
          />
          <InputDivider />
          <InputSwitch
            onChange={value => alert(`Switched to ${value}`)}
            text="Provider is requested?"
          />
        </InputGroup>
      </View>
    );
  }
}
