import * as React from 'react';
import { Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';
import styles from './style';

const infoCircleImage = require('../assets/images/icons/icon_info_circle.png');

class ClientInfoButton extends React.Component<any, any> {
  componentDidMount() {

  }

  goToClientInfo = () => {
    if (this.props.client.isDeleted) {
      Alert.alert('The client was deleted');
    }else {
      this.props.navigation.navigate('ClientInfo', {
        client: this.props.client,
        apptBook: this.props.apptBook,
        canDelete: this.props.canDelete,
        onDismiss: this.props.onDismiss,
      });
      if (this.props.onDonePress) {
        this.props.onDonePress();
      }
    }

  };

  render() {
    const { client, iconStyle, buttonStyle } = this.props;
    return (
      <React.Fragment>
        {client.id > 1 ? // is not walkin
          <SalonTouchableOpacity style={buttonStyle} onPress={this.goToClientInfo}>
            <Image
              style={[styles.infoIconStyle, iconStyle]}
              source={infoCircleImage}
            />
          </SalonTouchableOpacity>
        : null}
      </React.Fragment>
    );
  }
}

ClientInfoButton.defaultProps = {
  iconStyle: { },
  buttonStyle: {},
  canDelete: false,
  onDismiss: () => {},
};

ClientInfoButton.propTypes = {
  iconStyle: PropTypes.any,
  buttonStyle: PropTypes.any,
  apptBook: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool,
  onDonePress: PropTypes.func.isRequired,
  onDismiss: PropTypes.func,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};


export default ClientInfoButton;
