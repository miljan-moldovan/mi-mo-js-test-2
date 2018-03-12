// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../components/UI/Icon';

const ServiceIcons = ({ item, groupLeaderName, ...props }) => (
  <View style={{
      flexDirection: props.direction ? props.direction : 'row',
      alignItems: props.align ? props.align : 'center',
    justifyContent: 'center',
}}
  >
    {item.membership ? star : null}
    {item.newGlobal ? newGlobal : null}
    {item.newLocal ? newLocal : null}
    {item.birthday ? birthday : null}
    {item.groupId && groupLeaderName ? (<Group leader={item.isGroupLeader} leaderName={groupLeaderName} />) : null }
    {item.attributes && item.attributes.length ? tag : null}
  </View>
);
export default ServiceIcons;

const styles = StyleSheet.create({
  clientGroupContainer: {
    borderColor: '#00E480',
    borderRadius: 4,
    marginRight: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientGroupLabelContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientGroupLabel: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    marginLeft: 2,
  },
  dollarSign: {
    backgroundColor: '#00E480',
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  newClientTag: {
    backgroundColor: '#082D66',
    borderRadius: 10,
    borderWidth: 1,
    // paddingHorizontal: 3,
    paddingVertical: 0,
    padding: 4,
    marginRight: 3,
  },
  newClientTagText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    padding: 0,
  },
});
const birthday = <Icon style={{ color: '#115ECD', marginRight: 3, fontSize: 15 }} type="solid" name="gift" />;
const tag = <Icon style={{ marginRight: 3, color: 'black' }} type="regular" name="tag" />;
const newGlobal = <View style={styles.newClientTag}><Text style={styles.newClientTagText}>NL</Text></View>;
const newLocal = <View style={styles.newClientTag}><Text style={styles.newClientTagText}>N</Text></View>;
const star = <Icon style={{ color: '#FFA300', marginRight: 3 }} type="regular" name="star" />;
const Group = ({ leader, leaderName }) => {
  const names = leaderName.split(' ');
  const leaderInitials = names[0][0] + names[names.length - 1][0];
  return (
    <View style={styles.clientGroupContainer}>
      <View style={styles.clientGroupLabelContainer}>
        <Icon style={{ fontSize: 10, padding: 0 }} name="userPlus" type="regular" color="black" />
        <Text style={styles.clientGroupLabel}>{leaderInitials}</Text>
      </View>
      { leader ? (<Text style={styles.dollarSign}>$</Text>) : null }
    </View>
  );
};
