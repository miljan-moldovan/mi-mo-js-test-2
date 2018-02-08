import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';

import Button from '../../../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#1D1D26',

  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#67A3C7',
  },
  noteContainer: {
    paddingHorizontal: 35,
    paddingVertical: 15,
  },
  noteMeta: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'rgba(29,29,38,0.35)',
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    color: 'rgba(29,29,38,1)',
  },
  noteFooter: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 5,
    justifyContent: 'flex-start',
  },
  switchItem: {
    paddingVertical: 20,
    paddingHorizontal: 27,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.2)',
  },
  switchLabel: {
    color: '#1D1D26',
    fontSize: 18,

  },
});

// const notes = require('../../../mockData/clientDetails/notes.json');

export default class ClientNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      premiumSwitch: false,
      vipSwitch: true,
    };
  }

  componentWillMount() {
    // this.setState({ activeData: notes });
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.switchItem}
            onPress={() => {
              this.setState({ premiumSwitch: !this.state.premiumSwitch });
            }}
          >
            <Text style={styles.switchLabel}>Premium</Text>
            <Switch
              value={this.state.premiumSwitch}
              onChange={() => {
                const { switches } = this.state;
                this.setState({ premiumSwitch: !this.state.premiumSwitch });
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchItem}
            onPress={() => {
              this.setState({ vipSwitch: !this.state.vipSwitch });
            }}
          >
            <Text style={styles.switchLabel}>VIP</Text>
            <Switch
              value={this.state.vipSwitch}
              onChange={() => {
                this.setState({ vipSwitch: !this.state.vipSwitch });
              }}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Button type="light" text="Modify Attributes List" onPress={null} />
          </View>
        </View>
      </View>
    );
  }
}
