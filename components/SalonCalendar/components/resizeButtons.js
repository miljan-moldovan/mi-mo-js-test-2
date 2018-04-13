import React, { Component } from 'react';
import { View, PanResponder, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const styles = {
  container: {
    position: 'absolute',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  }
}

export default class ResizeButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.moveY = 0;
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.isActive,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.isActive,
      onPanResponderMove: (e, gesture) => {
        const { dy } = gesture;
        const size = dy - this.moveY;
        this.moveY = dy;
        this.props.onResize(size);
      },
      onPanResponderGrant: () => {

      },
      onPanResponderRelease: (e, gesture) => {
        this.moveY = 0;
        this.setState({ isActive: false }, this.props.onRelease)
      }
    });
  }

  handlePress = () => {
    this.setState({ isActive: true }, this.props.onPress);
  }

  render() {
    return (
      <View {...this.panResponder.panHandlers} style={[styles.container, this.props.position]}>
        <TouchableWithoutFeedback disabled={this.state.isActive} onPressIn={this.handlePress}>
          <View style={[styles.btn, {boderColor: this.props.color} ]}/>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
