import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import styles from './styles';
import ClientDetails from '../clientInfoScreen/components/clientDetails';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

export default class NewClientScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    let title = 'New Client';
    if (params && params.client) {
      title = `${params.client.name} ${params.client.lastName}`;
    }

    const props = this.props;

    const canSave = params.canSave || false;
    const handleDone = params.handleDone ?
      params.handleDone :
      () => { alert('Not Implemented'); };

    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.sideButton} onPress={() => { navigation.goBack(); }}>
          <View style={styles.backContainer}>
            <FontAwesome style={styles.backIcon}>
              {Icons.angleLeft}
            </FontAwesome>
            <Text style={styles.leftButtonText}>
                    Back
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={handleDone}
          style={styles.sideButton}
        >
          <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
          Done
          </Text>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);
    
  }

  componentWillMount() {

  }

  setCanSave = (canSave) => {
    this.props.navigation.setParams({ canSave });
  }

  setHandleDone = (handleDone) => {
    this.props.navigation.setParams({ handleDone });
  }

  onClientCreated = (client) => {
    
    const { onChangeClient } = this.props.navigation.state.params;

    if (this.props.navigation.state.params && onChangeClient) {
      onChangeClient(client);
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ClientDetails
          setHandleDone={this.setHandleDone}
          setCanSave={this.setCanSave}
          editionMode
          actionType="new"
          client={null}
          onDismiss={this.onClientCreated}
          navigation={this.props.navigation}
          {...this.props}
        />
      </View>
    );
  }
}
