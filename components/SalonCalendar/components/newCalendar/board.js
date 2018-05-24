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
      apptGridSettings,
      showRoomAssignments,
      rows,
      cellWidth,
      selectedFilter,
      providerSchedule,
      selectedProvider,
      startTime,
      displayMode,
    } = this.props;
    const isDate = selectedFilter === 'providers' && selectedProvider !== 'all';
    return (
      <Column
        key={key}
        rows={rows}
        cellWidth={cellWidth}
        colData={col}
        isDate={isDate}
        startTime={startTime}
        selectedFilter={selectedFilter}
        providerSchedule={providerSchedule}
        apptGridSettings={apptGridSettings}
        onCellPressed={this.props.onCellPressed}
        showRoomAssignments={showRoomAssignments}
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
            onPress={this.props.onPressAvailability}
            availability={availability}
          /> : null
        }
        { columns.map(this.renderCol) }
      </View>
    );
  }
}
