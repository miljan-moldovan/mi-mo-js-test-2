// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Form, Item, Input, Button, Label } from 'native-base';
import SideMenuItem from '../components/SideMenuItem';

const URLKEY = '@APISettings:url';
const STOREKEY = '@APISettings:store';
const USERKEY = '@APISettings:user';
const PASSWORDKEY = '@APISettings:password';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Settings"
        icon={require('../assets/images/sidemenu/icon_score.png')}
      />
    ),
  };
  state = {
    loaded: false,
    store: '4',
    apiURL: 'http://zenithnew.dev.cicd.salondev.net',
  }
  componentWillMount() {
    this.loadSettings();
  }
  loadSettings = async () => {
    try {
      const apiURL = await AsyncStorage.getItem(URLKEY);
      const store = await AsyncStorage.getItem(STOREKEY);
      const user = await AsyncStorage.getItem(USERKEY);
      const password = await AsyncStorage.getItem(PASSWORDKEY);
      if (apiURL !== null || store !== null) {
        this.setState({
          apiURL,
          store,
          user,
          password,
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  saveSettings = async () => {
    const {
      store,
      apiURL,
      user,
      password
    } = this.state;
    try {
      await AsyncStorage.setItem(URLKEY, apiURL);
      await AsyncStorage.setItem(STOREKEY, store);
      await AsyncStorage.setItem(USERKEY, user);
      await AsyncStorage.setItem(PASSWORDKEY, password);
      Alert.alert('Settings saved!');
      // Keyboard.dismiss();
      // this.refs.secondTextInput.unFocus();
    //  this.refs.secondTextInput.setNativeProps({ focus: false });
    } catch (error) {
      Alert.alert('Error saving data', JSON.stringify(error));
    }
  }
  clearSettings = async () => {
    try {
      await AsyncStorage.removeItem(URLKEY);
      await AsyncStorage.removeItem(STOREKEY);
      await AsyncStorage.removeItem(USERKEY);
      await AsyncStorage.removeItem(PASSWORDKEY);
      Alert.alert('Settings cleared!');
    } catch (error) {
      Alert.alert('Error clearing data', JSON.stringify(error));
    }
  }
  _handleURLChange = apiURL => this.setState({ apiURL });
  _handleStoreChange = store => this.setState({ store });
  _handleUserChange = user => this.setState({ user });
  _handlePasswordChange = password => this.setState({ password });

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
          >

            <Text style={{
marginTop: 60, marginBottom: 20, fontSize: 22, fontWeight: '600',
}}
            >API Settings
            </Text>
            <Item>
              <Label>API URL</Label>
              <Input autoCorrect={false} blurOnSubmit autoCapitalize="none" onChangeText={this._handleURLChange} value={this.state.apiURL} />
            </Item>
            <Item>
              <Label>Store</Label>
              <Input autoCorrect={false} autoCapitalize="none" onChangeText={this._handleStoreChange} value={this.state.store} />
            </Item>
            <Item>
              <Label>User</Label>
              <Input autoCorrect={false} autoCapitalize="none" onChangeText={this._handleUserChange} value={this.state.user} />
            </Item>
            <Item>
              <Label>Password</Label>
              <Input autoCorrect={false} autoCapitalize="none" onChangeText={this._handlePasswordChange} value={this.state.password} />
            </Item>
            <View style={{ flexDirection: 'row' }}>
              <Button rounded bordered onPress={this.saveSettings} style={{ padding: 20, marginTop: 20, marginRight: 20 }}><Text>Save</Text></Button>
              <Button rounded bordered onPress={this.clearSettings} style={{ padding: 20, marginTop: 20 }}><Text>Clear</Text></Button>
            </View>

          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});
