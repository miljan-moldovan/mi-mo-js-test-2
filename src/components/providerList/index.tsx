// @flow
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import SalonAvatar from '../SalonAvatar';
import { Employees } from '../../utilities/apiWrapper';
import getEmployeePhotoSource from '../../utilities/helpers/getEmployeePhotoSource';
import SalonTouchableHighlight from '../SalonTouchableHighlight';

const styles = StyleSheet.create({
  itemSeparator: {
    backgroundColor: '#EEE',
  },
  providersList: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  provider: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  providerImageContainer: {
    flex: 1,
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
  providerData: {
    marginLeft: 15,
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  providerTime: {
    marginLeft: 20,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: 5,
  },
  providerName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  providerPrice: {
    color: '#3D3C3B',
    fontSize: 12,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  providerWaiting: {
    color: '#3D3C3B',
    fontSize: 10,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  providerMinutes: {
    color: '#1D1D26',
    fontSize: 30,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  providerMin: {
    color: '#3D3C3B',
    fontSize: 10,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  selectedProvider: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  selectedProviderName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  selectedProviderPrice: {
    color: 'transparent',
  },
  selectedLeftBar: {
    flex: 1 / 10,
    backgroundColor: '#66D7A2',
  },
  leftBar: {
    flex: 1 / 10,
    backgroundColor: '#FFFFFF',
  },
  firstAvailableText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  firstAvailable: {
    backgroundColor: '#67A3C7',
    borderRadius: 22,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  firstAvailableButton: {
    flex: 1 / 7,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  firstAvailableImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  providerListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
});

class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: props.providers,
      selectedProvider: props.walkInState.selectedProvider,
      selectable: props.selectable,
      refresh: false,
      firstAvailableSelected: false,
    };
  }

  state = {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedProvider: this.props.walkInState.selectedProvider,
      selectable: nextProps.selectable,
      refresh: true,
    });
  }
  _keyExtractor = (item, index) => item.id;

  renderItem(elem) {
    const provider = elem.item;

    let fullName = provider.name;
    fullName += provider.middleName ? ` ${provider.middleName}${provider.lastName}` : ` ${provider.lastName}`;
    const price = `$${provider.price}`;
    let isSelected = false;

    if (this.state.selectable) {
      if (this.state.selectedProvider && provider.id === this.state.selectedProvider.id) {
        isSelected = true;
      }
      this.setState({ refresh: false });
    }

    return (
      <SalonTouchableHighlight
        key={provider.id}
        style={isSelected ? styles.selectedProvider : styles.provider}
        underlayColor="transparent"
        onPress={() => {
          if (this.state.selectable) {
            this.setState({
              refresh: true,
              firstAvailableSelected: false,
            });
            // if onChangeProvider is set, invoke it. Otherwise, default routine
            if (this.props.onChangeProvider) {
              this.props.onChangeProvider(provider);
            } else {
              const { navigate } = this.props.navigation;
              const { params } = this.props.navigation.state;

              this.props.walkInActions.selectProvider(provider);

              if (params !== undefined && params.actionType === 'update') {
                navigate('WalkIn');
              } else {
                this.props.walkInActions.setCurrentStep(4);
                navigate('Promotions');
              }
            }
          }
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>

          <View style={isSelected ? styles.selectedLeftBar : styles.leftBar} />

          <View style={styles.providerImageContainer}>
            <SalonAvatar
              wrapperStyle={styles.providerRound}
              width={44}
              borderWidth={5}
              borderColor={isSelected ? '#66D7A2' : 'transparent'}
              image={getEmployeePhotoSource(provider)}
            />
          </View>
          <View style={styles.providerData}>
            <Text style={isSelected ? styles.selectedProviderName : styles.providerName}>
              {fullName}
            </Text>
            <Text style={isSelected ? styles.selectedProviderPrice : styles.providerPrice}>
              {price}
            </Text>
          </View>
          <View style={styles.providerTime}>
            <Text style={styles.providerWaiting}>Waiting</Text>
            <Text style={styles.providerMinutes}>{provider.minutes}</Text>
            <Text style={styles.providerMin}>min</Text>
          </View>
        </View>
      </SalonTouchableHighlight>
    );
  }
  render() {
    return (

      <View style={styles.providerListContainer}>

        <SalonTouchableHighlight
          style={this.state.firstAvailableSelected ? styles.selectedProvider : styles.provider}
          underlayColor="transparent"
          onPress={() => {
            if (this.state.selectable) {
              this.setState({
                firstAvailableSelected: true,
                selectedProvider: null,
                refresh: true,
              });
            }
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={this.state.firstAvailableSelected ?
              styles.selectedLeftBar : styles.leftBar}
            />

            <View style={styles.firstAvailableImageContainer}>
              <View style={styles.firstAvailable}>
                <Text style={styles.firstAvailableText}>FA</Text>
              </View>
            </View>
            <View style={styles.providerData}>
              <Text style={this.state.firstAvailableSelected ?
                styles.selectedProviderName : styles.providerName}
              >First Available
              </Text>
            </View>
            <View style={styles.providerTime}>
              <Text style={styles.providerWaiting}>Waiting</Text>
              <Text style={styles.providerMinutes}>9</Text>
              <Text style={styles.providerMin}>min</Text>
            </View>
          </View>
        </SalonTouchableHighlight>

        <FlatList
          style={styles.providersList}
          data={this.state.providers}
          extraData={this.state.refresh}
          keyExtractor={this._keyExtractor}
          renderItem={elem => this.renderItem(elem)}
        />
      </View>
    );
  }
}
export default connect(null)(ProviderList);
