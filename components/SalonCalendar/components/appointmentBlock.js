import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import moment from 'moment';

const colors = [
  { header: '#ff8200', content: '#ffcd99', border: '#f9a71e' },
  { header: '#9e2fff', content: '#e2b2ff', border: '#b684ee' },
  { header: '#00c9c7', content: '#83f2f0', border: '#1ad9d8' },
  { header: '#006bf5', content: '#bad8ff', border: '#5c9cfa' },
  { header: '#0dce00', content: '#9fef99', border: '#2adb1e' },
];

const styles = StyleSheet.create({
  clientText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    color: '#2F3142',
  },
  serviceText: {
    color: '#1D1E29',
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: 'normal',
    paddingHorizontal: 8,
  },
  header: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  container: {
    position: 'absolute',
    width: 129,
    borderRadius: 4,
    borderWidth: 1,
    zIndex: 99,
  },
});

class appointmentBlock extends Component {
  constructor(props) {
    super(props);
    this.scrollValue = 0;
    const { fromTime } = props.appointment;
    const start = moment(fromTime, 'HH:mm');
    const top = 40 + (moment.duration(start.diff(props.initialTime)).asMinutes() / 15) * 30;
    const left = props.providers.findIndex(
      provider => provider.id === props.appointment.employee.id) * 130;
    this.animatedValueX = left;
    this.animatedValueY = top;
    this.state = {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top,
      isActive: false,
      isScrolling: false,
      dx: 0,
    };
    this.state.pan.x.addListener((value) => this.animatedValueX = value.value);
    this.state.pan.y.addListener((value) => this.animatedValueY = value.value);
    this.moveX = 0;
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.isActive,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.isActive,
      onPanResponderMove: (e, gesture) => {
        this.moveX = gesture.dx;
        const boundLength = 30;
        const scrollHorizontalBound = this.props.calendarMeasure.width + this.props.calendarOffset.x - boundLength;
        console.log(`dx: ${gesture.dx}, this.moveX: ${this.moveX}`)
        const moveX = gesture.dx + this.state.pan.x._offset + 130;
        // if (scrollHorizontalBound < moveX) {
        //   return;
        // }
        //this.setIsScrolling(false);
        //this.moveX = gesture.dx;
        return Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gesture);
      },
      onPanResponderGrant: () => {
        if (this.state.isActive) {
          this.state.pan.setOffset({ x: this.animatedValueX, y: this.animatedValueY });
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
   //      onPanResponderRelease           : (e, gesture) => {
   //     Animated.spring(            //Step 1
   //         this.state.pan,         //Step 2
   //         {toValue:{x:0,y:0}}     //Step 3
   //     ).start();
   // }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.hasOwnProperty('isACtive') ? nexState.isActive : this.state.isActive;
  }
  setIsScrolling = isScrolling => this.setState({ isScrolling })

  loopScroll = () => {
    if (!this.state.isScrolling) {
      return null
    }
      this.props.onScrollX(this.props.calendarOffset.x + this.state.isScrolling);
      requestAnimationFrame(this.loopScroll);
  }

  handleOnLongPress = () => {
    this.setState({ isActive: true }, this.scrollAnimation);
    this.offset = this.props.calendarOffset,
    this.props.onDrag();
  }

  scrollAnimation = () => {
    const boundLength = 30;
    const maxScrollChange = 15;
    const scrollHorizontalBound = this.props.calendarMeasure.width + this.props.calendarOffset.x - boundLength;
    let moveX = this.moveX + this.state.pan.x._offset + 130;
    if (this.state.isActive) {
      if (this.moveX === undefined || scrollHorizontalBound > moveX) {
        this.setState({ dx: 0 });
        return requestAnimationFrame(this.scrollAnimation);
      }
      let dx = moveX - scrollHorizontalBound;
      dx = dx > boundLength ? boundLength : dx;
      dx = dx * maxScrollChange / boundLength;
      this.offset.x += dx;
      this.props.onScrollX(this.offset.x);
      this.state.pan.setOffset({ x: this.state.pan.x._offset + dx, y: this.state.pan.y._offset });
      this.state.pan.setValue({ x: this.state.pan.x._value , y: this.state.pan.y._value });
      requestAnimationFrame(this.scrollAnimation);
    }
  }

  render() {
    const color = Math.floor(Math.random() * 4);
    const {
      clientName,
      serviceName,
      fromTime,
      toTime,
      id,
    } = this.props.appointment;
    const start = moment(fromTime, 'HH:mm');
    const end = moment(toTime, 'HH:mm');
    const height = (moment.duration(end.diff(start)).asMinutes() / 15) * 30 - 1;
    const borderColor = this.state.isActive ? colors[color].header : colors[color].border;
    const contentColor = this.state.isActive ? colors[color].header : colors[color].content;
    const serviceTextColor = this.state.isActive ? '#fff' : '#1D1E29';
    const clientTextColor = this.state.isActive ? '#fff' : '#2F3142';
    const shadow = this.state.isActive ? {
      shadowColor: '#3C4A5A',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4
    } : null
    return (
      <View style={{ position: 'absolute' }} key={id}>
        {this.state.isActive ?
          <View
            {...this.panResponder.panHandlers}
            style={[styles.container,
              { height, borderColor: colors[color].border, backgroundColor: colors[color].content,
              left: this.state.left, top: this.state.top }]}

          >
            <View style={[styles.header, { backgroundColor: colors[color].header }]} />
            <Text numberOfLines={1} style={styles.clientText}>{clientName}</Text>
            <Text numberOfLines={1} style={styles.serviceText}>{serviceName}</Text>
          </View> : null }
        <Animated.View
          {...this.panResponder.panHandlers}
          key={id}
          style={[styles.container,
            { height, borderColor, backgroundColor: contentColor },
            this.state.pan.getLayout(), shadow]}
        >
          <TouchableOpacity
            onLongPress={this.handleOnLongPress}
            disabled={this.state.isActive}
          >
            <View style={{ width: '100%', height: '100%' }}>
              <View style={[styles.header, { backgroundColor: colors[color].header }]} />
              <Text
                numberOfLines={1}
                style={[styles.clientText, { color: clientTextColor }]}
              >
                {clientName}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.serviceText, { color: serviceTextColor }]}
              >
                {serviceName}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

export default appointmentBlock;
