import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '../../../components/UI/Icon';

export default ApptCalendarHeader = props => (
  <View style={{
      height: 63,
      paddingBottom: 10,
      backgroundColor: '#115ECD',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    }}
  >
    <TouchableOpacity
      style={{
      flex: 1 / 5,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      marginLeft: 16,
    }}
      onPress={props.onPressMenu}
    >
      <Icon
        name="bars"
        type="solid"
        color="white"
        size={19}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
      flex: 3 / 5,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}
      onPress={props.onPressTitle}
    >
      {props.title}
      <Icon
        style={{ marginLeft: 5 }}
        name="caretDown"
        type="solid"
        color="white"
        size={17}
      />
    </TouchableOpacity>
    <View
      style={{
      flex: 1 / 5,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 16,
      flexDirection: 'row',
    }}
    >
      <TouchableOpacity
        onPress={props.onPressEllipsis}
        style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Icon
          name="ellipsisH"
          type="solid"
          color="white"
          size={17}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onPressCalendar}
        style={{
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Icon
          name="calendarO"
          type="regularFree"
          color="white"
          size={19}
        />
        <Icon
          name="search"
          type="solid"
          color="white"
          size={8}
          style={{ position: 'absolute', top: 7.5 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);
