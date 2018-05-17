import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

const colors = {
  success: '#4D5067',
  error: '#F50035',
  warning: '#D9C101',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toast: {
    width: '100%',
    position: 'absolute',
    left: 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  description: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 12,
  },
  btn: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
    padding: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

class SalonToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: new Animated.Value(-44),
    };
  }

  componentDidMount() {
    Animated.timing(
      this.state.top,
      {
        toValue: 0,
        duration: 800,
      },
    ).start(() => setTimeout(this.hide, 1000));
  }

  hide = () => {
    if (!this.ishidding) {
      this.ishidding = true;
      Animated.timing(
        this.state.top,
        {
          toValue: -44,
          duration: 600,
        },
      ).start(this.props.hide);
    }
  }

  render() {
    const { top, visible } = this.state;
    const { type, description, btnRightText, btnLeftText } = this.props;
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.toast, { backgroundColor: colors[type], top }]}>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={this.hide}>
              <Text style={styles.btn}>{btnLeftText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.hide}>
              <Text style={styles.btn}>{btnRightText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default SalonToast;
