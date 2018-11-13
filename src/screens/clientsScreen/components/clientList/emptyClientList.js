import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { get } from 'lodash';
import Icon from '../../../../components/UI/Icon';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import groupedSettingsSelector from '../../../../redux/selectors/settingsSelector';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#C0C1C6',
  },
  textContainer: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#727A8F',
    fontWeight: '500',
    textAlign: 'center',
  },
  textDesc: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#727A8F',
    textAlign: 'center',
  },
  textButton: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: '#115ECD',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 34,
  },
  buttonStyle: {
    borderColor: '#86868A',
    borderWidth: 0.8,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
});

class emptyClientList extends PureComponent {
  addNewClient = () => {
    this.props.navigate('NewClient', { onChangeClient: this.props.onChangeClient });
  };

  walkinClient = () => {
    if (this.props.onWalkinPress) {
      this.props.onWalkinPress(this.props.walkinClient);
    }
  }

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  render() {
    const hideBtn = this.props.isWalkin && get(this.props.settings, '[WalkInMode][0].settingValue', -1) !== 1;
    const btnText = this.props.isWalkin ? 'WALK-IN CLIENT' : 'ADD NEW CLIENT';
    const btnPress = this.props.isWalkin ? this.walkinClient : this.addNewClient;
    return (
      <SalonTouchableOpacity style={styles.container} onPress={this.hideKeyboard}>
        <View style={styles.circle}>
          <Icon color="#C0C1C6" size={50} name="search" type="regular" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Search for clients above.</Text>
          <Text style={styles.textDesc}>Type name, code, phone number or email</Text>
        </View>
        {
          !this.props.hideAddButton && !hideBtn ?
            (
              <View style={styles.buttonContainer}>
                <SalonTouchableOpacity onPress={btnPress} style={styles.buttonStyle}>
                  <Text style={styles.textButton}>{btnText}</Text>
                </SalonTouchableOpacity>
              </View>
            ) : null
        }
      </SalonTouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  settings: groupedSettingsSelector(state),
  walkinClient: state.settingsReducer.walkinClient,
});

export default connect(mapStateToProps)(emptyClientList);
