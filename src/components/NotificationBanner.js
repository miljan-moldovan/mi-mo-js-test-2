// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import SalonTouchableOpacity from './SalonTouchableOpacity';

const BANNER_HEIGHT = 50;
const AUTODISMISS_TIMEOUT = 2000;


export class NotificationBanner extends React.Component {
  state = {
    visible: false,
    fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
    timeout: null,
  }

  componentWillMount() {
    this.setState({ visible: this.props.visible });
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.visible && !this.props.visible) {
      // clear any running timeout in case of multiple calls
      if (this.timeout) { clearTimeout(this.timeout); }

      this.timeout = setTimeout(() => {
        this.hide();
        this.setState({ visible: false });
        this.props.onDismiss && this.props.onDismiss();
      }, AUTODISMISS_TIMEOUT);
      this.show();
      this.setState({ visible: true });
    } else if (!nextProps.visible && this.props.visible) {
      // LayoutAnimation.easeInEaseOut(); // configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.hide();
      this.setState({ visible: false });
    }
  }
  hide() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 400,
      },
    ).start();
  }
  show() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 600,
      },
    ).start();
  }
  render() {
    const { visible } = this.state;
    // { top: visible ? 0 : BANNER_HEIGHT * -1 }]}>
    return (
      <Animated.View style={[
        styles.container,
        this.props.backgroundColor && { backgroundColor: this.props.backgroundColor },
        {
          opacity: this.state.fadeAnim,
          top: this.state.fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [BANNER_HEIGHT * -1, 0],
          }),
        }]}
      >
        <Text style={styles.text}>
          {this.props.children}
        </Text>
        {this.props.button}
      </Animated.View>
    );
  }
}
export class NotificationBannerButton extends React.Component {
  render() {
    return (
      <SalonTouchableOpacity style={styles.buttonContainer} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>
          {this.props.title}
        </Text>
      </SalonTouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BANNER_HEIGHT,
    position: 'absolute',
    top: BANNER_HEIGHT * -1,
    left: 0,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    margin: 16,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginLeft: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    marginRight: 5,
  },
});
