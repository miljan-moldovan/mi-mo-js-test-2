import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';

import rightArrow from '../../assets/images/walkinScreen/icon_arrow_right_xs.png';
import serchImage from '../../assets/images/walkinScreen/icon_search_w.png';
import infoImage from '../../assets/images/icons/icon_plus.png';
import SalonAvatar from '../../components/SalonAvatar';
import SalonIcon from '../../components/SalonIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  titleContainer: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 4.5,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C1C6',
    borderTopWidth: 1,
    borderTopColor: '#C0C1C6',
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 18,
    color: '#727A8F',
    letterSpacing: 0,
  },
  inputContainer: {
    flex: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
  },
  listItemContainer: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },

  listClientContainer: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
    flexDirection: 'column',
  },
  btnContainer: {
    flex: 10,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#000',
  },
  textBtn: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
  },
  searchImage: {
    tintColor: '#231F20',
  },
  serviceDuration: {
    flex: 0,
    fontSize: 12,
    opacity: 0.6,
  },
  servicePrice: {
    color: '#B2AFAA',
    fontSize: 16,
    lineHeight: 18,
    marginRight: 10,
    fontFamily: 'OpenSans-SemiBold',
  },
  subTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#000000',
    opacity: 0.4,
    marginBottom: 5,
  },
  providerImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  providerRound: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  // providerImage: {
  //   borderRadius: 15,
  //   height: 30,
  //   width: 30,
  // },
  providerData: {
    marginLeft: 15,
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  providerName: {
    color: '#1D1D26',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  inputGroup: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: '#C0C1C6',
  },
  placeholderText: {
    color: '#727A8F',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  inputText: {
    color: '#110A24',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#C3D6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#115ECD',
    fontSize: 10,
    lineHeight: 11,
    fontFamily: 'Roboto',
  },
});

const InputGroup = props => (
  <View style={styles.inputGroup}>
    {props.children}
  </View>
);

const Divider = () => (
  <View style={styles.divider} />
);

class WalkInScreen extends Component {
  state = {
    isWalkin: false,
  };

  handlePressService = () => {
    const { navigate } = this.props.navigation;
    const { selectedService } = this.props.walkInState;
    this.props.walkInActions.setCurrentStep(2);

    if (selectedService) {
      navigate('Services', { actionType: 'update' });
    } else {
      navigate('Services', { actionType: 'new' });
    }
  }

  handlePressProvider = () => {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.walkInState;

    this.props.walkInActions.setCurrentStep(3);
    if (selectedProvider) {
      navigate('Providers', { actionType: 'update' });
    } else {
      navigate('Providers', { actionType: 'new' });
    }
  }


  handlePressClient = () => {
    const { navigate } = this.props.navigation;
    const { selectedClient } = this.props.walkInState;

    this.props.walkInActions.setCurrentStep(5);
    if (selectedClient) {
      navigate('ClientsSearch', {
        actionType: 'update',
        dismissOnSelect: true,
        onChangeClient: this.handleClientSelection,
      });
    } else {
      navigate('ClientsSearch', {
        actionType: 'new',
        dismissOnSelect: true,
        onChangeClient: this.handleClientSelection,
      });
    }
  }
  handleClientSelection = (client) => {
    this.props.walkInActions.selectedClient(client);
  }

