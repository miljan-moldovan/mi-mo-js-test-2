// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../components/UI/Icon';

const marginBottom = 5;

const ServiceIcons = ({
  hideInitials, item, groupLeaderName, ...props
}) => (
  <View style={[
    {
      flexDirection: props.direction ? props.direction : 'row',
      alignItems: props.align ? props.align : 'center',
      justifyContent: 'center',
    },
    props.wrapperStyle,
  ]}
  >

    {item.membership ? <Star direction={props.direction} /> : null}
    {item.newGlobal ? <NewGlobal direction={props.direction} /> : null}
    {item.newLocal ? <NewLocal direction={props.direction} /> : null}
    {item.client.isBirthdayToday ? <Birthday direction={props.direction} /> : null}
    { item.groupId && (groupLeaderName || hideInitials) ? (<Group direction={props.direction} color={props.color} leader={item.isGroupLeader} hideInitials={hideInitials} leaderName={groupLeaderName} />) : null }
    {item.attributes && item.attributes.length ? <Tag direction={props.direction} /> : null}

    { /*        {<Star direction={props.direction} />}
    {<NewGlobal direction={props.direction} />}
    {<NewLocal direction={props.direction} />}
    {<Birthday direction={props.direction} />}
    {(<Group direction={props.direction} leader leaderName="L C" />) }
    {<Tag direction={props.direction} />} */}
  </View>
);
export default ServiceIcons;

const styles = StyleSheet.create({
  clientGroupContainer: {
  //  borderColor: '#00E480',
    // backgroundColor: '#F0FEFD',
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
const Birthday = ({ direction }) => (<Icon
  style={{
   color: '#115ECD',
   marginRight: 3,
   fontSize: 15,
   marginBottom: direction === 'column' ? 10 : 0,
  }}
  type="light"
  name="gift"
/>);
const Tag = ({ direction }) => (<Icon style={{ marginRight: 3, color: 'black', marginBottom: direction === 'column' ? marginBottom : 0 }} type="regular" name="tag" />);
const NewGlobal = ({ direction }) => (<View style={[styles.newClientTag, { marginBottom: direction === 'column' ? marginBottom : 0 }]}><Text style={styles.newClientTagText}>NL</Text></View>);
const NewLocal = ({ direction }) => (<View style={[styles.newClientTag, { marginBottom: direction === 'column' ? marginBottom : 0 }]}><Text style={styles.newClientTagText}>N</Text></View>);
const Star = ({ direction }) => (<Icon style={{ color: '#FFA300', marginRight: 3, marginBottom: direction === 'column' ? marginBottom : 0 }} type="regular" name="star" />);
const Group = ({
  leader, leaderName, color, direction, hideInitials,
}) => {
  const names = leaderName.split(' ');
  color = color || { font: '#00E480', background: '#F1FFF2' };
  const leaderInitials = names[0][0] + names[names.length - 1][0];
  return (
    <View style={[styles.clientGroupContainer, { borderColor: color.font, backgroundColor: color.background, marginBottom: direction === 'column' ? marginBottom : 0 }]}>
      <View style={styles.clientGroupLabelContainer}>
        <Icon style={{ fontSize: 10, padding: 0 }} name="userPlus" type="simple" color="black" />
        {!hideInitials && <Text style={styles.clientGroupLabel}>{leaderInitials}</Text>}
      </View>
      { leader ? (<Text style={[styles.dollarSign, { fontWeight: '500', color: '#FFFFFF', backgroundColor: color.font }]}>$</Text>) : null }
    </View>
  );
};
