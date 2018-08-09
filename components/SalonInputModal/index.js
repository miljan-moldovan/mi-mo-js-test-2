import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';

import SalonTouchableOpacity from '../SalonTouchableOpacity';
import styles from './styles';

class SalonInputModal extends React.Component {
  state = {
    value: '',
    visible: false,
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.visible && newProps.visible) {
      this.setState({ visible: true });
    } else if (this.state.visible && !newProps.visible) {
      this.setState({ visible: false });
    }
    if (newProps.value) {
      this.setState({ value: newProps.value });
    }
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

  handleChangeInput = value => this.setState({ value })

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
          <KeyboardAvoidingView
            style={[styles.keyboardContainer, styles.container]}
            behavior="padding"
          >
            <View style={styles.bodyContainer}>
              <View style={styles.header}>
                <Text
                  style={[styles.title, this.props.description ? styles.titleWithDescription : {}]}
                >{this.props.title}
                </Text>
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
                    onChangeText={this.handleChangeInput}
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
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

SalonInputModal.defaultProps = {
  description: null,
  value: '',
  placeholder: '',
};

SalonInputModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onPressOk: PropTypes.func.isRequired,
  onPressCancel: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default SalonInputModal;
