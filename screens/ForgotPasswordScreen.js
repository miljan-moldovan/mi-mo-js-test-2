// @flow
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Item, Input, Button, Label } from 'native-base';

export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
    title: 'Reset Password',
  };
  state = {

  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')}
        />
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.bodyText}>Having trouble logging in? You can use the form below to reset your password.</Text>
          <Text style={styles.bodyText}>
            You can also ask your manager to change your password through Salon Ultimate.
          </Text>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/images/login/icon_profile.png')} style={styles.inputIcon} />
            <Item floatingLabel style={styles.item}>
              <Label style={{ color: 'white', fontFamily: 'OpenSans-Regular' }}>Username</Label>
              <Input style={styles.input} autoCorrect={false} blurOnSubmit autoCapitalize="none" />
            </Item>
          </View>
          <Button transparent style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Text style={[styles.bodyText, { fontSize: 20 }]}>Reset Password</Text>
          </Button>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    // width: 292,
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
    marginTop: 32,
    // backgroundColor: '#333',
    justifyContent: 'center',
  },
  item: {
    width: 260,
    marginLeft: 18,
    marginTop: 0,
    paddingTop: 0,
    // backgroundColor: '#555'
  },
  inputLabel: {
    color: 'white',
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    paddingTop: 0,
    marginTop: 0,
    paddingLeft: 0,
  },
  inputIcon: {
    width: 28,
    height: 28,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
  bodyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
});
