import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../../../components/UI/Icon';
import styles from './styles';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

class QueueNavButton extends React.PureComponent {
  render() {
    return (
      <SalonTouchableOpacity onPress={this.props.onPress} style={[{ justifyContent: 'flex-end' }, this.props.style]}>
        <View style={{ height: 20, width: 20 }}>
          <Icon name={this.props.icon} type={this.props.type} style={styles.navButton} />
        </View>
      </SalonTouchableOpacity>
    );
  }
}

QueueNavButton.defaultProps = {

};

QueueNavButton.propTypes = {
  icon: PropTypes.any.isRequired,
  onPress: PropTypes.any.isRequired,
  style: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
};

export default QueueNavButton;
