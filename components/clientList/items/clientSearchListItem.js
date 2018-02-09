// @flow
import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import WordHighlighter from '../../wordHighlighter';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  clientName: {
    color: '#110A24',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  clientEmail: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 10,
  },
  dataContainer: {
    marginLeft: 20,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

class ClientSearchListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
      boldWords: props.boldWords,
      onPress: props.onPress,
    };
  }

  state = {

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      client: nextProps.client,
      boldWords: nextProps.boldWords,
      onPress: nextProps.onPress,
    });
  }

  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={() => { this.state.onPress(this.state.client); }}
      >
        <View style={styles.container}>


          <View style={styles.dataContainer}>

            <WordHighlighter
              highlight={this.state.boldWords}
              highlightStyle={styles.highlightStyle}
              style={styles.clientName}
            >
              {this.state.client.name}
            </WordHighlighter>

            <WordHighlighter
              highlight={this.state.boldWords}
              highlightStyle={styles.highlightStyle}
              style={styles.clientEmail}
            >
              {this.state.client.email}
            </WordHighlighter>
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientSearchListItem);
