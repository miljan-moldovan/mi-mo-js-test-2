// @flow
import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight, ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { debounce, throttle } from 'lodash';

import { connect } from 'react-redux';
import WordHighlighter from '../../../../components/wordHighlighter';
import SalonTouchableHighlight from '../../../../components/SalonTouchableHighlight';
import absoluteFill = StyleSheet.absoluteFill;

const styles = StyleSheet.create({
  phoneIconLeft: {
    fontSize: 18,
    marginRight: 10,
    marginLeft: 2,
    textAlign: 'center',
    color: '#727A8F',
  },
  homeIconLeft: {
    fontSize: 12,
    marginRight: 8,
    textAlign: 'center',
    color: '#727A8F',
    fontWeight: '100',
    fontFamily: 'FontAwesome5ProLight',
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
    marginLeft: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    width: '98%',
  },
  clientEmail: {
    color: '#727A8F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    maxWidth: '60%',
  },
  clientPhone: {
    color: '#727A8F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginRight: 10,
    maxWidth: '60%',
  },
  dataContainer: {
    marginLeft: 20,
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  infoIsLoadingIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginLeft: 5,
    position: 'absolute',
    right: 20,
  }
});

class ClientListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handlePressClientThrottled = throttle(
      this.handlePressClient,
      2000,
      { trailing: false },
    );
  }

  handlePressClient = () => {
    if (this.props && this.props.onPress) {
      this.props.onPress(this.props.client);
    }
  }

  render() {
    const phones = this.props.client.phones.map(elem => (elem.value ? elem.value : null)).filter(val => val).join(', ');
    const name = `${this.props.client.name} ${this.props.client.lastName}`;
    const phone = phones.length > 0 ? phones : null;
    const email = this.props.client.email ? this.props.client.email : null;
    const store = this.props.client.visit ? this.props.client.visit : null;
    const clientInfoIsLoading = this.props.clientInfoIsLoading;

    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="black"
        onPress={this.handlePressClientThrottled}
      >
        <View style={styles.container}>
          <View style={styles.dataContainer}>
            {
              clientInfoIsLoading &&
              <View style={styles.infoIsLoadingIcon}>
                <ActivityIndicator />
              </View>
            }
            <View style={styles.topContainer}>
              <View style={styles.clientNameContainer}>
                <WordHighlighter
                  highlight={this.props.boldWords}
                  highlightStyle={styles.highlightStyle}
                  style={styles.clientName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {name}
                </WordHighlighter>
              </View>
            </View>
            <View style={[styles.bottomContainer, { paddingTop: 5 }]}>
              {store &&
              <FontAwesome style={styles.homeIconLeft}>{Icons.home}</FontAwesome>}
              {store &&
              <WordHighlighter
                highlight={this.props.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientPhone}
              >
                {store}
              </WordHighlighter>
            }
            </View>
            <View style={[styles.bottomContainer, { paddingTop: 5, width: '90%' }]}>

              {phone &&
              <FontAwesome style={styles.phoneIconLeft}>{Icons.mobile}</FontAwesome>}
              {phone &&
              <WordHighlighter
                highlight={this.props.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientPhone}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {phone}
              </WordHighlighter>
}


              {email &&
              <WordHighlighter
                highlight={this.props.boldWords}
                highlightStyle={styles.highlightStyle}
                style={styles.clientEmail}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {email}
              </WordHighlighter>
}
            </View>
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
