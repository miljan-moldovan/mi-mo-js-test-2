import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerCellDisabled: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ccc',
  },
});

class CalendarCells extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  renderCell = (providerScheudle, hour, key) => {
    const time = moment(this.props.startTime, 'HH:mm').add(hour * 15, 'm');
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
      {this.props.providers.map(provider =>
        this.renderCell(this.props.dataSource[provider.id], hour, provider.id))}
    </View>
  );

  render() {
    const { hours } = this.props;
    return (
      <View>
        {hours.map(hour => this.renderColumn(hour))}
      </View>
    );
  }
}

export default CalendarCells;
