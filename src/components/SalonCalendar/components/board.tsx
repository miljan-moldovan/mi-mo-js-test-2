import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';

import Column from './Column';
import AvailabilityColumn from './availabilityColumn';
import { BoardProps } from '@/models';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default class Board extends React.Component<BoardProps, any> {
  shouldComponentUpdate(nextProps, nexState) {
    return nextProps.displayMode !== this.props.displayMode || (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading);
  }

  renderCol = (col, key) => {
    const {
      apptGridSettings,
      showRoomAssignments,
      cellWidth,
      selectedFilter,
      providerSchedule,
      selectedProvider,
      startTime,
      displayMode,
      startDate,
      createAlert,
      hideAlert,
      rooms,
      storeScheduleExceptions,
    } = this.props;
    const isDate = selectedFilter === 'providers' && selectedProvider !== 'all';
    return (
      <Column
        key={key}
        storeScheduleExceptions={storeScheduleExceptions}
        cellWidth={cellWidth}
        colData={col}
        isDate={isDate}
        startTime={startTime}
        selectedFilter={selectedFilter}
        providerSchedule={providerSchedule}
        apptGridSettings={apptGridSettings}
        rooms={rooms}
        onCellPressed={this.props.onCellPressed}
        showRoomAssignments={showRoomAssignments}
        displayMode={displayMode}
        startDate={startDate}
        createAlert={createAlert}
        hideAlert={hideAlert}
      />
    );
  };

  render() {
    const {
      columns,
      apptGridSettings,
      availability,
      showAvailability,
      startDate,
    } = this.props;
    return (
      <View style={styles.container}>
        {showAvailability
          ? <AvailabilityColumn
            apptGridSettings={apptGridSettings}
            onPress={this.props.onPressAvailability}
            availability={availability}
            startDate={startDate}
          />
          : null}
        {columns.map(this.renderCol)}
      </View>
    );
  }
}
