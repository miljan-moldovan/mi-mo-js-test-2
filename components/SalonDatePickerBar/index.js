import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import moment from 'moment';

import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = StyleSheet.create({
  calendarContainer: {
    overflow: 'hidden',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datesStrip: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  calendarDates: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  angleContainer: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  date: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#110A24',
    fontFamily: 'Roboto',
  },
  calendarIconStyle: {
    fontSize: 20,
    color: '#115ECD',
  },
  iconStyle: {
    fontSize: 25,
    color: '#727A8F',
  },
  today: {
    fontSize: 14,
    color: '#115ECD',
    fontFamily: 'Roboto-bold',
  },
  todayContainer: {
    height: 45,
    width: 68,
    backgroundColor: '#F4F7FC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButton: {
    width: 150,
  },
});


export default class SalonDatePickerBar extends Component {
  constructor(props) {
    super(props);

    const startingDate = this.getInitialStartingDate();
    const selectedDate = moment(this.props.selectedDate);

    this.state = {
      startingDate,
      selectedDate,
    };
  }

  getPreviousDay= () => {
    const previousDayStartDate = this.state.startingDate
      .subtract(1, 'day');

    this.setState({ startingDate: previousDayStartDate });
  }

  getNextDay = () => {
    const nextDayStartDate = this.state.startingDate.add(1, 'day');
    this.setState({ startingDate: nextDayStartDate });
  }

    goToToday = () => {
      this.setState({ startingDate: moment() });
    }

    getInitialStartingDate = () => {
      if (this.props.startingDate) {
        return moment(this.props.startingDate);
      }
      return moment();
    }

    getSelectedDate(date) {
      if (this.state.selectedDate.valueOf() === 0) {
        return;
      }
      return this.state.selectedDate;
    }

    setSelectedDate(date) {
      const mDate = moment(date);
      this.onDateSelected(mDate);
    }

    render= () => (
      <View
        style={[
          styles.calendarContainer,
          { backgroundColor: this.props.calendarColor },
          this.props.style,
        ]}
      >
        <View style={styles.datesStrip}>
          <TouchableOpacity style={[styles.angleContainer, { justifyContent: 'flex-start', paddingLeft: 27 }]} onPress={this.getPreviousDay}>
            <View>
              <FontAwesome style={styles.iconStyle}>{Icons.angleLeft}</FontAwesome>
            </View>
          </TouchableOpacity>

          <View style={styles.calendarDates}>
            <TouchableOpacity style={styles.todayContainer} onPress={this.goToToday}>
              <View>
                <Text style={styles.today}>
                Today
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateButton} onPress={this.props.onDateSelected}>
              <View style={styles.dateContainer}>
                <Text style={styles.date} >
                  {moment(this.state.startingDate).format('dddd, MMM. YYYY')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer} onPress={this.props.onDateSelected}>
              <View>
                <FontAwesome style={styles.calendarIconStyle}>{Icons.calendar}</FontAwesome>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.angleContainer, { justifyContent: 'flex-end', paddingRight: 27 }]} onPress={this.getNextDay}>
            <View>
              <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
}
