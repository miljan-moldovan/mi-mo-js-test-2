import React, {
  PropTypes,
} from 'react';

import {
  Text,
} from 'react-native';

import sectionString from './sectionString';

var textIndex = 0;

export default class WordHighlighter extends React.Component {

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
      var style = (section.highlight == true ? highlightStyle : null);
      var index = textIndex++;
      return <Text key={"text-highlight-element-" + index} style={style}>{section.text}</Text>;
    });

    return (
      <Text {...this.props}>{renderedText}</Text>
    );
  }
}
