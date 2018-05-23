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
  },
  btnContainer: {
    padding: 15,
  },
};

export default class ResizeButtons extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isActive: false,
    // };
    // this.calendarOffset = props.calendarOffset;
    // this.moveY = 0;
    // this.panResponder = PanResponder.create({
    //   onPanResponderTerminationRequest: () => false,
    //   onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //   onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    //   onPanResponderMove: (e, gesture) => {
    //     const { dy } = gesture;
    //     const size = dy - this.moveY;
    //     this.moveY = dy;
    //     this.props.onResize(size);
    //   },
    //   onPanResponderGrant: () => {
    //
    //   },
    //   onPanResponderRelease: (e, gesture) => {
    //     this.moveY = 0;
    //     this.setState({ isActive: false }, this.props.onRelease)
    //   }
    // });
  }

  // scrollAnimation = () => {
  //   const boundLength = 30;
  //   const maxScrollChange = 15;
  //   let dy = 0;
  //   let moveY = 0;
  //   if (this.state.isActive) {
  //     if (this.moveY > 0) {
  //       const maxHeigth = this.props.apptGridSettings.numOfRow * 30 - this.props.calendarMeasure.height;
  //       const scrollVerticalBoundTop = this.props.calendarMeasure.height - boundLength - 40;
  //       //const scrollVerticalBoundBottom = this.props.calendarOffset.y + boundLength + 40;
  //       moveY = this.props.top + this.props.height;
  //       if (scrollVerticalBoundTop < moveY) {
  //         dy = moveY - scrollVerticalBoundTop;
  //       }
  //       if (dy > 0) {
  //         dy = dy > boundLength ? boundLength : dy;
  //         dy = dy * maxScrollChange / boundLength;
  //         this.calendarOffset.y += dy;
  //         if (this.calendarOffset.y > maxHeigth) {
  //           this.calendarOffset.y = maxHeigth;
  //         }
  //         // // if (this.offset.y < 0) {
  //         // //   this.offset.y = 0;
  //         // // }
  //         // //const size = this.state.pan.y._offset + this.state.pan.y._value + dy;
  //         if (moveY + dy > maxHeigth + this.props.calendarMeasure.height) {
  //           dy = maxHeigth + this.props.calendarMeasure.height
  //           -  moveY - dy;
  //         }
  //         // if (cordiantesY < 40) {
  //         //   dy = 0;
  //         // }
  //         this.props.onScrollY(this.calendarOffset.y, () => {
  //           this.props.onResize(dy);
  //         });
  //       }
  //     } else if (this.moveY < 0) {
  //       const scrollVerticalBoundBottom = boundLength + 40;
  //       moveY = this.props.top;
  //       if (scrollVerticalBoundBottom > moveY) {
  //         dy = scrollVerticalBoundBottom - moveY;
  //       }
  //       if (dy > 0) {
  //         dy = dy > boundLength ? boundLength : dy;
  //         dy = dy * maxScrollChange / boundLength;
  //         this.calendarOffset.y -= dy;
  //         if (this.calendarOffset.y < 0) {
  //           this.calendarOffset.y = 0;
  //         }
  //
  //         if (this.props.top - dy < 40) {
  //           dy = 0;
  //         }
  //         this.props.onScrollY(this.calendarOffset.y, () => {
  //           this.props.onResize(-dy);
  //         });
  //       }
  //     }
  //     requestAnimationFrame(this.scrollAnimation);
  //   }
  // }

  handlePress = () => {
    this.props.onPress();
  }

  render() {
    const { position, isDisabled } = this.props;
    console.log('BaconMoveActive', isDisabled)
    return (
      <View style={[styles.container, position]}>
        <TouchableWithoutFeedback
          disabled={isDisabled}
          onPressIn={this.handlePress}
        >
          <View style={styles.btnContainer}>
            <View style={[styles.btn, {borderColor: this.props.color} ]}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
