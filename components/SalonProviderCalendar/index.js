import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import SalonWeekCalendar from '../SalonWeekCalendar';
import SalonDayCalendar from '../SalonDayCalendar';

export default class SalonProviderCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      dates,
      appointments,
      selectedProvider,
      apptGridSettings,
      displayMode,
      dataSource,
      onDrop,
    } = this.props;

    return displayMode === 'day' ? (
      <SalonDayCalendar
        {...this.props}
      />
    ) : (
      <SalonWeekCalendar
        {...this.props}
      />
    );
  }
}
