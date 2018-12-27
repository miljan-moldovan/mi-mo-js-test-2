import * as React from 'react';
import {
  Image,
  Text,
  Dimensions,
  View,
} from 'react-native';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import moment from 'moment';
// @ts-ignore
import ModalBox from '../ModalBox';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import styles from './styles';


const toWeekArray = ['1', '2', '3', '4', '5', '6'];

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
};

LocaleConfig.defaultLocale = 'en';

type IState = {
  visible: boolean,
  selected?: string,
};
type IProps = {
  visible: boolean,
  selectedDate: string,
  onHide: () => void,
  mode: string,
  currentDate?: string,
  onDateSelected: (startDate, endDate) => void,
  markedDates: any,
  onPressArrowLeft: () => void,
  onPressArrowRight: () => void,
};

export default class SalonDatePickerSlide extends React.Component<IProps, IState> {
  static defaultProps = {
    draggableRange: {
      top: Dimensions.get('window').height,
      bottom: 0,
    },
  };
  private calendar: any;

  constructor(props) {
    super(props);
    // @ts-ignore
    this.state = {
      visible: props.visible,
    };
  }

  state: {
    visible: false,
    selected: '',
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      selected: nextProps.selectedDate,
    });
  }

  get current() {
    const dateFromProps = moment(this.props.currentDate);
    if (dateFromProps.isValid()) {
      return dateFromProps.format();
    }

    return moment().format();
  }

  hidePanel = () => {
    this.setState({ visible: false });
    this.props.onHide();
  };

  onDayPress = day => {
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
  };

  jumpToWeeks = weekNumber => {
    const day = moment(this.state.selected)
      .add(weekNumber, 'week')
      .format('YYYY-MM-DD');
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
  };

  renderArrow = direction =>
    direction === 'left'
      ? <Icon name="chevronLeft" size={12.5} color="#727a8f" type="solid" />
      : <Icon name="chevronRight" size={12.5} color="#727a8f" type="solid" />;

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
                  <Image
                    source={require('@/assets/images/icons/Chevron.png')}
                  />
                </View>
              </SalonTouchableOpacity>
            </View>

            <View style={styles.panelTopSection}>
              <Calendar
                ref={calendar => {
                  this.calendar = calendar;
                }}
                current={this.current}
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
                {toWeekArray.map((weeks) => (
                  <SalonTouchableOpacity
                    onPress={() => this.jumpToWeeks(weeks)}
                    key={weeks}
                  >
                    <View style={styles.weekJump}>
                      <Text style={styles.weekJumpText}>{weeks}</Text>
                    </View>
                  </SalonTouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ModalBox>
    );
  }
}
