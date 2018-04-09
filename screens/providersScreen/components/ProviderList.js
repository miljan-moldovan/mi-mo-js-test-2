// @flow
import React from 'react';
import { View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList } from 'react-native';

import SalonAvatar from '../../../components/SalonAvatar';
import {
  InputLabel,
  InputButton,
  InputGroup,
  InputDivider,
  SectionTitle,
} from '../../../components/formHelpers';
import ListLetterFilter from '../../../components/listLetterFilter';
import apiWrapper from '../../../utilities/apiWrapper';


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
    flexDirection: 'row',
    paddingLeft: 16,
    alignItems: 'center',
  },
  providerRound: {
    alignItems: 'flex-start',
    width: 33,
  },
  providerData: {
    marginLeft: 15,
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  providerTime: {
    flex: 1,
    paddingRight: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  providerName: {
    color: '#1D1D26',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 5,
    fontWeight: '500',
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
    color: '#0C4699',
    fontSize: 11,
    fontFamily: 'Roboto',
  },
  providerMin: {
    color: '#0C4699',
    fontSize: 11,
    fontFamily: 'Roboto',
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
    color: '#110A24',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginLeft: 5,
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
    color: '#115ECD',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  firstAvailableTextRight: {
    color: '#110A24',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginLeft: 6,
  },
  firstAvailable: {
    backgroundColor: '#C3D6F2',
    borderRadius: 16,
    height: 32,
    width: 32,
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
    marginLeft: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  providerListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
});

const label = (
  <View style={styles.firstAvailableImageContainer}>
    <View style={styles.firstAvailable}>
      <Text style={styles.firstAvailableText}>FA</Text>
    </View>
    <Text style={styles.firstAvailableTextRight}>First-Available</Text>
  </View>
);

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

  renderItem = (elem) => {
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
    const itemLabel = (
      <View style={styles.providerImageContainer}>
        <SalonAvatar
          wrapperStyle={styles.providerRound}
          width={32}
          borderWidth={1}
          borderColor={isSelected ? '#66D7A2' : 'transparent'}
          image={{ uri: apiWrapper.getEmployeePhoto(!provider.isFirstAvailable ? provider.id : 0) }}

        />
        <Text style={isSelected ? styles.selectedProviderName : styles.providerName}>
          {fullName}
        </Text>
        <View style={styles.providerTime}>
          <Text style={styles.providerMinutes}>{provider.minutes}</Text>
          <Text style={styles.providerMin}>min</Text>
        </View>
      </View>);
    return (<InputButton label={itemLabel} noIcon />);
    // return (
    //   <TouchableHighlight
    //     key={provider.id}
    //     style={isSelected ? styles.selectedProvider : styles.provider}
    //     underlayColor="transparent"
    //     onPress={() => {
    //       if (this.state.selectable) {
    //         this.setState({
    //           refresh: true,
    //           firstAvailableSelected: false,
    //         });
    //         // if onChangeProvider is set, invoke it. Otherwise, default routine
    //         if (this.props.onChangeProvider) {
    //           this.props.onChangeProvider(provider);
    //         } else {
    //           const { navigate } = this.props.navigation;
    //           const { params } = this.props.navigation.state;
    //
    //           this.props.walkInActions.selectProvider(provider);
    //
    //           if (params !== undefined && params.actionType === 'update') {
    //             navigate('WalkIn');
    //           } else {
    //             this.props.walkInActions.setCurrentStep(4);
    //             navigate('Promotions');
    //           }
    //         }
    //       }
    //     }}
    //   >
    //     <View style={{ flex: 1, flexDirection: 'row' }}>
    //
    //       <View style={isSelected ? styles.selectedLeftBar : styles.leftBar} />
    //
    // <View style={styles.providerImageContainer}>
    //   <SalonAvatar
    //     wrapperStyle={styles.providerRound}
    //     width={44}
    //     borderWidth={5}
    //     borderColor={isSelected ? '#66D7A2' : 'transparent'}
    //     image={{ uri: provider.imagePath }}
    //   />
    // </View>
    // <View style={styles.providerData}>
    //   <Text style={isSelected ? styles.selectedProviderName : styles.providerName}>
    //     {fullName}
    //   </Text>
    //   <Text style={isSelected ? styles.selectedProviderPrice : styles.providerPrice}>
    //     {price}
    //   </Text>
    // </View>
    // <View style={styles.providerTime}>
    //   <Text style={styles.providerWaiting}>Waiting</Text>
    //   <Text style={styles.providerMinutes}>{provider.minutes}</Text>
    //   <Text style={styles.providerMin}>min</Text>
    // </View>
    //     </View>
    //   </TouchableHighlight>
    // );
  }

  renderFirstAvailable = () => (
    <View>
      <InputButton
        label={label}
        noIcon
        onPress={() => {
          if (this.state.selectable) {
            this.setState({
              firstAvailableSelected: true,
              selectedProvider: null,
              refresh: true,
            });
          }
        }}
      />
      <InputDivider />
    </View>
  )

  renderDivider = () => (<InputDivider />)

  render() {
    return (
      <View style={styles.providerListContainer}>
        <FlatList
          style={styles.providersList}
          data={this.state.providers}
          extraData={this.state.refresh}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderFirstAvailable}
          ItemSeparatorComponent={this.renderDivider}
          ListFooterComponent={this.renderDivider}
        />
        <ListLetterFilter />
      </View>
    );
  }
}
export default ProviderList;
