import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';

import {
  InputLabel,
  InputDivider,
  InputGroup,
  InputButton,
} from '../../components/formHelpers';
import Icon from '@/components/common/Icon';
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

export default class RepeatsOnScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: <SalonHeader title="Repeats On" />,
  });

  constructor(props) {
    super(props);

    const dayOfWeek = this.props.newAppointmentState.body.date.format('dddd');
    const { recurringType } = this.props.newAppointmentState;
    this.state = {
      recurringType,
      selectedValue: null,
      weekOcurrences: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      monthOcurrences: [
        'On the same day each month',
        `On every fourth ${dayOfWeek}`,
        `On every last ${dayOfWeek}`,
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          {this.state.recurringType === 'Weeks' ?
            this.state.weekOcurrences.map(item =>
              ([
                <InputButton
                  icon={false}
                  value={<Text style={{ flex: 1 }}>{item}</Text>}
                  onPress={() => this.setState({ selectedValue: item })}
                />,
                <InputDivider />,
            ])) :
            this.state.monthOcurrences.map(item =>
              ([
                <InputButton
                  icon={false}
                  value={<Text style={{ flex: 1 }}>{item}</Text>}
                  onPress={() => this.setState({ selectedValue: item })}
                />,
                <InputDivider />,
            ]))
          }
        </InputGroup>
      </View>
    );
  }
}
