import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';

import SalonModal from '../SalonModal';


const styles = StyleSheet.create({
  modal: {
    padding: 10,
    margin: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    left: 0,
    height: 350,
    width: '100%',
    backgroundColor: 'gray',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  calendar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350,
    width: '100%',
    borderRadius: 4,
  },
});


class SalonDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
      minDate: props.minDate,
      maxDate: props.maxDate,
    };
  }

  state:{
    isVisible: false,
    minDate: '',
    maxDate: ''
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isVisible: nextProps.isVisible,
    });
  }

  onDayPress(day) {
    this.setState({
      isVisible: false,
      selected: day.dateString,
    });

    this.props.onPress(day.dateString);
  }

  hideModal = () => {
    this.setState({ isVisible: false });
    this.props.onPress(null);
  }
  render() {
    return (
      <SalonModal
        style={styles.modal}
        contentStyle={styles.modalContent}
        isVisible={this.state.isVisible}
        closeModal={this.hideModal}
      >
        {[
          <View style={styles.container}>
            <Calendar
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              onDayPress={day => this.onDayPress(day)}
              style={styles.calendar}
              hideExtraDays
              markedDates={{ [this.state.selected]: { selected: true, disableTouchEvent: true, selectedColor: '#115ECD' } }}
            />
          </View>]}
      </SalonModal>
    );
  }
}

SalonDatePicker.propTypes = {
  onPress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

SalonDatePicker.defaultProps = {
  isVisible: false,
  minDate: null,
  maxDate: null,
};

export default SalonDatePicker;
