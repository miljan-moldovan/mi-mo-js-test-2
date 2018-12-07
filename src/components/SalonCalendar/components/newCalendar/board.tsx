import * as React from 'react';
<<<<<<< HEAD:src/components/SalonCalendar/components/newCalendar/board.js
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
=======
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
>>>>>>> fa3b13f66e35da52e64b3e8e7f38f0f35bdacc71:src/components/SalonCalendar/components/newCalendar/board.tsx
import moment from 'moment';

import Column from './column';
import AvailabilityColumn from './availabilityColumn';
import { BoardProps } from '@/models';

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'row',
  },
});

<<<<<<< HEAD:src/components/SalonCalendar/components/newCalendar/board.js
export default class Board extends React.Component {
  shouldComponentUpdate (nextProps, nexState) {
    return (
      nextProps.displayMode !== this.props.displayMode ||
      (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading)
    );
=======
export default class Board extends React.Component<BoardProps, any> {
  shouldComponentUpdate(nextProps, nexState) {
    return nextProps.displayMode !== this.props.displayMode || (!nextProps.isLoading && nextProps.isLoading !== this.props.isLoading);
>>>>>>> fa3b13f66e35da52e64b3e8e7f38f0f35bdacc71:src/components/SalonCalendar/components/newCalendar/board.tsx
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

  render () {
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
        {columns.map (this.renderCol)}
      </View>
    );
  }
}
