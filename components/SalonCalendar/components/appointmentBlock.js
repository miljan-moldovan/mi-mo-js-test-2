import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import moment from 'moment';

import ResizeButton from './resizeButtons';

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
  },
});

class appointmentBlock extends Component {
  constructor(props) {
    super(props);
    this.scrollValue = 0;
    const { toTime, fromTime } = props.appointment;
    const { startTime, step } = props.apptGridSettings;
    const start = moment(fromTime, 'HH:mm');
    const top = 40 + (start.diff(startTime, 'minutes') / step) * 30;
    const end = moment(toTime, 'HH:mm');
    const left = props.providers.findIndex(
      provider => provider.id === props.appointment.employee.id) * 130;
    const height = (moment.duration(end.diff(start)).asMinutes() / step) * 30 - 1;
    this.animatedValueX = left;
    this.animatedValueY = top;
    this.state = {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top: new Animated.Value(top),
      height: new Animated.Value(height),
      isActive: false,
      isScrolling: false,
      isResizeing: false,
      opacity: new Animated.Value(0)
    };
    // this.state.pan.x.addListener((value) => this.animatedValueX = value.value);
    // this.state.pan.y.addListener((value) => this.animatedValueY = value.value);
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.isActive && !this.state.isResizeing,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.isActive && !this.state.isResizeing,
      onPanResponderMove: (e, gesture) => {
        this.moveX = gesture.dx;
        this.moveY = gesture.dy;
        return Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gesture);
      },
      onPanResponderGrant: () => {
        if (this.state.isActive) {
          this.state.pan.setOffset({ x: this.state.left, y: this.state.top._value });
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderRelease: (e, gesture) => {
        this.moveX = null;
        this.moveY = null;
        const dx = this.state.pan.x._value + this.state.pan.x._offset - this.state.left;
        const dy = this.state.pan.y._value + this.state.pan.y._offset - this.state.top._value;
        const remainderX = dx % 130;
        const remainderY = dy % 30;
        const x = 130 - remainderX > 130 / 2 ?
          this.state.pan.x._value - remainderX : this.state.pan.x._value + 130 - remainderX;
        const y = 30 - remainderY > 30 / 2 ?
          this.state.pan.y._value - remainderY : this.state.pan.y._value + 30 - remainderY;
        const xOffset = 130 - remainderX > 130 / 2 ? dx - remainderX : dx + 130 - remainderX;
        const yOffset = 30 - remainderY > 30 / 2 ? dy - remainderY : dy + 30 - remainderY;
        const providerIndex = Math.abs(xOffset + this.state.left)/130;
        const provider = this.props.providers[providerIndex];
        const newFromTime = moment(fromTime, 'HH:mm').add((yOffset/30) * 15, 'minutes').format('HH:mm');
        this.props.onDrop(this.props.appointment.id,{
          date: this.props.appointment.date,
          newTime: newFromTime,
          employeeId: provider.id,
        });
        Animated.parallel([
          Animated.spring(
            this.state.pan,
            { toValue: { x, y } }
          ),
          Animated.timing(
            this.state.opacity,
            {
              toValue: 0
            }
          )
        ]).start(() => this.setState({ isActive: false, left: this.state.left + xOffset, top: this.state.top._value + yOffset }), () => {
          this.props.onDrag(true);
        });
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isActive || this.state.isActive;
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
    this.offset = { x: this.props.calendarOffset.x, y: this.props.calendarOffset.y }
    this.props.onDrag(false);
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0.7
      }
    ).start();
  }

  scrollAnimation = () => {
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    const cardWidth = 130;
    if (this.state.isActive) {
      if (this.moveX && this.moveY) {
        if (Math.abs(this.moveX) >= Math.abs(this.moveY)) {
          const maxWidth = this.props.providers.length * 130 - this.props.calendarMeasure.width;
          const scrollHorizontalBoundRight = (this.props.calendarMeasure.width
            + this.offset.x) - boundLength - cardWidth;
          const scrollHorizontalBoundLeft = this.offset.x + boundLength;
          const moveX = this.moveX + this.state.pan.x._offset;
          if (scrollHorizontalBoundRight < moveX) {
            dx = moveX - scrollHorizontalBoundRight;
          } else if (scrollHorizontalBoundLeft > moveX) {
            dx = moveX - scrollHorizontalBoundLeft;
          }
          if (Math.abs(dx) > 0) {
            dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
            dx = dx * maxScrollChange / boundLength;
            this.offset.x += dx;
            if (this.offset.x > maxWidth) {
              this.offset.x =  maxWidth;
            }
            if (this.offset.x < 0) {
              this.offset.x = 0;
            }
            const cordiantesX = this.state.pan.x._offset + this.state.pan.x._value + dx;
            if (cordiantesX + cardWidth > maxWidth + this.props.calendarMeasure.width) {
              dx = maxWidth + this.props.calendarMeasure.width
              - this.state.pan.x._offset - this.state.pan.x._value - cardWidth;
            }
            if (cordiantesX < 0) {
              dx = 0;
            }
            this.props.onScrollX(this.offset.x, () => {
              this.state.pan.setOffset({
                x: this.state.pan.x._offset + dx,
                y: this.state.pan.y._offset,
              });
              this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
            });
          }
        } else {
          const maxHeigth = this.props.apptGridSettings.numOfRow * 30 - this.props.calendarMeasure.height;
          const scrollVerticalBoundTop = (this.props.calendarMeasure.height
            + this.offset.y) - boundLength - this.state.height - 40;
          const scrollVerticalBoundBottom = this.offset.y + boundLength + 40;
          const moveY = this.moveY + this.state.pan.y._offset;
          if (scrollVerticalBoundTop < moveY) {
            dy = moveY - scrollVerticalBoundTop;
          } else if (scrollVerticalBoundBottom > moveY) {
            dy = moveY - scrollVerticalBoundBottom;
          }
          if (Math.abs(dy) > 0) {
            dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
            dy = dy * maxScrollChange / boundLength;
            this.offset.y += dy;
            if (this.offset.y > maxHeigth) {
              this.offset.y = maxHeigth;
            }
            if (this.offset.y < 0) {
              this.offset.y = 0;
            }
            const cordiantesY = this.state.pan.y._offset + this.state.pan.y._value + dy;
            if (cordiantesY + this.state.height > maxHeigth + this.props.calendarMeasure.height) {
              dy = maxHeigth + this.props.calendarMeasure.height
              - this.state.pan.y._offset - this.state.pan.y._value - this.state.height;
            }
            if (cordiantesY < 40) {
              dy = 0;
            }
            this.props.onScrollY(this.offset.y, () => {
              this.state.pan.setOffset({
                x: this.state.pan.x._offset,
                y: this.state.pan.y._offset + dy,
              });
              this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
            });
          }
        }
      }
      requestAnimationFrame(this.scrollAnimation);
    }
  }

