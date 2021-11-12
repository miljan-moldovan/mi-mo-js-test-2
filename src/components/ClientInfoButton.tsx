import * as React from 'react';
import { Image, Alert, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tasks } from '@/constants/Tasks';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';
import { checkRestrictionsClientInfo } from '@/redux/actions/restrictions';
import SalonTouchableOpacity from './SalonTouchableOpacity';
import styles from './style';

const infoCircleImage = require('../assets/images/icons/icon_info_circle.png');

class ClientInfoButton extends React.Component<any, any> {
  static defaultProps = {
    iconStyle: {},
    buttonStyle: {},
    canDelete: false,
    onDismiss: () => {},
  };

  static propTypes = {
    iconStyle: PropTypes.any,
    buttonStyle: PropTypes.any,
    apptBook: PropTypes.bool.isRequired,
    canDelete: PropTypes.bool,
    onDonePress: PropTypes.func.isRequired,
    onDismiss: PropTypes.func,
    client: PropTypes.any.isRequired,
    navigation: PropTypes.any.isRequired,
    checkRestrictionsCancelBlockTime: PropTypes.func.isRequired,
    checkRestrictionsModifyBlockTime: PropTypes.func.isRequired,
    clientInfoIsDisabled: PropTypes.bool.isRequired,
    clientInfoIsLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {}

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
        {
          client.id > 1 ? // is not walkin
          (
            <SalonTouchableOpacity
              style={buttonStyle}
              onPress={() => this.props.checkRestrictionsClientInfo(this.goToClientInfo)}
              disabled={this.props.clientInfoIsDisabled}
            >
              {
                this.props.clientInfoIsLoading ?
                (
                  <View style={[styles.infoIconStyle, iconStyle]}>
                    <ActivityIndicator />
                  </View>
                )
                  :
                (
                  <Image
                    style={[styles.infoIconStyle, iconStyle]}
                    source={infoCircleImage}
                  />
                )
              }
            </SalonTouchableOpacity>
          )
        :
          null
        }
      </React.Fragment>
    );
  }
}

const mapActionsToProps = dispatch => ({
  checkRestrictionsClientInfo: (callback) => dispatch(checkRestrictionsClientInfo(callback)),
});

const mapStateToProps = state => ({
  clientInfoIsDisabled: restrictionsDisabledSelector(state, Tasks.Clients_Info),
  clientInfoIsLoading: restrictionsLoadingSelector(state, Tasks.Clients_Info),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientInfoButton);