  renderClientGroup = () => (
    <InputGroup>
      <View style={styles.inputSection}>
        <Text style={styles.placeholderText}>Walk-in Client?</Text>
        <Switch onChange={() => { this.setState({ isWalkin: !this.state.isWalkin }); }} value={this.state.isWalkin} />
      </View>
      {!this.state.isWalkin ? (
        <View style={{ alignSelf: 'stretch' }}>
          <Divider />
          <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={this.handlePressClient}>
            <View style={styles.inputSection}>
              <Text style={this.props.walkInState.selectedClient === null ? styles.placeholderText : styles.inputText}>{this.props.walkInState.selectedClient === null ? 'Name' : this.props.walkInState.selectedClient.name}</Text>
              <SalonIcon size={15} icon="caretRight" />
            </View>
          </TouchableOpacity>
          <Divider />
          <View style={styles.inputSection}>
            <Text style={this.props.walkInState.selectedClient === null ? styles.placeholderText : styles.inputText}>{this.props.walkInState.selectedClient === null ? 'Email' : this.props.walkInState.selectedClient.email}</Text>
          </View>
          <Divider />
          <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
            <Text style={this.props.walkInState.selectedClient === null ? styles.placeholderText : styles.inputText}>{this.props.walkInState.selectedClient === null ? 'Phone number' : this.props.walkInState.selectedClient.phone}</Text>
          </View>
        </View>
      ) : (
        null
      )}
    </InputGroup>
  );

  renderServiceGroup = () => {
    const { selectedService } = this.props.walkInState;

    return (
      <InputGroup>
        {selectedService ? (
          <TouchableOpacity onPress={this.handlePressService} style={{ alignSelf: 'stretch' }}>
            <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
              <Text style={styles.inputText}>{selectedService.name}</Text>
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handlePressService} style={{ alignSelf: 'stretch' }}>
            <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
              <Text style={styles.placeholderText}>Choose service</Text>
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        )}

      </InputGroup>
    );
  }
  renderTitle = title => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  renderProviderGroup = () => {
    const { selectedProvider } = this.props.walkInState;

    return (
      <InputGroup>
        {selectedProvider ? (
          <TouchableOpacity onPress={this.handlePressProvider} style={{ alignSelf: 'stretch' }}>
            <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>FA</Text>
                </View>
                <Text style={styles.inputText}>{selectedProvider.name}</Text>
              </View>
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handlePressProvider} style={{ alignSelf: 'stretch' }}>
            <View style={[styles.inputSection, { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>FA</Text>
                </View>
                <Text style={styles.inputText}>First Available</Text>
              </View>
              <SalonIcon icon="caretRight" size={15} />
            </View>
          </TouchableOpacity>
        )}
      </InputGroup>
    );
  }

  renderClientButton = () => {
    if (this.props.walkInState.selectedClient !== null) {
      return (
        <View style={{ flex: 30, flexDirection: 'column' }}>
          <View style={styles.listClientContainer}>
            <Text style={styles.subTitle}>Client</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 10, flexDirection: 'row' }}>
                <Text style={styles.textInput}>{this.props.walkInState.selectedClient.name}</Text>
                <Image style={{ marginHorizontal: 10 }} source={infoImage} />
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={this.handlePressClient}>
                  <Image style={styles.searchImage} source={serchImage} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.listClientContainer}>
            <Text style={styles.subTitle}>Email</Text>
            <Text style={styles.textInput}>{this.props.walkInState.selectedClient.email}</Text>
          </View>
          <View style={styles.listClientContainer}>
            <Text style={styles.subTitle}>Phone</Text>
            <Text style={styles.textInput}>{this.props.walkInState.selectedClient.phone}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 30, flexDirection: 'column' }}>
        <View style={styles.listItemContainer}>
          <Text style={styles.textInput}>Client</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => {
              const { navigate } = this.props.navigation;

              this.props.walkInActions.setCurrentStep(1);
              navigate('ClientsSearch');
            }}
            >
              <Image style={styles.searchImage} source={serchImage} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listItemContainer}>
          <Text style={styles.textInput}>Email</Text>
        </View>
        <View style={styles.listItemContainer}>
          <Text style={styles.textInput}>Phone</Text>
        </View>
      </View>

    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTitle('CLIENT INFO')}
        {this.renderClientGroup()}
        {this.renderTitle('SERVICE')}
        {this.renderServiceGroup()}
        {this.renderTitle('PROVIDER')}
        {this.renderProviderGroup()}
      </View>
    );
  }
}

export default WalkInScreen;
