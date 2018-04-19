import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 36,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#C0C1C6',
  },
  rowLabel: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  rowTitle: {
    position: 'absolute',
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
    top: -7.5,
  },
  rowTitleOClock: {
    position: 'absolute',
    fontFamily: 'Roboto',
    color: '#110A24',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
    top: -7.5,
    marginRight: 4,
  },
  line: {
    flex: 1,
    height: 4,
    backgroundColor: '#C0C1C6',
  },
});

export default class TimeColumn extends Component {
  renderRowLabel = (row, index) => {
    const timeSplit = row.split(':');
    const minutesSplit = timeSplit[1].split(' ');
    const minutes = minutesSplit[0];
    if (row && index !== 0 && minutes % 30 === 0) {
      const hour = timeSplit[0];
      const ampm = minutesSplit[1];
      const isOClock = minutes === '00';
      const text = isOClock ? `${hour}${ampm}` : `${hour}:${minutes}`;
      const style = isOClock ? styles.rowTitleOClock : styles.rowTitle;
      return (
        <View key={row.id} style={styles.rowLabel} pointerEvents="box-none">
          <Text style={style}>
            {text}
          </Text>
          <View />
        </View>
      );
    }
    return (
      <View key={row.id} style={styles.rowLabel} pointerEvents="box-none" />
    );
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        { this.props.schedule.map((row, index) => this.renderRowLabel(row, index)) }
      </View>
    );
  }
}
