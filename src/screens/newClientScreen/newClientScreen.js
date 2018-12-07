import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';
import styles from './styles';
import ClientDetails from '../clientInfoScreen/components/clientDetails';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

export default class NewClientScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    let title = 'Add New Client';
    if (params && params.client) {
      title = `${params.client.name} ${params.client.lastName}`;
    }

    const props = this.props;

    const canSave = params.canSave || false;
    const handleDone = params.handleDone ?
      params.handleDone :
      () => { alert('Not Implemented'); };


    const handleBack = params.handleBack ?
      () => { params.handleBack(); navigation.goBack(); } :
      navigation.goBack;

    return ({
      header: (
        <SalonHeader
          title={title}
          headerLeft={(
            <SalonTouchableOpacity style={{ paddingLeft: 10 }} onPress={handleBack}>
              <View style={styles.backContainer}>
                <Text style={styles.leftButtonText}>
                  Cancel
                </Text>
              </View>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity
              disabled={!canSave}
              onPress={handleDone}
              style={{ paddingRight: 10 }}
            >
              <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
              Save
              </Text>
            </SalonTouchableOpacity>
          )}
        />
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

  setHandleBack = (handleBack) => {
    this.props.navigation.setParams({ handleBack });
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
          setHandleBack={this.setHandleBack}
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
