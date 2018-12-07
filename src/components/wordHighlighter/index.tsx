import * as React from 'react';
import {
  Text,
} from 'react-native';

import sectionString from './sectionString';

let textIndex = 0;

export default class WordHighlighter extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      highlight,
      caseSensitive,
      children,
      highlightStyle,
    } = this.props;

    const sections = sectionString(highlight, children, caseSensitive);
    const renderedText = sections.map((section) => {
      const style = (section.highlight == true ? highlightStyle : null);
      const index = textIndex++;
      return <Text key={`text-highlight-element-${index}`} style={style}>{section.text}</Text>;
    });

    return (
      <Text {...this.props}>{renderedText}</Text>
    );
  }
}
