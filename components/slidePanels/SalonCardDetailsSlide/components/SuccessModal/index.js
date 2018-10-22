import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { InputButton } from '../../../../formHelpers';

class SuccessModal extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.show && !this.props.show) {
      this.timerId = setTimeout(this.props.hide, 5000);
    }
    return true;
  }

  timerId = null;

  handleHideModal = () => {
    clearTimeout(this.timerId);
    this.props.hide();
  }

  render() {
    return (
      <View style={[styles.mainContainer, !this.props.show && styles.mainContainerHide]}>
        <View style={styles.content}>
          <Text style={styles.text}>
            {this.props.text}
          </Text>
          <InputButton
            onPress={this.handleHideModal}
            icon={false}
            style={styles.button}
          ><Text style={styles.buttonText}>DISMISS</Text>
          </InputButton>
        </View>
      </View>
    );
  }
}

SuccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default SuccessModal;
