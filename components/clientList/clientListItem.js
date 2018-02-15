// @flow
import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import WordHighlighter from '../wordHighlighter';
import SalonIcon from '../SalonIcon';

const styles = StyleSheet.create({
  searchIconLeft: {
    width: 13,
    height: 16,
    paddingHorizontal: 15,
    paddingTop: 1,
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  clientNameContainer: {
    flexDirection: 'row',
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

class ClientListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
      boldWords: props.boldWords,
      onPress: props.onPress,
      simpleListItem: props.simpleListItem,
    };
  }

  state = {
    simpleListItem: false,
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      client: nextProps.client,
      boldWords: nextProps.boldWords,
      onPress: nextProps.onPress,
      simpleListItem: nextProps.simpleListItem,
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

            <View style={styles.clientNameContainer}>

              {this.state.simpleListItem &&
                <SalonIcon
                  size={16}
                  icon="search"
                  style={styles.searchIconLeft}
                />}

              <WordHighlighter
                highlight={this.state.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientName}
              >
                {this.state.client.name}
              </WordHighlighter>
            </View>

            {!this.state.simpleListItem &&
              <WordHighlighter
                highlight={this.state.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientEmail}
              >
                {this.state.client.email}
              </WordHighlighter>
            }
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientListItem);