  resizeTop = (size) => {
    const { height } = this.state;
    if (height._value - size >= 30) {
      this.setState({ height: new Animated.Value(height._value - size), top: new Animated.Value(this.state.top._value + size) });
      this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value + size });
    }
  }

  resizeBottom = (size) => {
    const { height } = this.state;
    if (height._value + size >= 30) {
      this.setState({ height: new Animated.Value(height._value + size) });
    }
  }

  handleResizeReleaseTop = () => {
    const { height, top, pan } = this.state;
    const remainderH = height._value % 30;
    const remainderT = top._value % 30;
    const newSize = remainderH < 30 / 2 ? height._value - remainderH : height._value + 30 - remainderH;
    const newTop = remainderH < 30 / 2 ? top._value + remainderH : top._value - 30 + remainderH;
    Animated.parallel([Animated.spring(this.state.height, { toValue: newSize }),
    Animated.spring(this.state.top, { toValue: newTop }),
    Animated.spring(
      this.state.pan,
      { toValue: { x: pan.x._value, y: newTop } }
    )]).start(() => this.setState({ isResizeing: false }));
  }

  handleResizeReleaseBottom = () => {
    const { height } = this.state;
    const remainder = this.state.height._value % 30;
    const newSize = remainder < 30 / 2 ? height._value - remainder : height._value + 30 - remainder;
    Animated.spring(this.state.height, { toValue: newSize }).start(() => this.setState({ isResizeing: false }));
  }

  render() {
    const color = Math.floor(Math.random() * 4);
    const {
      client,
      service,
      fromTime,
      toTime,
      id,
    } = this.props.appointment;
    const cardWidth = 130;
    const clientName = `${client.name} ${client.lastName}`;
    const serviceName = service.description;
    const { height } = this.state;
    const borderColor = this.state.isActive ? colors[color].header : colors[color].border;
    const contentColor = this.state.isActive ? colors[color].header : colors[color].content;
    const serviceTextColor = this.state.isActive ? '#fff' : '#1D1E29';
    const clientTextColor = this.state.isActive ? '#fff' : '#2F3142';
    const shadow = this.state.isActive ? {
      shadowColor: '#3C4A5A',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    } : null
    return (
      <Animated.View style={this.state.isActive ? { position: 'absolute', zIndex: 1 } : { position: 'absolute', zIndex: 0 }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.container,
            { height, borderColor: colors[color].border, backgroundColor: colors[color].content,
            left: this.state.left, top: this.state.top, opacity: this.state.opacity }]}

        >
          <View style={[styles.header, { backgroundColor: colors[color].header }]} />
          <Text numberOfLines={1} style={styles.clientText}>{clientName}</Text>
          <Text numberOfLines={1} style={styles.serviceText}>{serviceName}</Text>
        </Animated.View>
        <Animated.View
          {...this.panResponder.panHandlers}
          key={id}
          style={[styles.container,
            { height, borderColor, backgroundColor: contentColor  },
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
          {this.state.isActive ?
            <ResizeButton
              onPress={() => this.setState({ isResizeing: true })}
              onRelease={this.handleResizeReleaseBottom}
              onResize={this.resizeBottom}
              color={colors[color].header}
              position={{ left: 2, bottom: -12}}
            /> : null }
          {this.state.isActive ?
            <ResizeButton
              onPress={() => this.setState({ isResizeing: true })}
              onRelease={this.handleResizeReleaseTop}
              onResize={this.resizeTop}
              color={colors[color].header}
              position={{ right: 2, top: -12 }}
            /> : null }
        </Animated.View>
      </Animated.View>
    );
  }
}

export default appointmentBlock;
