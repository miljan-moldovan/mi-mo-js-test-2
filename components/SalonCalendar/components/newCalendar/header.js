import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import SalonAvatar from '../../../SalonAvatar';
import apiWrapper from '../../../../utilities/apiWrapper';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  columnLabel: {
    flexDirection: 'row',
    width: 130,
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
});

export default class Header extends Component {
  renderColumnLabel = (data, index) => {
    const uri = apiWrapper.getEmployeePhoto(data.id);
    return (
      <View key={data.id} style={styles.columnLabel} pointerEvents={'box-none'}>
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
    )
  }

  render() {

    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.dataSource.map((data, index) => this.renderColumnLabel(data, index)) }
      </View>
    );
  }
}
