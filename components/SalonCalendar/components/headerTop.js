import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Icon from '../../UI/Icon';
import SalonAvatar from '../../SalonAvatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: '500',
    color: '#110A24',
    flex: 1,
  },
  cellStyle: {
    flexDirection: 'row',
    width: 130,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 8,
  },
  avatarStyle: {
    marginRight: 12,
  },
});

const renderItems = (item, key) => (
  <View style={styles.cellStyle} key={key}>
    <SalonAvatar
      wrapperStyle={styles.avatarStyle}
      width={24}
      borderWidth={0}
      image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
      hasBadge
      badgeComponent={
        <Icon name="birthdayCake" type="light" size={12} color="#115ECD" />
      }
    />
    <Text numberOfLines={1} style={styles.text}>{`${item.name} ${item.lastName[0]}.`}</Text>

  </View>
);

const headerTop = ({ dataSource }) => {
  return (
    <View style={styles.container}>
      {dataSource.map((item, index) => renderItems(item, index))}
    </View>
  );
};

export default headerTop;
