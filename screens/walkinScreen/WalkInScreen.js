import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import rightArrow from '../../assets/images/walkinScreen/icon_arrow_right_xs.png';
import serchImage from '../../assets/images/walkinScreen/icon_search_w.png';
import AvatarWrapper from '../../components/avatarWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f4',
  },
  titleContainer: {
    backgroundColor: '#f3f3f4',
    flex: 7,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  inputContainer: {
    flex: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
  },
  listItemContainer: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#1D1D2626',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  btnContainer: {
    flex: 10,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    color: '#000',
    letterSpacing: 1,
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#000',
  },
  textBtn: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
  },
  searchImage: {
    tintColor: '#231F20',
  },
  serviceDuration: {
    flex: 0,
    fontSize: 12,
    opacity: 0.6,
  },
  servicePrice: {
    color: '#B2AFAA',
    fontSize: 16,
    lineHeight: 18,
    marginRight: 10,
    fontFamily: 'OpenSans-SemiBold',
  },
  subTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#000000',
    opacity: 0.4,
    marginBottom: 5,
  },
  providerImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  providerRound: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  // providerImage: {
  //   borderRadius: 15,
  //   height: 30,
  //   width: 30,
  // },
  providerData: {
    marginLeft: 15,
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  providerName: {
    color: '#1D1D26',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
});

class WalkInScreen extends Component {
  componentWillMount() {
  }

  componentDidMount() {
  }

  renderTitle = title => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  renderServiceButton = () => {
    if (this.props.walkInState.selectedService !== null) {
      return (
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={this.handlePressService}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.textInput}>{this.props.walkInState.selectedService.name}</Text>
            <Text style={styles.serviceDuration}>{this.props.walkInState.selectedService.duration}min</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.servicePrice}>$39</Text>
            <Image source={rightArrow} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => {
          const { navigate } = this.props.navigation;

          this.props.walkInActions.setCurrentStep(1);
          navigate('Services');
        }}
      >
        <Text style={styles.textInput}>Service</Text>
        <Image source={rightArrow} />
      </TouchableOpacity>
    );
  }

  handlePressService = () => {
    const { navigate } = this.props.navigation;
    const { selectedService } = this.props.walkInState;
    this.props.walkInActions.setCurrentStep(3);

    if (selectedService) {
      navigate('Services', { actionType: 'update' });
    } else {
      navigate('Services');
    }
  }

  renderProviderButton = () => {
    if (this.props.walkInState.selectedProvider !== null) {
      return (
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={this.handlePressProvider}
        >
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.subTitle}>PROVIDER</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.providerImageContainer}>
                <AvatarWrapper width={30} wrapperStyle={styles.providerRound} image={this.props.walkInState.selectedProvider.imagePath} />
              </View>
              <View style={styles.providerData}>
                <Text style={styles.providerName}>{this.props.walkInState.selectedProvider.name}</Text>
              </View>
            </View>
          </View>
          <Image source={rightArrow} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={this.handlePressProvider}
      >
        <Text style={styles.textInput}>Provider</Text>
        <Image source={rightArrow} />
      </TouchableOpacity>
    );
  }

  handlePressProvider = () => {
    const { navigate } = this.props.navigation;
    const { selectedProvider } = this.props.walkInState;

    this.props.walkInActions.setCurrentStep(3);
    if (selectedProvider) {
      navigate('Providers', { actionType: 'update' });
    } else {
      navigate('Providers');
    }
  }

  renderPromoButton = () => {
    const { selectedPromotion } = this.props.walkInState;

    if (selectedPromotion) {
      return (
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={this.handlePressPromo}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.subTitle}>PROMO</Text>
            <Text style={styles.textInput}>{selectedPromotion.name}</Text>
          </View>
          <Image source={rightArrow} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={this.handlePressPromo}
      >
        <Text style={styles.textInput}>Promo</Text>
        <Image source={rightArrow} />
      </TouchableOpacity>
    );
  }

  handlePressPromo = () => {
    const { navigate } = this.props.navigation;
    const { selectedPromotion } = this.props.walkInState;

    this.props.walkInActions.setCurrentStep(4);
    if (selectedPromotion) {
      navigate('Promotions', { actionType: 'update' });
    } else {
      navigate('Promotions');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTitle('CLIENT INFO')}
        <View style={styles.listItemContainer}>
          <Text style={styles.textInput}>Client</Text>
          <Image style={styles.searchImage} source={serchImage} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInput}>Email</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInput}>Phone</Text>
        </View>
        {this.renderTitle('SERVICE')}
        {this.renderServiceButton()}
        {this.renderProviderButton()}
        {this.renderPromoButton()}
        <View style={styles.btnContainer}>
          <Text style={styles.textBtn}>ADD TO QUEUE</Text>
        </View>
      </View>
    );
  }
}

export default WalkInScreen;
