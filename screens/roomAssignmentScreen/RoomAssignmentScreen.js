import React from 'react';
import {
  View,
  Text,
  Picker,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { times } from 'lodash';
import moment, { isMoment } from 'moment';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputButton,
  InputDivider,
  InputGroup,
  SectionTitle,
} from '../../components/formHelpers';
import Icon from '../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class RoomAssignmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const date = params.date || moment();
    const canSave = params.canSave || false;
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    return {
      headerTitle: (
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 17,
            lineHeight: 22,
            color: 'white',
          }}
          >
            Room Assignment
          </Text>
          <Text style={{
            fontFamily: 'Roboto',
            fontSize: 10,
            lineHeight: 12,
            color: 'white',
          }}
          >
            {`${employee.name} ${employee.lastName[0]}. - ${moment(date).format('MMM D YYYY')}`}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 14, lineHeight: 22, color: 'white' }}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          onPress={() => params.handleSave()}
          disabled={!canSave}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: canSave ? 'white' : 'rgba(0,0,0,0.3)',
          }}
          >Done
          </Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);

    const assignments = times(4, () => ({
      selectedRoom: null,
      startTime: null,
      endTime: null,
    }));

    this.options = [
      { key: 0, value: 'Just Me' },
      { key: 1, value: 'Me + 1 Guest' },
      { key: 2, value: 'Me + 2 Guests' },
    ];
    this.state = { assignments };
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  componentDidMount() {
    this.props.roomAssignmentActions.getRooms();
  }

  handleSave = () => {
    alert('stuff');
  }

  renderRoomData = () => this.state.assignments.map((assignment, index) => (
    <InputGroup style={{ marginBottom: 16 }}>
      <InputButton
        label="Room"
        value={assignment.room ? assignment.room.name : 'None'}
      />
      <InputDivider />
      <InputButton
        noIcon
        label="Start"
        value={isMoment(assignment.startTime) ? assignment.startTime : 'Off'}
      />
      <InputDivider />
      <InputButton
        noIcon
        label="End"
        value={isMoment(assignment.endTime) ? assignment.endTime : '-'}
      />
    </InputGroup>
  ))

  render() {
    const {
      isLoading,
    } = this.props.roomAssignmentState;

    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            paddingBottom: 60,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#cccccc',
            opacity: 0.3,
            zIndex: 999,
            elevation: 2,
          }}
          ><ActivityIndicator />
          </View>
        )}
        <ScrollView>
          <SectionTitle
            value="ASSIGNED TO ROOM"
          />
          {this.renderRoomData()}
        </ScrollView>
      </View>
    );
  }
}
