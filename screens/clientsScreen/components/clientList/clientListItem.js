// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import { connect } from 'react-redux';
import WordHighlighter from '../../../../components/wordHighlighter';
import SalonTouchableHighlight from '../../../../components/SalonTouchableHighlight';

const styles = StyleSheet.create({
  phoneIconLeft: {
    fontSize: 18,
    marginRight: 10,
    textAlign: 'center',
    color: '#727A8F',
  },
  highlightStyle: {
    color: '#1DBF12',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  clientName: {
    color: '#110A24',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  clientEmail: {
    color: '#727A8F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  clientPhone: {
    color: '#727A8F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  dataContainer: {
    marginLeft: 20,
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

class ClientListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    const phones = props.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');

    this.state = {
      client: props.client,
      name: `${props.client.name} ${props.client.lastName}`,
      boldWords: props.boldWords,
      onPress: props.onPress,
      email: props.client.email ? props.client.email : null,
      phone: phones.length > 0 ? phones : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const phones = nextProps.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');


    this.setState({
      client: nextProps.client,
      name: `${nextProps.client.name} ${nextProps.client.lastName}`,
      email: nextProps.client.email ? nextProps.client.email : null,
      phone: phones.length > 0 ? phones : null,
      boldWords: nextProps.boldWords,
      onPress: nextProps.onPress,
    });
  }

  render() {
    return (
      <SalonTouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={() => { this.props.onPress(this.props.client); }}
      >
        <View style={styles.container}>
          <View style={styles.dataContainer}>
            <View style={styles.topContainer}>
              <View style={styles.clientNameContainer}>
                <WordHighlighter
                  highlight={this.props.boldWords}
                  highlightStyle={styles.highlightStyle}
                  style={styles.clientName}
                >
                  {this.state.name}
                </WordHighlighter>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              {this.state.phone &&
              <FontAwesome style={styles.phoneIconLeft}>{Icons.mobile}</FontAwesome>}
              {this.state.phone &&
              <WordHighlighter
                highlight={this.props.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientPhone}
              >
                {this.state.phone}
              </WordHighlighter>
}


              {this.state.email &&
              <WordHighlighter
                highlight={this.props.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientEmail}
              >
                {this.state.email}
              </WordHighlighter>
}
            </View>
          </View>

        </View>
      </SalonTouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientListItem);
