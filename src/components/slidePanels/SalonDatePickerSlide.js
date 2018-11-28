import React from 'react';
import { Image, Text, Animated, Dimensions, View, StyleSheet } from 'react-native';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import moment from 'moment';
import ModalBox from './ModalBox';
import SalonTouchableOpacity from './../SalonTouchableOpacity';
import Icon from '@/components/common/Icon';

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
    height: 500,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  panelBlurredSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panelTopSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
    paddingVertical: 13,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconStyle: {
    width: 35,
    height: 10,
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
    width: Dimensions.get('window').width === 320 ? 40 : 48,
    height: Dimensions.get('window').width === 320 ? 40 : 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  weekJumpText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
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

const calendarTheme = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#CAD1D8',
  },
  monthText: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#110A24',
    margin: 10,
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#115ECD',
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

    // if (nextProps.visible) {
    //   this._panel.transitionTo(this.props.draggableRange.top, () => {});
    // }
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => {
    this.setState({ visible: false });
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
    const day = moment(this.state.selected).add(weekNumber, 'week').format('YYYY-MM-DD');
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

  renderArrow = direction => (direction === 'left' ?
    (<Icon name="chevronLeft" size={12.5} color="#727a8f" type="solid" />) :
    (<Icon name="chevronRight" size={12.5} color="#727a8f" type="solid" />))

  render() {
    return (
      <ModalBox
        isOpen={this.props.visible}
        coverScreen
        onClosingState={() => this.hidePanel()}
      >
        <View style={styles.panel}>
          <View style={styles.panelBlurredSection} />

          <View style={styles.panelContainer}>

            <View style={styles.panelTopArrow}>
              <SalonTouchableOpacity onPress={this.hidePanel}>
                <View>
                  <Image source={require('../../assets/images/icons/Chevron.png')} />
                </View>
              </SalonTouchableOpacity>
            </View>

            <View style={styles.panelTopSection}>
              <Calendar
                ref={(calendar) => { this.calendar = calendar; }}
                onDayPress={this.onDayPress}
                monthFormat="MMMM yyyy"
                style={{ width: '95%' }}
                markingType="custom"
                markedDates={{
                  ...this.props.markedDates,
                  [moment(this.state.selected).format('YYYY-MM-DD')]: {
                    customStyles: {
                      container: {
                        backgroundColor: '#727A8F',
                      },
                      text: {
                        fontFamily: 'Roboto',
                        fontWeight: '700',
                        color: 'white',
                      },
                    },
                  },
                }}
                theme={{
                  'stylesheet.calendar.header': {
                    week: {
                      marginTop: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      paddingBottom: 19,
                      borderBottomWidth: 1,
                      borderBottomColor: '#CAD1D8',
                    },
                    monthText: {
                      textAlign: 'center',
                      fontSize: 17,
                      lineHeight: 22,
                      fontFamily: 'Roboto',
                      fontWeight: '500',
                      color: '#110A24',
                    },
                    dayHeader: {
                      textAlign: 'center',
                      fontSize: 14,
                      fontFamily: 'Roboto',
                      fontWeight: '500',
                      color: '#115ECD',
                    },
                  },
                }}
                renderArrow={this.renderArrow}
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
                  <SalonTouchableOpacity onPress={() => this.jumpToWeeks(weeks)} key={Math.random().toString()}>
                    <View style={styles.weekJump}>
                      <Text style={styles.weekJumpText}>{weeks}</Text>
                    </View>
                  </SalonTouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ModalBox>);
  }
}
