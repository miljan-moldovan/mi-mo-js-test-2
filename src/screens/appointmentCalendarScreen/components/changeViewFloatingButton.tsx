import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import FloatingButton from '../../../components/FloatingButton';
import Icon from '@/components/common/Icon';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  numberContainer: {
    zIndex: 9999,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    borderColor: '#1DBF12',
    borderWidth: 1,
    width: 13,
    height: 12,
  },
  numberText: {
    color: '#1DBF12',
    fontSize: 8,
    lineHeight: 9,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: '#FFFFFF',
  },
});

class ChangeViewFloatingButton extends React.Component {
  handlePress = () => {
    if (this.props.handlePress) {
      this.props.handlePress();
    }
  };

  render() {
    return (
      <FloatingButton
        handlePress={this.handlePress}
        rootStyle={{
          width: 70,
          height: 70,
          backgroundColor: '#1DBF12',
          bottom: this.props.bottomDistance,
          right: 16,
        }}
      >
        {this.props.pickerMode === 'day'
          ? <View>
            <View
              style={[
                styles.numberContainer,
                { marginTop: 12, marginLeft: 12 },
              ]}
            >
              <Text style={styles.numberText}>7</Text>
            </View>

            <View style={styles.container}>
              <Icon name="calendar" size={21} color="#FFFFFF" />
              <Text style={styles.text}>Week</Text>
            </View>
          </View>
          : <View>
            <View
              style={[
                styles.numberContainer,
                { marginTop: 7, marginLeft: 2.5 },
              ]}
            >
              <Text style={styles.numberText}>1</Text>
            </View>
            <View style={styles.container}>
              <Icon name="calendarO" size={21} color="#FFFFFF" type="solid" />
              <Text style={styles.text}>Day</Text>
            </View>
          </View>}
      </FloatingButton>
    );
  }
}

ChangeViewFloatingButton.defaultProps = {
  pickerMode: 'day',
  bottomDistance: 16,
};

ChangeViewFloatingButton.propTypes = {
  bottomDistance: PropTypes.number,
  pickerMode: PropTypes.string,
};

export default ChangeViewFloatingButton;
