import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';

import Column from './column';
import AvailabilityColumn from './availabilityColumn';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default class Board extends Component {
  shouldComponentUpdate(nextProps, nexState) {
    return nextProps.displayMode !== this.props.displayMode || (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading);
  }

  renderCol = (col, key) => {
    const {
      apptGridSettings, rows, cellWidth, isDate, providerSchedule,
    } = this.props;
    return (
      <Column
        key={key}
        rows={rows}
        colData={col}
        cellWidth={cellWidth}
        isDate={isDate}
        providerSchedule={providerSchedule}
        onCellPressed={this.props.onCellPressed}
        apptGridSettings={apptGridSettings}
      />
    );
  }

  render() {
    const {
      columns, apptGridSettings, availability, showAvailability,
    } = this.props;
    return (
      <View style={styles.container}>
        { showAvailability ?
          <AvailabilityColumn
            apptGridSettings={apptGridSettings}
            providers={columns}
            availability={availability}
          /> : null
        }
        { columns.map(this.renderCol) }
      </View>
    );
  }
}
