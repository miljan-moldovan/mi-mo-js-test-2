import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';

import {
  InputLabel,
  InputDivider,
  InputGroup,
} from '../../components/formHelpers';
import Icon from '../../components/UI/Icon';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: '#110A24',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default class EndsOnScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: <SalonHeader title="Ends On" />,
  });

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      selectedDate: null,
      selectedOcurrences: null,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <SalonTouchableOpacity
            onPress={() => this.setState({ selected: 'date' })}
          >
            <InputLabel
              label={<Text style={styles.label}>On a Date</Text>}
              value={this.state.selected === 'date' ? (
                <Icon name="checkCircle" type="solid" color="#1DBF12" />
              ) : (
                null
              )}
            />
          </SalonTouchableOpacity>
          {this.state.selected === 'date' && (
            <DatePicker
              mode="date"
              onDateChange={() => {}}
            />
          )}
          <InputDivider />
          <SalonTouchableOpacity
            onPress={() => this.setState({ selected: 'ocurrences' })}
          >
            <InputLabel
              label={<Text style={styles.label}>After a number of ocurrences</Text>}
              value={this.state.selected === 'ocurrences' ? (
                <Icon name="checkCircle" type="solid" color="#1DBF12" />
            ) : (
              null
            )}
            />
          </SalonTouchableOpacity>
        </InputGroup>
        {this.state.selected === 'ocurrences' && (
          <Picker
            style={{ flex: 1, maxHeight: 150 }}
            itemStyle={{ backgroundColor: 'white' }}
            selectedValue={1}
            pickerData={[1, 2, 3, 4, 5, 6]}
            onValueChange={(value) => {}}
          />
          )}

      </View>
    );
  }
}
