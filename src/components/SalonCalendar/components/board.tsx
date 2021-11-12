import * as React from 'react';
import { View, StyleSheet } from 'react-native';

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
    return nextProps.displayMode !== this.props.displayMode ||
      (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading);
  }

  renderCol = (col, key) => {
    const {
      apptGridSettings,
      showRoomAssignments,
      showAssistantAssignments,
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
      step,
      storeScheduleExceptions,
    } = this.props;
    const isDate = selectedFilter === 'providers' && selectedProvider !== 'all';
    return (
      <Column
        key={key}
        storeScheduleExceptions={storeScheduleExceptions}
        cellWidth={cellWidth}
        colData={col}
        step={step}
        isDate={isDate}
        startTime={startTime}
        selectedFilter={selectedFilter}
        providerSchedule={providerSchedule}
        apptGridSettings={apptGridSettings}
        rooms={rooms}
        onCellPressed={this.props.onCellPressed}
        showRoomAssignments={showRoomAssignments}
        showAssistantAssignments={showAssistantAssignments}
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
      hideAlert,
      createAlert,
      startDate,
    } = this.props;
    return (
      <View style={styles.container}>
        {showAvailability
          ? <AvailabilityColumn
            apptGridSettings={apptGridSettings}
            createAlert={createAlert}
            hideAlert={hideAlert}
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
