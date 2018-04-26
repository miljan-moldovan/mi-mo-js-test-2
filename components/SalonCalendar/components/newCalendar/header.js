import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import SalonAvatar from '../../../SalonAvatar';
import apiWrapper from '../../../../utilities/apiWrapper';
import FirstAvailableBtn from '../firstAvailableBtn';
import colors from '../../../../constants/appointmentColors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  columnLabel: {
    flexDirection: 'row',
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    height: 40,
  },
  columnLabelDate: {
    flexDirection: 'column',
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 40,
  },
  columnTitle: {
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '500',
    color: '#110A24',
    flex: 1,
  },
  columnDay: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#110A24',
    flex: 1,
  },
  columnDayName: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#110A24',
    flex: 1,
  },
  avatarStyle: {
    marginRight: 12,
  },
  firstCell: {
    backgroundColor: '#fff',
    width: 36,
    height: 40,
    borderWidth: 1,
    borderColor: '#C0C1C6',
    overflow: 'hidden',
  },
});

export default class Header extends Component {
  renderColumnLabel = (data, index) => {
    const { isDate } = this.props;
    return isDate ? this.renderDate(data, index) : this.renderProvider(data, index);
  }

  renderProvider = (data, index) => {
    const { cellWidth } = this.props;
    const uri = apiWrapper.getEmployeePhoto(data.id);
    const hasBorder =data.displayColor && data.displayColor !== -1;
    const backgroundColor = hasBorder ? colors[data.displayColor].light : '#fff';
    const borderColor = hasBorder ? colors[data.displayColor].dark : 'transparent';
    return (
      <View key={data.id} style={[styles.columnLabel, { width: cellWidth, backgroundColor }]} pointerEvents="box-none">
        <SalonAvatar
          wrapperStyle={styles.avatarStyle}
          width={24}
          borderWidth={hasBorder ? 3 : 0}
          borderColor={borderColor}
          image={{ uri }}
          // hasBadge
          // badgeComponent={
          //   <Icon name="birthdayCake" type="light" size={12} color="#115ECD" />
          // }
        />
        <Text numberOfLines={1} style={styles.columnTitle}>{`${data.name} ${data.lastName[0]}.`}</Text>
      </View>
    );
  }

  renderDate = (data, index) => {
    const { cellWidth } = this.props;
    const dayName = data.format('ddd').toString();
    const day = data.format('D').toString();
    return (
      <View key={data} style={[styles.columnLabelDate, { width: cellWidth }]} pointerEvents="box-none">
        <Text numberOfLines={1} style={styles.columnDayName}>{dayName}</Text>
        <Text numberOfLines={1} style={styles.columnDayName}>{day}</Text>
      </View>
    );
  }

  render() {
    const { isDate } = this.props;
    const width = isDate ? 36 : 100;
    return (
      <View style={styles.container} pointerEvents="box-none">
        <View style={[styles.firstCell, { width }]}>
          { isDate ? null : <FirstAvailableBtn /> }
        </View>
        { this.props.dataSource.map((data, index) => this.renderColumnLabel(data, index)) }
      </View>
    );
  }
}
