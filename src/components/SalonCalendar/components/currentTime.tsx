import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import moment from 'moment';

const windowsWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
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

class CurrentTime extends React.Component {
  constructor(props) {
    super(props);
    const currentTime = moment();
    let dTime = currentTime.diff(this.props.startTime, 'minutes');
    dTime = ((dTime / this.props.apptGridSettings.step) * 30) - 5.5;
    this.state = {
      currentTime: currentTime.format('h:mm'),
      top: new Animated.Value(dTime),
    };
    this.timeInterval = setInterval(this.updateTime, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  updateTime = () => {
    const currentTime = moment();
    let dTime = currentTime.diff(this.props.startTime, 'minutes');
    dTime = dTime / this.props.apptGridSettings.step * 30 - 5.5;
    Animated.timing(this.state.top, {
      toValue: dTime,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
    this.setState({ currentTime: currentTime.format('h:mm') });
  };

  render() {
    if (!this.props.isNeedShowCurrentTime) return null;

    return (
      <Animated.View style={[styles.container, { top: this.state.top }]}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{this.state.currentTime}</Text>
        </View>
      </Animated.View>
    );
  }
}

export default CurrentTime;
