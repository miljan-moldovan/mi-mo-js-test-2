import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Platform,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import FlickAnimation from './FlickAnimation';

const visibleHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modal: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 99991,
  },
  container: {
    zIndex: 99999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  animatedContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'stretch',
  },
});


export default class SlidingUpPanel extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    draggableRange: PropTypes.shape({
      top: PropTypes.number.isRequired,
      bottom: PropTypes.number.isRequired,
    }),
    height: PropTypes.number,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onRequestClose: PropTypes.func,
    allowMomentum: PropTypes.bool,
    allowDragging: PropTypes.bool,
    showBackdrop: PropTypes.bool,
  }


  static defaultProps = {
    visible: false,
    height: visibleHeight,
    draggableRange: { top: visibleHeight, bottom: 0 },
    onDrag: () => {},
    onDragStart: () => {},
    onDragEnd: () => {},
    onRequestClose: () => {},
    allowMomentum: true,
    allowDragging: true,
    showBackdrop: false,
  }


  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this._onDrag = this._onDrag.bind(this);
    this._requestClose = this._requestClose.bind(this);
    this._isInsideDraggableRange = this._isInsideDraggableRange.bind(this);

    this.transitionTo = this.transitionTo.bind(this);
  }


  state:{
    visible: false,
  }

  componentWillMount() {
    const { top, bottom } = this.props.draggableRange;

    this._animatedValueY = -bottom;
    this._translateYAnimation = new Animated.Value(this._animatedValueY);
    this._flick = new FlickAnimation(this._translateYAnimation, -top, -bottom);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._onStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this._onPanResponderGrant.bind(this),
      onPanResponderMove: this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this),
      onPanResponderTerminate: this._onPanResponderTerminate.bind(this),
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,
    });

    this._translateYAnimation.addListener(this._onDrag);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });


    if (nextProps.visible && !this.props.visible) {
      this.transitionTo(-this.props.draggableRange.top);
    }

    if (
      nextProps.draggableRange.top !== this.props.draggableRange.top ||
      nextProps.draggableRange.bottom !== this.props.draggableRange.bottom
    ) {
      const { top, bottom } = nextProps.draggableRange;
      this._flick = new FlickAnimation(this._translateYAnimation, -top, -bottom);
    }
  }

  componentDidUpdate() {
    const { bottom } = this.props.draggableRange;
    if (this._animatedValueY !== -bottom && !this.props.visible) {
      this._translateYAnimation.setValue(-bottom);
    }
  }

  // eslint-disable-next-line no-unused-vars
  _onStartShouldSetPanResponder(evt, gestureState) {
    return (
      this.props.allowDragging && this._isInsideDraggableRange(this._animatedValueY)
    );
  }

  _onMoveShouldSetPanResponder(evt, gestureState) {
    return (
      this.props.allowDragging &&
      this._isInsideDraggableRange(this._animatedValueY) &&
      Math.abs(gestureState.dy) > 1
    );
  }

  // eslint-disable-next-line no-unused-vars
  _onPanResponderGrant(evt, gestureState) {
    this._flick.stop();
    this._translateYAnimation.setOffset(this._animatedValueY);
    this._translateYAnimation.setValue(0);
    this.props.onDragStart(-this._animatedValueY);
  }

  _onPanResponderMove(evt, gestureState) {
    if (!this._isInsideDraggableRange(this._animatedValueY)) {
      return;
    }

    this._translateYAnimation.setValue(gestureState.dy);
  }

  // Trigger when you release your finger
  _onPanResponderRelease(evt, gestureState) {
    if (!this._isInsideDraggableRange(this._animatedValueY)) {
      return;
    }

    this._translateYAnimation.flattenOffset();
    const cancelFlick = this.props.onDragEnd(-this._animatedValueY);


    if (!this.props.allowMomentum || cancelFlick) {
      return;
    }

    if (Math.abs(gestureState.vy) > 0.1) {
      this._flick.start({
        velocity: gestureState.vy,
        fromValue: this._animatedValueY,
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  _onPanResponderTerminate(evt, gestureState) {
    this.setState({ visible: false });
    //
  }

  _isInsideDraggableRange(value) {
    return (
      value >= -this.props.draggableRange.top &&
      value <= -this.props.draggableRange.bottom
    );
  }

  _onDrag({ value }) {
    if (this._isInsideDraggableRange(value)) {
      this._animatedValueY = value;
      this.props.onDrag(value);
    }

    if (value >= -this.props.draggableRange.bottom) {
      this.setState({ visible: false });
      this.props.onRequestClose();
    }
  }

  transitionTo(value, onAnimationEnd = () => {}) {
    const animationConfig = {
      toValue: -Math.abs(value),
      duration: 260,
      // eslint-disable-next-line no-undefined, max-len
      delay: Platform.OS === 'android' ? 166.67 : undefined, // to make it looks smooth on android
    };

    Animated.timing(this._translateYAnimation, animationConfig).start(onAnimationEnd);
  }

  _requestClose() {
    const { bottom } = this.props.draggableRange;
    if (this._animatedValueY === -bottom) {
      return this.props.onRequestClose();
    }

    this.setState({ visible: false });

    return this.transitionTo(-this.props.draggableRange.bottom, () =>
      this.props.onRequestClose());
  }


  render() {
    if (!this.props.visible) {
      return null;
    }

    const { top, bottom } = this.props.draggableRange;
    const height = this.props.height;

    const translateY = this._translateYAnimation.interpolate({
      inputRange: [-top, -bottom],
      outputRange: [-top, -bottom],
      extrapolate: 'clamp',
    });

    const transform = { transform: [{ translateY }] };

    const animatedContainerStyles = [
      styles.animatedContainer,
      this.props.contentStyle,
      transform,
      { height, top: visibleHeight, bottom: 0 },
    ];

    return (
      <Modal
        isVisible={this.state.visible}
        style={styles.modal}
      >
        <View style={styles.container} pointerEvents="box-none">
          <Animated.View
            {...this._panResponder.panHandlers}
            style={animatedContainerStyles}
          >
            {this.props.children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
