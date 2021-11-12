import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SalonIcon from './../components/SalonIcon';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginHorizontal: 2,
  },
  text: {
    fontFamily: 'Roboto',
    marginHorizontal: 5,
  },
  icon: {
    width: 10,
    height: 13,
    marginLeft: 5,
    paddingTop: 1,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
});

const salonTag = props => (

  <View style={[styles.container, {
    backgroundColor: props.backgroundColor,
    height: props.tagHeight,
  }]}
  >
    {props.icon &&
    <SalonIcon
      size={props.iconSize}
      icon={props.icon}
      style={[styles.icon, { tintColor: props.iconColor }]}
    />
    }

    <Text style={[styles.text, {
          fontSize: props.valueSize,
          color: props.valueColor,
        }]}
    >{props.value}
    </Text>
  </View>
);

salonTag.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  valueColor: PropTypes.string,
  valueSize: PropTypes.number,
  tagHeight: PropTypes.number,
  iconSize: PropTypes.number,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

salonTag.defaultProps = {
  backgroundColor: '#000000',
  valueColor: '#FFFFFF',
  valueSize: 14,
  tagHeight: 24,
  iconSize: 14,
  icon: null,
  iconColor: '#FFFFFF',
};

export default salonTag;
