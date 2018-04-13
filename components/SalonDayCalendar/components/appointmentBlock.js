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
    width: 323,
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 1,
    zIndex: 99,
  },
});

class appointmentBlock extends Component {
  constructor(props) {
    super(props);
    this.scrollValue = 0;
    const { toTime, fromTime } = props.appointment;
    const { startTime, step } = this.props.apptGridSettings;
    const start = moment(fromTime, 'HH:mm');
    const top = (start.diff(startTime, 'minutes') / step) * 30;
    const end = moment(toTime, 'HH:mm');
    const left = 0;// this.props.dates.findIndex(date => moment(date).format('YYYY-MM-DD') === moment(this.props.appointment.date).format('YYYY-MM-DD')) * 45;
    const height = (moment.duration(end.diff(start)).asMinutes() / step) * 30 - 1;
    this.animatedValueX = left;
    this.animatedValueY = top;

    this.state = {
      pan: new Animated.ValueXY({ x: left, y: top }),
      left,
      top,
      height,
      isActive: false,
      isScrolling: false,
      opacity: new Animated.Value(1),
    };

    this.state.pan.x.addListener(value => this.animatedValueX = value.value);
    this.state.pan.y.addListener(value => this.animatedValueY = value.value);
    this.panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.state.isActive,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.state.isActive,
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
          this.state.pan.setOffset({ x: this.animatedValueX, y: this.animatedValueY });
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderRelease: (e, gesture) => {
        this.moveX = null;
        this.moveY = null;
        const dx = this.state.pan.x._value + this.state.pan.x._offset - this.state.left;
        const dy = this.state.pan.y._value + this.state.pan.y._offset - this.state.top;
        const remainderX = dx % 130;
        const remainderY = dy % 30;
        const x = 130 - remainderX > 130 / 2 ?
          this.state.pan.x._value - remainderX : this.state.pan.x._value + 130 - remainderX;
        const y = 30 - remainderY > 30 / 2 ?
          this.state.pan.y._value - remainderY : this.state.pan.y._value + 30 - remainderY;
        const xOffset = 130 - remainderX > 130 / 2 ? dx - remainderX : dx + 130 - remainderX;
        const yOffset = 30 - remainderY > 30 / 2 ? dy - remainderY : dy + 30 - remainderY;
        const dateIndex = Math.abs(xOffset + this.state.left) / 130;
        const date = this.props.dates[dateIndex];
        const newFromTime = moment(fromTime, 'HH:mm').add((yOffset / 30) * 15, 'minutes').format('HH:mm');
        this.props.onDrop(this.props.appointment.id, {
          date: this.props.appointment.date,
          newTime: newFromTime,
          // employeeId: provider.id,
        });
        Animated.parallel([
          Animated.spring(
            this.state.pan,
            { toValue: { x, y } },
          ),
          Animated.timing(
            this.state.opacity,
            {
              toValue: 0,
            },
          ),
        ]).start(() => this.setState({ isActive: false }));
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isActive || this.state.isActive;
  }
  setIsScrolling = isScrolling => this.setState({ isScrolling })

  loopScroll = () => {
    if (!this.state.isScrolling) {
      return null;
    }
    this.props.onScrollX(this.props.calendarOffset.x + this.state.isScrolling);
    requestAnimationFrame(this.loopScroll);
  }

  handleOnLongPress = () => {
    this.setState({ isActive: true }, this.scrollAnimation);
    this.props.onDrag();
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0.7,
      },
    ).start();
  }

  scrollAnimation = () => {
    let dx = 0;
    let dy = 0;
    const boundLength = 30;
    const maxScrollChange = 15;
    const cardWidth = 130;
    const scrollVerticalBoundTop1 = (this.props.calendarMeasure.height
      + this.props.calendarOffset.y) - boundLength - this.state.height;
    if (this.state.isActive) {
      if (this.moveX && this.moveY) {
        if (Math.abs(this.moveX) >= Math.abs(this.moveY)) {
          const scrollHorizontalBoundRight = (this.props.calendarMeasure.width
            + this.props.calendarOffset.x) - boundLength - cardWidth;
          const scrollHorizontalBoundLeft = this.props.calendarOffset.x + boundLength;
          const moveX = this.moveX + this.state.pan.x._offset + this.state.pan.x._value;
          if (scrollHorizontalBoundRight < moveX) {
            dx = moveX - scrollHorizontalBoundRight;
          } else if (scrollHorizontalBoundLeft > moveX) {
            dx = moveX - scrollHorizontalBoundLeft;
          }
          if (Math.abs(dx) > 0) {
            dx = Math.abs(dx) > boundLength ? boundLength * Math.sign(dx) : dx;
            dx = dx * maxScrollChange / boundLength;
            this.props.onScrollX(this.props.calendarOffset.x + dx, () => {
              this.state.pan.setOffset({
                x: this.state.pan.x._offset + dx,
                y: this.state.pan.y._offset,
              });
              this.state.pan.setValue({ x: this.state.pan.x._value, y: this.state.pan.y._value });
            });
          }
        } else {
          const scrollVerticalBoundTop = (this.props.calendarMeasure.height
            + this.props.calendarOffset.y) - boundLength - this.state.height;
          const scrollVerticalBoundBottom = this.props.calendarOffset.y + boundLength;
          const moveY = this.moveY + this.state.pan.y._offset + this.state.pan.y._value;
          if (scrollVerticalBoundTop < moveY) {
            dy = moveY - scrollVerticalBoundTop;
          } else if (scrollVerticalBoundBottom > moveY) {
            dy = moveY - scrollVerticalBoundBottom;
          }
          if (Math.abs(dy) > 0) {
            dy = Math.abs(dy) > boundLength ? boundLength * Math.sign(dy) : dy;
            dy = dy * maxScrollChange / boundLength;
            this.props.onScrollY(this.props.calendarOffset.y + dy, () => {
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

  render() {
    const color = Math.floor(Math.random() * 4);
    const {
      client,
      service,
      fromTime,
      toTime,
      id,
    } = this.props.appointment;
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
    } : null;
    return (
      <Animated.View style={this.state.isActive ? { position: 'absolute' } : { position: 'absolute' }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.container,
            {
 height,
borderColor: colors[color].border,
backgroundColor: colors[color].content,
            left: this.state.left,
top: this.state.top,
opacity: this.state.opacity,
}]}

        >
          <View style={[styles.header, { backgroundColor: colors[color].header }]} />
          <Text numberOfLines={1} style={styles.clientText}>{clientName}</Text>
          <Text numberOfLines={1} style={styles.serviceText}>{serviceName}</Text>
        </Animated.View>
        <Animated.View
          {...this.panResponder.panHandlers}
          key={id}
          style={[styles.container,
            {
 height, borderColor, backgroundColor: contentColor, zIndex: 99,
},
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
      </Animated.View>
    );
  }
}

export default appointmentBlock;
