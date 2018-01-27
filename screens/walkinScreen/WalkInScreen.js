import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    backgroundColor: '#f3f3f4',
    flex: 7,
  },
  inputContainer: {
    flex: 10,
    backgroundColor: '#fff',
  },
});

class WalkInScreen extends Component {
  componentWillMount() {
    console.log('test');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>Cancel</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default WalkInScreen;
