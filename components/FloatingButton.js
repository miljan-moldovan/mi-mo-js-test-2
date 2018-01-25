import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

class FloatingButton extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <TouchableOpacity style={styles.buttonContainer} onPress={()=>console.log('Do not touch me you prevert')}>
          {this.props.children}
        </TouchableOpacity>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  root:{
    position: 'absolute',
    right: 18,
    bottom: 38,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#67A3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
});

export default FloatingButton;
