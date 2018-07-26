import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import moment from 'moment';
import {
  isFunction,
} from 'lodash';

import SalonTouchableOpacity from '../SalonTouchableOpacity';
import Icon from '../UI/Icon';
import Picker from '../../node_modules/react-native-wheel-datepicker/src/picker';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'flex-end',
    flex: 1,
  },
  header: {
    backgroundColor: '#FAFAF8',
    height: 37,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#C3C3C1',
    borderBottomWidth: 1,
    borderBottomColor: '#C3C3C1',
  },
  body: {
    backgroundColor: '#fff',
    // paddingHorizontal: 17,
  },
});

export default class SalonModalPicker extends React.Component {
  state = {
    isAnimating: false,
    height: new Animated.Value(0),
  };

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      this.showPanel();
    } else if (this.props.visible && !newProps.visible) {
      this.hidePanel();
    }
  }

  animateHeight = value => Animated.timing(
    this.state.height,
    {
      toValue: value,
      duration: 300,
    },
  )

  showPanel = () => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        this.animateHeight(580).start(() => {
          this.props.show();
          this.setState({ isAnimating: false });
        });
      });
    }
    return this;
  }

  hidePanel = (callback = false) => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        this.animateHeight(0).start(() => {
          this.props.hide();
          this.setState({ isAnimating: false }, () => (isFunction(callback) ? callback() : null));
        });
      });
    }

    return this;
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        style={{ marginBottom: 60 }}
      >
        <View style={[
          styles.container,
        ]}
        >
          <TouchableWithoutFeedback onPress={() => this.hidePanel()}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          </TouchableWithoutFeedback>
          <Animated.View style={{
            maxHeight: this.state.height,
          }}
          >
            <View style={styles.header}>
              <View style={{ flexDirection: 'row' }}>
                <SalonTouchableOpacity
                  onPress={() => this.minusOne()}
                >
                  <Icon
                    name="chevronLeft"
                    type="thin"
                  />
                </SalonTouchableOpacity>
                <SalonTouchableOpacity
                  onPress={() => this.minusOne()}
                >
                  <Icon
                    name="chevronLeft"
                    type="thin"
                  />
                </SalonTouchableOpacity>
              </View>
              <SalonTouchableOpacity
                style={{ alignSelf: 'flex-end' }}
                onPress={() => this.hidePanel()}
              >
                <Text style={{
                  color: '#007AFF',
                  fontSize: 15,
                  lineHeight: 18,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'right',
                }}
                >
                  Done
                </Text>
              </SalonTouchableOpacity>
            </View>
            <View style={styles.body}>
              <Picker
                style={{ height: 200, backgroundColor: 'white' }}
                pickerData={this.props.pickerData}
                selectedValue={this.props.selectedValue}
                onValueChange={value => this.props.onValueChange(value)}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
