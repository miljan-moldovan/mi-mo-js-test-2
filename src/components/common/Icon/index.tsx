import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Icons, IconProps, IconFontWeights, IconFonts, IconTypes } from './interfaces';

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

class Icon extends React.Component<IconProps, {}> {
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
export default Icon;
