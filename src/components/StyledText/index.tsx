import * as React from 'react';
import { Text, RegisteredStyle, TextStyle } from 'react-native';

type IProps = {
  style?: RegisteredStyle<TextStyle>;
};

export class MonoText extends React.Component<IProps> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]}/>;
  }
}
