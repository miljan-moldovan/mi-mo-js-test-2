import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';

import SalonTouchableOpacity from '../SalonTouchableOpacity';


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    zIndex: 9999,
  },
  bodyContainer: {
    borderRadius: 10,
    minHeight: 243,
    width: 270,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  footer: {
    height: 50,
    borderTopColor: '#3F3F3F',
    borderTopWidth: StyleSheet.hairlineWidth / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  rightBorder: {
    borderRightColor: '#3F3F3F',
    borderRightWidth: StyleSheet.hairlineWidth / 2,
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    height: 133,
  },
  textArea: {
    height: 123,
    paddingVertical: 5,
    paddingRight: 5,
  },
  textAreaContainer: {
    borderColor: '#8E8E93',
    borderWidth: StyleSheet.hairlineWidth / 2,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    color: '#115ECD',
    fontFamily: 'Roboto',
    paddingHorizontal: 5,
  },
  description: {
    fontSize: 13,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto',
    paddingHorizontal: 5,
  },
  footerButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  textCancel: {
    fontSize: 17,
    lineHeight: 22,
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
  },
  textOk: {
    fontSize: 17,
    lineHeight: 22,
    color: '#115ECD',
    fontFamily: 'Roboto-Medium',
  },
});

export default class SalonInputModal extends React.Component {
  state = {
    value: '',
    visible: false,
  }

  onPressOk = () => this.props.onPressOk(this.state.value)
  onPressCancel = () => {
    this.setState({ value: '' });
    this.props.onPressCancel();
  }

  onshow = () => {
    if (this.input) {
      this.input.focus();
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.visible && newProps.visible) {
      this.setState({ visible: true });
    } else if (this.state.visible && !newProps.visible) {
      this.setState({ visible: false });
    }
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        style={{ marginBottom: 60 }}
        onShow={this.onshow}
      >
        <View style={[
          styles.container,
        ]}
        >
          <View style={styles.bodyContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{this.props.title}</Text>
              {this.props.description ?
                <Text style={styles.description}>{this.props.description}</Text>
                : null
              }
            </View>
            <View style={styles.body}>
              <View style={styles.textAreaContainer}>
                <TextInput
                  ref={(input) => { this.input = input; }}
                  style={styles.textArea}
                  multiline
                  autoGrow
                  numberOfLines={20}
                  placeholderTextColor="#727A8F"
                  placeholder={this.props.placeholder}
                  onChangeText={value => this.setState({ value })}
                  value={this.state.value}
                />
              </View>
            </View>
            <View style={styles.footer}>
              <SalonTouchableOpacity
                style={[styles.footerButton, styles.rightBorder]}
                onPress={this.onPressCancel}
              >
                <Text style={styles.textCancel}>Cancel
                </Text>
              </SalonTouchableOpacity>
              <SalonTouchableOpacity
                style={styles.footerButton}
                onPress={this.onPressOk}
              >
                <Text style={styles.textOk}>Ok
                </Text>
              </SalonTouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
