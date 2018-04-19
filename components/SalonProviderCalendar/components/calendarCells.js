import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { times } from 'lodash';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    height: 40,
    width: 45,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerCellDisabled: {
    height: 40,
    width: 45,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ccc',
  },
});

class CalendarCells extends Component {
  shouldComponentUpdate() {
    return false;
  }

  renderCell = (providerScheudle, hour, key) => {
    const time = moment(this.props.apptGridSettings.startTime, 'HH:mm').add(hour * 30, 'm');
    const style = providerScheudle && providerScheudle.scheduledIntervals
    && providerScheudle.scheduledIntervals.length > 0
    && time.isSameOrAfter(moment(providerScheudle.scheduledIntervals[0].start, 'HH:mm'))
    && time.isSameOrBefore(moment(providerScheudle.scheduledIntervals[0].end, 'HH:mm')) ? styles.headerCell : styles.headerCellDisabled;
    return (
      <View style={style} key={key} />
    );
  }

  renderColumn = hour => (
    <View style={styles.row} key={hour}>
      {this.props.dates.map(date =>
        this.renderCell(this.props.dataSource[moment(date).format('YYYY-MM-DD')], hour, Math.random()))}
    </View>
  );

  render() {
    const { apptGridSettings } = this.props;

    return (
      <View>
        {times(apptGridSettings.numOfRow, index => this.renderColumn(index))}
      </View>
    );
  }
}

export default CalendarCells;
