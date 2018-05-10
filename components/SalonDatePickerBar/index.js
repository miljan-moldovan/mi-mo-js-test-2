import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import moment from 'moment';

import Icon from '../../components/UI/Icon';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  calendarContainer: {
    zIndex: 99999,
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 5,
  },
  angleContainer: {
    width: 45,
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
    fontSize: 12,
    color: '#115ECD',
    fontFamily: 'Roboto-bold',
  },
  todayContainer: {
    height: 40,
    width: 64,
    backgroundColor: '#F4F7FC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  //  marginRight: 15,
  },
  dateButton: {
    width: 160,
  },
});


export default class SalonDatePickerBar extends Component {
  constructor(props) {
    super(props);

    const startDate = this.getInitialDate();
    const selectedDate = moment(this.props.selectedDate);
    const { mode } = this.props;
    this.state = {
      startDate,
      selectedDate,
      mode,
    };
  }

  state = {
    mode: 'day',
  };

  getPrevious= () => {
    let previousDayStartDate = this.state.startDate.clone();
    previousDayStartDate = previousDayStartDate.subtract(1, this.state.mode);

    this.setState({ startDate: previousDayStartDate });

    let endDate = previousDayStartDate.clone();
    endDate = this.state.mode === 'week' ? endDate.add(6, 'day') : previousDayStartDate;

    this.props.onDateChange(previousDayStartDate, endDate);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ startDate: nextProps.selectedDate, mode: nextProps.mode });
  }

  getNext = () => {
    let nextDayStartDate = this.state.startDate.clone();
    nextDayStartDate = nextDayStartDate.add(1, this.state.mode);

    this.setState({ startDate: nextDayStartDate });
    let endDate = nextDayStartDate.clone();
    endDate = this.state.mode === 'week' ? endDate.add(6, 'day') : nextDayStartDate.clone();

    this.props.onDateChange(nextDayStartDate, endDate);
  }

    goToToday = () => {
      const today = moment();
      this.setState({ startDate: today });
      this.props.onDateChange(today, today);
    }

    getInitialDate = () => {
      if (this.props.startDate) {
        return moment(this.props.startDate);
      }
      if (this.props.date) {
        return moment(this.props.date);
      }
      return moment();
    }

    // getSelectedDate(date) {
    //   if (this.state.selectedDate.valueOf() === 0) {
    //     return;
    //   }
    //   return this.state.selectedDate;
    // }

    setSelectedDate(date) {
      const mDate = moment(date);
      this.props.onCalendarSelected(mDate);
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
          <SalonTouchableOpacity style={[styles.angleContainer, { justifyContent: 'flex-start', padding: 10, marginLeft: 8 }]} onPress={this.getPrevious}>
            <View>
              <Icon name="angleLeft" size={20} color="#727A8F" type="solid" />
            </View>
          </SalonTouchableOpacity>

          <View style={styles.calendarDates}>
            <SalonTouchableOpacity style={styles.todayContainer} onPress={this.goToToday}>
              <View>
                <Text style={styles.today}>
                Today
                </Text>
              </View>
            </SalonTouchableOpacity>

            <SalonTouchableOpacity style={styles.dateButton} onPress={this.props.onCalendarSelected}>
              <View style={styles.dateContainer}>
                {this.state.mode === 'week' && <Text style={styles.date} >
                  {`${moment(this.state.startDate).format('ddd MM/DD')} - ${moment(this.state.startDate).add(6, 'day').format('ddd MM/DD')}`}
                </Text>
                }

                {this.state.mode === 'day' && <Text style={styles.date} >
                  {moment(this.state.startDate).format('dddd, MMM. DD')}
                </Text>
                }
              </View>
            </SalonTouchableOpacity>

            <SalonTouchableOpacity style={styles.iconContainer} onPress={this.props.onCalendarSelected}>
              <View>
                <Icon name="calendar" size={20} color="#115ECD" type="regularFree" />
              </View>
            </SalonTouchableOpacity>
          </View>
          <SalonTouchableOpacity style={[styles.angleContainer, { justifyContent: 'flex-end', padding: 10, marginRight: 8 }]} onPress={this.getNext}>
            <View>
              <Icon name="angleRight" size={20} color="#727A8F" type="solid" />
            </View>
          </SalonTouchableOpacity>
        </View>
      </View>
    )
}
