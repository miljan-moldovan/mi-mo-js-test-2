// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  LayoutAnimation,
  UIManager
} from 'react-native';

import { Button } from 'native-base';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';
import * as actions from '../actions/clients.js';
import { ClientMerge } from '../components/ClientMerge';

const mergeClients = require('../mockData/mergeClients.json');


class ClientMergeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { onPressDone, loading } = params;

    return {
      header: (
          <SafeAreaView style={{justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#115ECD', flexDirection: 'row', paddingHorizontal: 19 }}>
            <TouchableOpacity style={styles.navButton} onPress={()=>navigation.goBack()}>
              <Text style={styles.navButtonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.headerTitle}>Duplicated Clients</Text>
              <Text style={styles.headerSubtitle}>Select clients to merge</Text>
            </View>
            {loading ? (
              <View style={styles.navButton}>
                <ActivityIndicator />
              </View>
            ):(
              <TouchableOpacity style={styles.navButton} onPress={onPressDone}>
                <Text style={[styles.navButtonText, onPressDone ? null : { color: '#0B418F' }]}>Done</Text>
              </TouchableOpacity>
            )}

          </SafeAreaView>
      ),
    }
  };

  state = {
    mergedClients: [],
    mainClient: null,
  }
  componentWillMount() {
    // this.loadClients();
  }
  loadClients() {
    const { params = {} } = this.props.navigation.state;
    const clientId = params.clientId || 1832;
    this.props.getMergeableClients(clientId);
  }

  componentWillReceiveProps(nextProps) {
    const { error, loading } = nextProps;

    if (error) {
      console.log('ClientMergeScreen.componentWillReceiveProps error', error);
      Alert.alert('Error', error.toString());
    }

    if (loading !== undefined && loading !== this.props.loading) {
      // console.log('nextProps.loading', loading);
      this.props.navigation.setParams({ loading });
    }
  }

  onChangeMergeClients = (mergedClients, mainClient) => {
    // console.log('onChangeMergeClients', mergedClients, mainClient);
    if (mergedClients) {
      if (mergedClients && mergedClients.length > 1) {
        this.props.navigation.setParams({ onPressDone: this.onFinishMergeClients });
      } else {
        this.props.navigation.setParams({ onPressDone: undefined });
      }
      this.setState({ mergedClients, mainClient });
    } else {
      // mergedClients is null, so no changes were made - only update mainClient
      this.setState({ mainClient });
    }

  }
  onFinishMergeClients = () => {
    const { mergedClients, mainClient } = this.state;
    this.props.mergeClients(mainClient, mergedClients, (success) => {
      if (success) {
        Alert.alert('Success', 'Clients were successfully merged.');
        this.props.navigation.goBack();
      } else {
        Alert.alert('Error', 'Error merging clients. Please try again.')
      }

    });
  }

  render() {
    return this.props.loading ?
    (
      <ActivityIndicator />
    ) : (
      <ClientMerge
        // data={this.props.mergeableClients}
        data={mergeClients}
        navigation={this.props.navigation}
        onChangeMergeClients={this.onChangeMergeClients}
       />
    );
  }
}
const mapStateToProps = ({ clientsReducer: clients }, ownProps) => ({
  mergeableClients: clients.mergeableClients,
  loading: clients.isLoading,
  waitingMerge: clients.waitingMerge,
  error: clients.error,
});
export default connect(mapStateToProps, actions)(ClientMergeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },

  headerTitle: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    marginBottom: 6
  },
  navButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
});
