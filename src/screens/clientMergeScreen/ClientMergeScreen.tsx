// @flow
import * as React from 'react';
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ClientMerge } from './ClientMerge';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';
import SalonHeader from '../../components/SalonHeader';

class ClientMergeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { onPressDone, isLoading } = params;
    const { onPressBack } = params;
    const goBack = (() => { navigation.goBack(); onPressBack(); });

    return {
      header: (
        <SalonHeader
          title="Duplicated Clients"
          subTitle="Select clients to merge"
          headerLeft={
            <SalonTouchableOpacity style={styles.navButton} onPress={goBack}>
              <Text style={styles.navButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            isLoading ? (
              <View style={styles.navButton}>
                <ActivityIndicator />
              </View>
            ) : (
              <SalonTouchableOpacity style={styles.navButton} onPress={onPressDone}>
                <Text style={[styles.navButtonText, onPressDone ? null : { color: '#0B418F' }]}>Done</Text>
              </SalonTouchableOpacity>
              )
          }
        />
      ),
    };
  };

  state = {
    mergedClients: [],
    mainClient: null,
  }
  componentWillMount() {
    this.loadClients();
  }

  loadClients() {
    const { params = {} } = this.props.navigation.state;
    const clientId = params.clientId;
    this.props.clientsActions.getMergeableClients(clientId, (response) => { });
  }

  componentWillReceiveProps(nextProps) {
    const { error, isLoading } = nextProps;

    if (error) {
      Alert.alert('Error', error.toString());
    }

    if (isLoading !== undefined && isLoading !== this.props.isLoading) {
      //
      this.props.navigation.setParams({ isLoading });
    }
  }

  onChangeMergeClients = (mergedClients, mainClient) => {
    //
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

    const { params = {} } = this.props.navigation.state;
    const { onDismiss } = params;

    this.props.clientsActions.mergeClients(mainClient, mergedClients, (success) => {
      if (success) {
        // Alert.alert('Success', 'Clients were successfully merged.');
        if (onDismiss) {
          onDismiss();
        } else {
          this.props.navigation.goBack();
        }
      } else {
        //  Alert.alert('Error', 'Error merging clients. Please try again.');
      }
    });
  }

  render() {
    return this.props.isLoading ?
      (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      ) : (
        <ClientMerge
          mainClient={this.props.navigation.state.params.clientId}
          data={this.props.mergeableClients}
          navigation={this.props.navigation}
          onChangeMergeClients={this.onChangeMergeClients}
        />
      );
  }
}

export default ClientMergeScreen;
