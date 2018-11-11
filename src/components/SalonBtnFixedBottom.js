import React from 'react';
import { Text, View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';


const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    minHeight: 48,
  },
  container: {
    flex: 1,
    position: 'relative',
    alignSelf: 'stretch',
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
  },
});

export const SalonFixedBottom = props => (
  <View
    style={[styles.btnContainer, {
      backgroundColor: props.backgroundColor,
      borderTopRightRadius: 9,
      borderTopLeftRadius: 9,
    }, props.rootStyle]}
  >
    <View style={[styles.container, props.containerStyle]}>
      {props.value && (
        <Text style={[styles.text, {
              fontSize: props.valueSize,
              color: props.valueColor,
            }]}
        >{props.value}
        </Text>
      )}
      {props.children}
    </View>
  </View>
);
SalonFixedBottom.propTypes = {
  children: PropTypes.element,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  valueColor: PropTypes.string,
  valueSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  rootStyle: ViewPropTypes,
  containerStyle: ViewPropTypes,
};
SalonFixedBottom.defaultProps = {
  children: null,
  value: false,
  backgroundColor: 'transparent',
  valueColor: '#000000',
  valueSize: 14,
  rootStyle: {},
  containerStyle: {},
};

const salonBtnFixedBottom = props => (
  <SalonTouchableOpacity
    onPress={props.onPress}
    style={[styles.btnContainer, props.rootStyle, { backgroundColor: props.backgroundColor }]}
  >
    <View style={styles.container}>
      {props.value && (
        <Text style={[styles.text, {
              fontSize: props.valueSize,
              color: props.valueColor,
            }]}
        >{props.value}
        </Text>
      )}
      {props.children}
    </View>
  </SalonTouchableOpacity>
);
salonBtnFixedBottom.propTypes = {
  children: PropTypes.element,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  valueColor: PropTypes.string,
  valueSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

salonBtnFixedBottom.defaultProps = {
  children: null,
  value: false,
  backgroundColor: 'transparent',
  valueColor: '#000000',
  valueSize: 14,
};

export default salonBtnFixedBottom;
