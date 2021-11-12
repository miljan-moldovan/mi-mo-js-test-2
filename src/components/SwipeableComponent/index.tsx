import * as React from 'react';
import { PanResponder } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style';

export const swipeDirections = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT',
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

function isValidSwipe(
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold,
) {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}

export default class extends React.PureComponent {
  private panResponder: any;

  constructor(props) {
    super(props);

    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: this.handleShouldSetPanResponder,
      onPanResponderRelease: this.handlePanResponderEnd,
    });
  }

  getSwipeDirection = gestureState => {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this.isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this.isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  };

  gestureIsClick = gestureState =>
    Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;

  isValidHorizontalSwipe = gestureState => {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  };

  isValidVerticalSwipe = gestureState => {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  };

  triggerSwipeHandlers (swipeDirection, gestureState) {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    if (onSwipe) {
      onSwipe(swipeDirection, gestureState);
    }
    switch (swipeDirection) {
      case SWIPE_LEFT:
        if (onSwipeLeft) {
          onSwipeLeft(gestureState);
        }
        break;
      case SWIPE_RIGHT:
        if (onSwipeRight) {
          onSwipeRight(gestureState);
        }
        break;
      case SWIPE_UP:
        if (onSwipeUp) {
          onSwipeUp(gestureState);
        }
        break;
      case SWIPE_DOWN:
        if (onSwipeDown) {
          onSwipeDown(gestureState);
        }
        break;
      default:
        break;
    }
  }

  handlePanResponderEnd = (evt, gestureState) => {
    const swipeDirection = this.getSwipeDirection(gestureState);
    this.triggerSwipeHandlers(swipeDirection, gestureState);
  };

  handleShouldSetPanResponder = (evt, gestureState) =>
    evt.nativeEvent.touches.length === 1 && !this.gestureIsClick(gestureState);

  render () {
    return (
      <KeyboardAwareScrollView style={styles.container} { ...this.panResponder.panHandlers }>
        {this.props.children}
      </KeyboardAwareScrollView>
    );
  }
}
