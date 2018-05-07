// @flow
import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/*
 this is a modified version of the package https://github.com/entria/react-native-fontawesome
 this adds font types (light, regular, solid and brands) and a simpler syntax
*/

import IconDB from './IconDB';

const fontMap = {
  solid: 'FontAwesome5ProSolid',
  // regular: 'FontAwesome5ProRegular',
  brands: 'FontAwesome5BrandsRegular',
  light: 'FontAwesome5ProLight',
  regularFree: 'FontAwesome5FreeRegular',
  solidFree: 'FontAwesome5FreeSolid',
  simple: 'FontAwesome',
};

export default class Icon extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  _ref = component => this._root = component;

  render() {
    const {
      style, color, name, type, size: fontSize, fontWeight,
    } = this.props;

    let fontFamily = 'FontAwesome5ProLight';
    if (type && fontMap[type]) {
      fontFamily = fontMap[type];
    }

    const icon = IconDB[name];

    return (
      <Text
        style={[
          styles.icon,
          style,
          { fontFamily, fontWeight },
          color ? { color } : null,
          fontSize ? { fontSize } : null,
          fontWeight ? { fontWeight } : { fontWeight: 'normal' },
         ]}
        ref={this._ref}
      >
        {icon}
      </Text>
    );
  }
}
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
  type: PropTypes.oneOf(['regular', 'brands', 'light', 'solid']),
  size: PropTypes.number,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
