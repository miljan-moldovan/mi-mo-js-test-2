// @flow
import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes, { any } from 'prop-types';
import { Icons, IconProps } from './interfaces';

/*
 this is a modified version of the package https://github.com/entria/react-native-fontawesome
 this adds font types (light, regular, solid and brands) and a simpler syntax
*/


const fontWeights = {
  solid: '900',
  brands: '400',
  light: '300',
  regular: '400',
  regularFree: '400',
  solidFree: '300',
  simple: 'normal',
};

const fontMap = {
  solid: 'FontAwesome5ProSolid',
  brands: 'FontAwesome5BrandsRegular',
  light: 'FontAwesome5ProLight',
  regular: 'FontAwesome5FreeRegular',
  regularFree: 'FontAwesome5FreeRegular',
  solidFree: 'FontAwesome5FreeSolid',
  simple: 'FontAwesome',
};

export default class Icon extends React.Component<IconProps, {}> {
  _root: any;

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  _ref = component => (this._root = component);

  render() {
    const { style, color, name, type, size: fontSize, fontWeight } = this.props;

    let fontFamily = 'FontAwesome5ProLight';
    let weight = fontWeight;

    if (type && fontMap[type]) {
      fontFamily = fontMap[type];
    }

    if (!fontWeight && type && fontWeights[type]) {
      weight = fontWeights[type];
    }

    const icon = Icons[name];

    return (
      <Text
        style={[
          styles.icon,
          style,
          { fontFamily, fontWeight },
          color ? { color } : null,
          fontSize ? { fontSize } : null,
          fontWeight ? { fontWeight } : { fontWeight: weight },
        ]}
        ref={this._ref}
      >
        {icon}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
