// @flow
import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import SalonAvatar from '../../SalonAvatar';
import WordHighlighter from '../../wordHighlighter';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  clientName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  clientEmail: {
    color: '#1D1D26',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
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
    flex: 1.5,
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
        onPress={() => { this.state.onPress(this.state.client.name); }}
      >
        <View style={styles.container}>

          {
        this.state.client.avatar &&
        <SalonAvatar
          key={this.state.client.id}
          wrapperStyle={styles.avatarContainer}
          width={59}
          image={this.state.client.avatar}
        />
      }

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
