import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import moment from 'moment';

import Icon from '../../components/UI/Icon';

const styles = StyleSheet.create({
  calendarContainer: {
    zIndex: 9999,
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

    const date = this.getInitialDate();
    const selectedDate = moment(this.props.selectedDate);

    this.state = {
      date,
      selectedDate,
    };
  }

  getPreviousDay= () => {
    const previousDayStartDate = this.state.date
      .subtract(1, 'day');

    this.setState({ date: previousDayStartDate });

    this.props.onDateChange(previousDayStartDate);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ date: nextProps.selectedDate });
  }

  getNextDay = () => {
    const nextDayStartDate = this.state.date.add(1, 'day');
    this.setState({ date: nextDayStartDate });
    this.props.onDateChange(nextDayStartDate);
  }

    goToToday = () => {
      this.setState({ date: moment() });
    }

    getInitialDate = () => {
      if (this.props.date) {
        return moment(this.props.date);
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
      this.onCalendarSelected(mDate);
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
              <Icon name="angleLeft" size={25} color="#727A8F" type="solid" />
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

            <TouchableOpacity style={styles.dateButton} onPress={this.props.onCalendarSelected}>
              <View style={styles.dateContainer}>
                <Text style={styles.date} >
                  {moment(this.state.date).format('dddd, MMM. DD')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer} onPress={this.props.onCalendarSelected}>
              <View>
                <Icon name="calendar" size={20} color="#115ECD" type="solid" />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.angleContainer, { justifyContent: 'flex-end', paddingRight: 27 }]} onPress={this.getNextDay}>
            <View>
              <Icon name="angleRight" size={25} color="#727A8F" type="solid" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
}
