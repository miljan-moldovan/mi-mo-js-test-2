import * as React from 'react';
import { Text, StyleProp, TextStyle, StyleSheet } from 'react-native';

import { Icons } from './Icons';

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});


export enum IconTypes {
  solid = 'Solid',
  brands = 'Brands',
  light = 'Light',
  regular = 'RegularFree',
  regularFree = 'RegularFree',
  solidFree = 'SolidFree',
  simple = 'Simple',
}
export enum IconFonts {
  Solid = 'FontAwesome5ProSolid',
  Brands = 'FontAwesome5BrandsRegular',
  Light = 'FontAwesome5ProLight',
  RegularFree = 'FontAwesome5FreeRegular',
  SolidFree = 'FontAwesome5FreeSolid',
  Simple = 'FontAwesome',
};

export interface IconProps {
  name: string,
  type?: string,
  size?: number,
  color?: string,
  style?: StyleProp<TextStyle>,
  fontWeight?: string,
}

export enum IconFontWeights {
  Solid = '900',
  Brands = '400',
  Light = '300',
  RegularFree = '400',
  SolidFree = '300',
  Simple = 'normal',
};

export default class Icon extends React.Component<IconProps, {}> {
  root = null;

  setNativeProps(nativeProps) {
    this.root.setNativeProps(nativeProps);
  }

  setRef = component => this.root = component;

  render() {
    const {
      style, color, name, type, size: fontSize, fontWeight,
    } = this.props;
    let fontFamily = 'FontAwesome5ProLight';
    let weight = fontWeight;
    if (type && IconTypes[type]) {
      fontFamily = IconFonts[IconTypes[type]];
    }
    if (!fontWeight && type && IconFontWeights[type]) {
      weight = IconFontWeights[type];
    }
    const icon = Icons[name];
    const finalStyle: any = {};
    finalStyle.fontFamily = fontFamily;
    finalStyle.fontWeight = fontWeight ? fontWeight : weight;
    if (color) {
      finalStyle.color = color;
    }
    if (fontSize) {
      finalStyle.fontSize = fontSize;
    }
    const iconStyles = [
      styles.icon,
      style,
      finalStyle,
    ];
    return (
      <Text style={iconStyles} ref={this.setRef}>{icon}</Text>
    );
  }
}