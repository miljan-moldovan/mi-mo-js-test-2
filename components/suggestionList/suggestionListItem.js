// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SalonTouchableHighlight from '../../components/SalonTouchableHighlight';

import { connect } from 'react-redux';
import WordHighlighter from '../wordHighlighter';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  value: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginLeft: 20,
  },
  searchIconLeft: {
    fontSize: 20,
    marginLeft: 20,
    textAlign: 'center',
    color: '#727A8F',
  },
});

class SuggestionListItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SalonTouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={() => { this.props.onPress(this.props.value); }}
      >
        <View style={styles.container}>
          <FontAwesome style={styles.searchIconLeft}>{Icons.search}
          </FontAwesome>
          <WordHighlighter
            highlight={this.props.boldWords}
            highlightStyle={styles.highlightStyle}
            style={styles.value}
          >
            {this.props.value}
          </WordHighlighter>
        </View>
      </SalonTouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SuggestionListItem);
