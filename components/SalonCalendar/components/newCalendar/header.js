import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import SalonAvatar from '../../../SalonAvatar';
import apiWrapper from '../../../../utilities/apiWrapper';
import FirstAvailableBtn from '../firstAvailableBtn';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  columnLabel: {
    flexDirection: 'row',
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 8,
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
    return (
      <View key={data.id} style={[styles.columnLabel, { width: cellWidth }]} pointerEvents="box-none">
        <SalonAvatar
          wrapperStyle={styles.avatarStyle}
          width={24}
          borderWidth={0}
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
    return (
      <View key={data} style={[styles.columnLabel, { width: cellWidth }]} pointerEvents="box-none">
        <Text numberOfLines={1} style={styles.columnTitle}>{index}</Text>
      </View>
    );
  }

  render() {
    const { isDate } = this.props;
    const width = isDate ? 36 : 138;
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
