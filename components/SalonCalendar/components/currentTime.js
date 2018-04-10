import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 34.5,
  },
  lineStyle: {
    flex: 1,
    height: 1,
    backgroundColor: '#1DBF12',
  },
  textContainer: {
    width: 35,
    height: 11,
    backgroundColor: '#1DBF12',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
});

class CurrentTime extends Component {
  constructor(props) {
    super(props);
    const currentTime = moment();
    let dTime = currentTime.diff(this.props.startTime, 'seconds');
    dTime = (dTime / (15 * 60)) * 30;
    this.state = {
      currentTime: currentTime.format('HH:mm'),
      top: new Animated.Value(dTime),
    };
    this.timeInterval = setInterval(this.updateTime, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  updateTime = () => {
    const currentTime = moment();
    let dTime = currentTime.diff(this.props.startTime, 'seconds');
    dTime = (dTime / (15 * 60)) * 30;
    Animated.timing(this.state.top, {
      toValue: dTime,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
    this.setState({ currentTime: currentTime.format('HH:mm') });
  }

  render() {
    return (
      <Animated.View style={[styles.container, { top: this.state.top }]}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{this.state.currentTime}</Text>
        </View>
        <View style={styles.lineStyle} />
      </Animated.View>
    );
  }
}

export default CurrentTime;
