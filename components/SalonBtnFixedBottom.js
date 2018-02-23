import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';


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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
  },

});

const salonBtnFixedBottom = props => (
  <TouchableOpacity
    onPress={props.onPress}
    style={[styles.btnContainer, { backgroundColor: props.backgroundColor }]}
  >
    <View style={styles.container}>
      <Text style={[styles.text, {
          fontSize: props.valueSize,
          color: props.valueColor,
        }]}
      >{props.value}
      </Text>
    </View>
  </TouchableOpacity>
);

salonBtnFixedBottom.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  valueColor: PropTypes.string,
  valueSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

salonBtnFixedBottom.defaultProps = {
  backgroundColor: 'transparent',
  valueColor: '#000000',
  valueSize: 14,
};

export default salonBtnFixedBottom;
