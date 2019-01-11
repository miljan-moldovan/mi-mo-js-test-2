import * as React from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { isNull } from 'lodash';

import SalonAvatar from '@/components/SalonAvatar';
import FirstAvailableBtn from './firstAvailableBtn';
import colors from '@/constants/appointmentColors';
import getEmployeePhotoSource
  from '@/utilities/helpers/getEmployeePhotoSource';
import { DefaultAvatar } from '@/components/formHelpers';

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
  roomText: {
    textAlign: 'center',
  },
  columnDay: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#110A24',
    lineHeight: 17,
  },
  columnDayName: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#110A24',
    lineHeight: 11,
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

export default class Header extends React.Component {
  renderColumnLabel = (data, index) => {
    const { isDate, selectedFilter } = this.props;

    switch (selectedFilter) {
      case 'rooms':
      case 'resources': {
        return this.renderStore(data, index);
      }
      case 'providers':
      case 'deskStaff':
      default: {
        if (isDate) {
          return this.renderDate(data, index);
        }
        return this.renderProvider(data, index);
      }
    }
  };

  renderProvider = (data, index) => {
    const { cellWidth, setSelectedProvider } = this.props;
    const image = getEmployeePhotoSource(data);
    const hasBorder = data.displayColor && data.displayColor !== -1;
    const backgroundColor = hasBorder
      ? colors[data.displayColor].light
      : '#fff';
    const borderColor = hasBorder
      ? colors[data.displayColor].dark
      : colors[4].dark;

    return (
      <TouchableHighlight
        key={data.id}
        onPress={() => setSelectedProvider(data)}
        underlayColor="rgba(0, 0, 0, 0.5)"
      >
        <View
          style={[styles.columnLabel, { width: cellWidth, backgroundColor }]}
          pointerEvents="box-none"
        >
          <SalonAvatar
            wrapperStyle={styles.avatarStyle}
            width={24}
            borderWidth={3}
            borderColor={borderColor}
            image={image}
            defaultComponent={<DefaultAvatar size={24} provider={data} />}
          />
          <Text
            numberOfLines={1}
            style={styles.columnTitle}
          >{`${data.name} ${data.lastName[0]}.`}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  renderDate = (data, index) => {
    const { cellWidth, setSelectedDay } = this.props;
    const dayName = data.format('ddd').toString();
    const day = data.format('D').toString();
    return (
      <TouchableHighlight
        key={data.id}
        onPress={() => setSelectedDay(data)}
        underlayColor="rgba(0, 0, 0, 0.5)"
      >
        <View
          key={data}
          style={[styles.columnLabelDate, { width: cellWidth }]}
          pointerEvents="box-none"
        >
          <Text numberOfLines={1} style={styles.columnDayName}>{dayName}</Text>
          <Text numberOfLines={1} style={styles.columnDay}>{day}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  renderStore = (data, index) => {
    const { cellWidth } = this.props;
    const textStyle = this.props.selectedFilter === 'rooms'
      ? [styles.columnTitle, styles.roomText]
      : styles.columnTitle;
    return (
      <View
        key={data.id}
        style={[styles.columnLabel, { width: cellWidth }]}
        pointerEvents="box-none"
      >
        <Text numberOfLines={1} style={textStyle}>{data.name}</Text>
      </View>
    );
  };

  render() {
    const {
      showAvailability,
    } = this.props;
    const width = showAvailability ? 166 : 36;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <View style={[styles.firstCell, { width }]}>
          {showAvailability
            ? <FirstAvailableBtn />
            : null}
        </View>
        {this.props.dataSource.map((data, index) =>
          this.renderColumnLabel(data, index),
        )}
      </View>
    );
  }
}
