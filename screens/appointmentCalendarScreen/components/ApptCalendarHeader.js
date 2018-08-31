import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    height: 63,
    paddingBottom: 10,
    backgroundColor: '#115ECD',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1 / 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  btnTitle: {
    flex: 3 / 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconCaretDown: {
    marginLeft: 5,
  },
  rightContainer: {
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    flexDirection: 'row',
  },
  btnElipsis: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCalendar: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSearch: {
    position: 'absolute',
    top: 7.5,
  },
});

const ApptCalendarHeader = props => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.btn}
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
      style={styles.btnTitle}
      onPress={props.onPressTitle}
    >
      {props.title}
      <Icon
        style={styles.iconCaretDown}
        name="caretDown"
        type="solid"
        color="white"
        size={17}
      />
    </TouchableOpacity>
    <View
      style={styles.rightContainer}
    >
      <TouchableOpacity
        onPress={props.onPressEllipsis}
        style={styles.btnElipsis}
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
        style={styles.btnCalendar}
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
          style={styles.iconSearch}
        />
      </TouchableOpacity>
    </View>
  </View>
);

ApptCalendarHeader.propTypes = {
  onPressCalendar: PropTypes.func.isRequired,
  onPressEllipsis: PropTypes.func.isRequired,
  onPressTitle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onPressMenu: PropTypes.string.isRequired,
};

export default ApptCalendarHeader;
