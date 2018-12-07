import * as React from 'react';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SalonTouchableOpacity from './SalonTouchableOpacity';

class ClientInfoButton extends React.Component {
  componentDidMount() {

  }

  goToClientInfo = () => {
    this.props.navigation.navigate('ClientInfo', {
      client: this.props.client,
      apptBook: this.props.apptBook,
      canDelete: this.props.canDelete,
    });
    if (this.props.onDonePress) {
      this.props.onDonePress();
    }
  };

  render() {
    const { client, iconStyle, buttonStyle } = this.props;
    return (
      <React.Fragment>
        {client.id > 1 ? // is not walkin
          <SalonTouchableOpacity style={buttonStyle} onPress={this.goToClientInfo}>
            <FontAwesome style={[{
             fontSize: 18, color: '#115ECD', fontWeight: '100', fontFamily: 'FontAwesome5ProLight',
            }, iconStyle]}
            >
              {Icons.infoCircle}
            </FontAwesome>

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
};

ClientInfoButton.propTypes = {
  iconStyle: PropTypes.any,
  buttonStyle: PropTypes.any,
  apptBook: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool,
  onDonePress: PropTypes.func.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};


export default ClientInfoButton;
