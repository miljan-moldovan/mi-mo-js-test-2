import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import moment, { isMoment } from 'moment';
import { isNull } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonCard from '../../components/SalonCard';
import { AppointmentTime } from '../../components/slidePanels/SalonNewAppointmentSlide';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  dateInfoContainer: {
    height: 65,
    alignSelf: 'stretch',
    backgroundColor: '#e2e9f1',
    borderBottomWidth: 1,
    borderBottomColor: '#c5c6ca',
  },
  borderContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ebf1fa',
    paddingHorizontal: 17,
  },
  dateText: {
    color: '#000000',
    fontSize: 17,
    lineHeight: 30,
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'transparent',
  },
  subtitleText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#727A8F',
    marginTop: 9,
    marginBottom: 6,
    paddingLeft: 17,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  conflictCardContainer: {
    // height: 64,
    flexDirection: 'row',
    flex: 1,
  },
  conflictTypeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  conflictTypeText: {
    fontSize: 9,
    color: '#727A8F',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  conflictDurationText: {
    fontSize: 11,
    lineHeight: 22,
    color: '#727A8F',
    textAlign: 'right',
  },
  conflictInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  conflictReasonText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'black',
    fontFamily: 'Roboto-Medium',
    textAlign: 'left',
  },
  conflictServiceText: {
    fontSize: 10,
    lineHeight: 11,
    color: '#0C4699',
    textAlign: 'left',
  },

});

const conflicts = [
  {
    date: '2018-05-31T00:00:00',
    employeeFullName: 'Tess Cibotti',
    serviceDescription: '45 Minutes',
    fromTime: '10:15:00',
    toTime: '11:00:00',
    duration: 2700,
    price: 42,
    overlap: '00:45:00',
    reason: 'Overlap',
    bookAnyway: false,
    canBeSkipped: true,
  },
  {
    date: '2018-05-31T00:00:00',
    employeeFullName: 'Tess Cibotti',
    serviceDescription: '15 Minutes',
    fromTime: '11:45:00',
    toTime: '12:15:00',
    duration: 1800,
    price: 20,
    overlap: '00:15:00',
    reason: 'Overlap',
    bookAnyway: false,
    canBeSkipped: true,
  },
];

export default class ConflictsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Conflicts',
    headerLeft: null,
    headerRight: (
      <SalonTouchableOpacity onPress={() => {
        if (navigation.state.params.handleGoBack) {
          navigation.state.params.handleGoBack();
        }
        navigation.goBack();
      }}
      >
        <Text style={{ fontSize: 14, color: 'white' }}>
          Done
        </Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ handleDone: this.handleDone });
    this.state = {
      date: params.date,
      startTime: params.startTime,
      endTime: params.endTime,
      conflicts: params.conflicts,
    };
  }

  handleDone = () => {
    this.props.navigation.state.params.handleGoBack();
  }

  renderSeparator = () => (
    <View style={{ height: 9 }} />
  )

  renderItem = ({ item: conflict, index }) => (
    <View key={index}>
      <SalonCard
        key={index}
        backgroundColor="white"
        // containerStyles={{
        //   marginVertical: 0,
        // }}

        bodyChildren={(
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.conflictCardContainer}>
              <View style={styles.conflictInfoContainer}>
                {!isNull(conflict.fromTime) && !isNull(conflict.toTime) && (
                  <AppointmentTime
                    startTime={conflict.fromTime}
                    endTime={conflict.toTime}
                  />
                )}
                <Text style={styles.conflictReasonText}>{conflict.reason}</Text>
                <View style={{ flexDirection: 'row' }}>
                  { !isNull(conflict.serviceDescription) &&
                    <Text style={styles.conflictServiceText}>{`${conflict.serviceDescription} ${conflict.employeeFullName ? 'with ' : ''}`}</Text>
                  }
                  {!isNull(conflict.employeeFullName) &&
                    <Text style={[styles.conflictServiceText, { fontFamily: 'Roboto-Medium' }]}>{conflict.employeeFullName}</Text>
                  }
                </View>
              </View>
              {!isNull(conflict.overlap) && (
                <View style={styles.conflictTypeContainer}>
                  <Text style={styles.conflictTypeText}>OVERLAP</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.conflictDurationText, { fontSize: 14 }]}>{moment.duration(conflict.overlap).asMinutes()}</Text>
                    <Text style={styles.conflictDurationText}> min</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.dateInfoContainer}>
            <View style={styles.borderContainer}>
              <Text style={styles.dateText}>
                {moment(this.state.date).format('ddd, MMM D')}
              </Text>
              <View style={{ alignItems: 'flex-start' }}>
                <AppointmentTime
                  startTime={this.state.startTime}
                  endTime={this.state.endTime}
                />
              </View>
            </View>
          </View>
          <View style={{ alignSelf: 'stretch' }}>
            <Text style={styles.subtitleText}>The following conflicts were found</Text>
          </View>
        </View>
        <FlatList
          data={this.state.conflicts}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
