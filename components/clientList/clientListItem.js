// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import AvatarWrapper from '../avatarWrapper';
import WordHighlighter from '../wordHighlighter';

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

class ClientListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
      boldWords: props.boldWords,
    };
  }

  state = {

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      client: nextProps.client,
      boldWords: nextProps.boldWords,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {
        this.state.client.avatar &&
        <AvatarWrapper
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
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientListItem);
