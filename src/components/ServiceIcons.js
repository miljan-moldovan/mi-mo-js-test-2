// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Icon from '@/components/common/Icon';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const marginBottom = 5;

const smallDevice = Dimensions.get('window').width === 320;

const ServiceIcons = ({
  hideInitials, item, groupLeaderName, ...props
}) => (
  <View style={[
    {
      flexDirection: props.direction ? props.direction : 'row',
      alignItems: props.align ? props.align : 'center',
      justifyContent: 'center',
      marginTop: props.direction === 'column' ? 10 : 0,
    },
    props.wrapperStyle,
  ]}
  >

    <View style={
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      { item.badgeData.clientIsNew ? <NewGlobal direction={props.direction} /> : null}
      { (item.badgeData.clientIsNewLocally && !item.badgeData.clientIsNew) ?
        <NewLocal direction={props.direction} /> : null}
      { item.badgeData.isOnlineBooking ? <OnlineBooking direction={props.direction} /> : null}
      { item.badgeData.clientBirthday ? <Birthday direction={props.direction} /> : null}

      { item.groupId && (groupLeaderName || hideInitials) ?
        (<Group
          direction={props.direction}
          color={props.color}
          leader={item.isGroupLeader}
          hideInitials={hideInitials}
          leaderName={groupLeaderName}
        />) : null }
      { item.badgeData.clientHasMembership ? <Star direction={props.direction} /> : null}
    </View>
    { item.client.attributes && item.client.attributes.length ?
      <Tag attributes={item.client.attributes} direction={props.direction} /> : null}
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
  attributes: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    // padding: 4,
    marginRight: 3,
  },
  attributeText: {
    position: 'absolute',
    fontSize: 9,
    fontFamily: 'Roboto-Regular',
    color: '#2F3142',
    left: 20,
    width: smallDevice ? 240 : 310,
    zIndex: 99999,
  },
  newClientTag: {
    backgroundColor: '#082D66',
    borderRadius: 10,
    borderWidth: 1,
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

  onlineBookingTag: {
    backgroundColor: '#115ECD',
    borderColor: '#115ECD',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 0,
    padding: 4,
    marginRight: 3,
  },
  onlineBookingTagText: {
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
   marginBottom: direction === 'column' ? 5 : 0,
  }}
  type="light"
  name="gift"
/>);
const Tag = ({ direction, attributes }) => (<View style={[styles.attributes,
   { marginTop: direction === 'column' ? 10 : 0 }]}
>
  <FontAwesome style={[{
    marginRight: 3,
    color: 'black',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'FontAwesome5ProSolid',
    }]}
  >
    {Icons.tag}
  </FontAwesome>

  {direction === 'column' ? <Text style={[styles.attributeText]}>{attributes.map(attribute => (attribute.name)).join(', ')}</Text> : null}
</View>);
const OnlineBooking = ({ direction }) => (<View style={[styles.onlineBookingTag, { marginBottom: direction === 'column' ? marginBottom : 0 }]}><Text style={styles.onlineBookingTagText}>O</Text></View>);
const NewGlobal = ({ direction }) => (<View style={[styles.newClientTag, { marginBottom: direction === 'column' ? marginBottom : 0 }]}><Text style={styles.newClientTagText}>N</Text></View>);
const NewLocal = ({ direction }) => (<View style={[styles.newClientTag, { marginBottom: direction === 'column' ? marginBottom : 0 }]}><Text style={styles.newClientTagText}>NL</Text></View>);
const Star = ({ direction }) => (
  <FontAwesome style={[{
    marginRight: 3,
    color: '#FFA300',
    marginBottom: direction === 'column' ? marginBottom : 0,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'FontAwesome5ProSolid',
    }]}
  >
    {Icons.star}
  </FontAwesome>
);
const Group = ({
  leader, leaderName, color, direction, hideInitials,
}) => {
  const names = leaderName ? leaderName.split(' ') : null;
  color = color || { font: '#00E480', background: '#F1FFF2' };
  const leaderInitials = names ? names[0][0] + names[names.length - 1][0] : null;
  return (

    <View style={[styles.clientGroupContainer, { borderColor: color.borderColor, backgroundColor: color.backgroundColor, marginBottom: direction === 'column' ? marginBottom : 0 }]}>
      <View style={styles.clientGroupLabelContainer}>

        <FontAwesome style={[{
        marginRight: 3,
        color: '#000000',
        marginVertical: direction === 'column' ? 2 : 0,
        fontSize: 10,
        fontWeight: '900',
        fontFamily: 'FontAwesome5ProSolid',
        }]}
        >
          {Icons.userPlus}
        </FontAwesome>
        {leaderInitials && !hideInitials && <Text style={styles.clientGroupLabel}>{leaderInitials}</Text>}
      </View>
      { leader ? (<Text style={[styles.dollarSign, {
 height: '100%', fontWeight: '500', color: '#FFFFFF', backgroundColor: color.borderColor,
}]}
      >$
                  </Text>) : null }
    </View>
  );
};
