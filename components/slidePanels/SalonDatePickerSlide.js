import React from 'react';
import { Image, Text, Animated, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import moment from 'moment';
import SalonSlidingUpPanel from './../SalonSlidingUpPanel';

LocaleConfig.locales.en = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
};

LocaleConfig.defaultLocale = 'en';

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'relative',

  },
  panelContainer: {
    backgroundColor: '#CDCED2',
    flexDirection: 'column',
    zIndex: 99999,
    height: 580,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  panelBlurredSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panelTopSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 345,
  },
  panelBottomSection: {
    backgroundColor: '#F3F4F4',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 130,
  },
  panelTopArrow: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconStyle: {
    width: 35,
    height: 15,
  },
  weekJumpContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '90%',
  },
  weekJump: {
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  weekJumpText: {
    fontSize: 14,
    color: '#115ECD',
  },
  weekJumpTitle: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Roboto-bold',
  },
  weekJumpTitleContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class SalonDatePickerSlide extends React.Component {
  static defaultProps = {
    draggableRange: {
      top: Dimensions.get('window').height,
      bottom: 0,
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  state:{
    visible: false,
    selected: ''
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      selected: nextProps.selectedDate,
    });

    if (nextProps.visible) {
      this._panel.transitionTo(this.props.draggableRange.top, () => {});
    }
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => {
    this.setState({ visible: false });
    this._panel.transitionTo(this.props.draggableRange.bottom, () => {});
    this.props.onHide();
  }

  onDayPress = (day) => {
    this.setState({
      selected: day.dateString,
    });

    const startDate = moment(day.dateString);

    let endDate = startDate.clone();
    endDate = this.props.mode === 'week' ? endDate.add(6, 'day') : startDate;

    this.props.onDateSelected(startDate, endDate);

    setTimeout(() => {
      this.hidePanel();
    }, 10);
  }


  jumpToWeeks = (weekNumber) => {
    const day = moment().add(weekNumber, 'week').format('YYYY-MM-DD');
    this.setState({
      selected: day,
    });

    const startDate = moment(day);

    let endDate = startDate.clone();
    endDate = this.props.mode === 'week' ? endDate.add(6, 'day') : startDate;

    this.props.onDateSelected(startDate, endDate);

    setTimeout(() => {
      this.hidePanel();
    }, 10);
  }

  render() {
    return (
      <SalonSlidingUpPanel
        visible
        showBackdrop={this.state.visible}
        onDragEnd={() => this.setState({ visible: false })}
        ref={(c) => { this._panel = c; }}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}
      >
        <View style={styles.panel}>
          <View style={styles.panelBlurredSection} />

          <View style={styles.panelContainer}>

            <View style={styles.panelTopArrow}>
              <TouchableOpacity onPress={this.hidePanel}>
                <View>
                  <Image source={require('../../assets/images/icons/chevronDown.png')} style={styles.iconStyle} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.panelTopSection}>
              <Calendar
                ref={(calendar) => { this.calendar = calendar; }}
                onDayPress={this.onDayPress}
                monthFormat="MMMM yyyy"
                style={{ width: '95%' }}
                markedDates={{
                  [this.state.selected]: { selected: true },
                }}
                theme={{
                  textSectionTitleColor: '#115ECD',
                  selectedDayBackgroundColor: '#1DBF12',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#727A8F',
                  dayTextColor: '#110A24',
                  dotColor: '#727A8F',
                  selectedDotColor: '#FFFFFF',
                  arrowColor: '#727A8F',
                  monthTextColor: '#110A24',
                  textDayFontFamily: 'Roboto',
                  textMonthFontFamily: 'Roboto-Bold',
                  textDayHeaderFontFamily: 'Roboto',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 16,
                }}
                hideExtraDays
                onPressArrowLeft={this.props.onPressArrowLeft}
                onPressArrowRight={this.props.onPressArrowRight}
              />
            </View>
            <View style={styles.panelBottomSection}>
              <View style={styles.weekJumpTitleContainer}>
                <Text style={styles.weekJumpTitle}>JUMP TO WEEKS</Text>
              </View>
              <View style={styles.weekJumpContainer}>
                { ['3', '4', '5', '6', '7', '8'].map((weeks, i) => (
                  <TouchableOpacity onPress={() => this.jumpToWeeks(weeks)} key={Math.random().toString()}>
                    <View style={styles.weekJump}>
                      <Text style={styles.weekJumpText}>{weeks}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </SalonSlidingUpPanel>);
  }
}
