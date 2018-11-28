import * as React from 'react';
import {Text, View, TextInput} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Icon from '@/components/common/Icon';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonActionSheet from '../../../components/SalonActionSheet';
import createStyleSheet from './styles';
import QueueNavButton from './queueNavButton';
import BarsActionSheet from '../../../components/BarsActionSheet';
import * as loginActions from '../../../redux/actions/login';
import storeActions from '../../../redux/actions/store';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;
const options = [
  <View style={createStyleSheet().actionItemContainer}>
    <View style={createStyleSheet().actionItemLeft}>
      <Text style={createStyleSheet().actionItemTitle}>Turn Away</Text>
    </View>
    <View style={createStyleSheet().actionItemRight}>
      <Icon name="ban" type="solid" color="#115ECD" size={16} />
    </View>
  </View>,

  <View style={createStyleSheet().actionItemContainer}>
    <View style={createStyleSheet().actionItemLeft}>
      <Text style={createStyleSheet().actionItemTitle}>Group</Text>
    </View>
    <View style={createStyleSheet().actionItemRight}>
      <Icon name="userPlus" type="solid" color="#115ECD" size={16} />
    </View>
  </View>,
  <Text style={createStyleSheet().cancelTitle}>
    Cancel
  </Text>,
];

interface Props {
  onChangeSearchMode: any;
  onChangeSearchText: any;
  navigation: any;
  storeActions: any;
  auth: any;
  searchText: any;
  searchMode: any;
  navigationState: any;
}

interface State {
  styles: any;
  salonActionSheet?: any;
  barsActionSheet?: any;
}

class QueueHeader extends React.Component<Props, State>  {

  constructor(props: Props) {
    super(props);
    this.state = {
      styles: createStyleSheet(),
      salonActionSheet: null
    };
  }


  onSearchPress = () => this.props.onChangeSearchMode (true);
  onSearchCancel = () => this.props.onChangeSearchMode (false);
  onChangeSearchText = (searchText: String) =>
    this.props.onChangeSearchText (searchText);

  handlePressAction (i) {
    const {navigation} = this.props;
    switch (i) {
      case 0:
        navigation.navigate ('TurnAway', {
          transition: 'SlideFromBottom',
          date: moment (),
          employee: null,
          apptBook: false,
        });
        break;
      case 1:
        navigation.navigate ('QueueCombine', {transition: 'SlideFromBottom'});
        break;
      default:
        break;
    }

    return false;
  }

  handlePress = i => {
    setTimeout (() => {
      this.handlePressAction (i);
    }, 500);
    return false;
  };

  showActionSheet = () => {
    this.state.salonActionSheet.show ();
  };

  showBarsActionSheet = () => {
    this.state.barsActionSheet.show ();
  };

  onLogoutPressed = () => this.props.auth.logout ();

  onChangeStore = () => {
    this.props.storeActions.reselectMainStore ();
  };
  assignBarsActionSheet = item => {
    this.setState({barsActionSheet: item});
  };
  render () {
    if (this.props.navigationState.currentRoute !== 'Main') {
      return null;
    }
    return this.props.searchMode
      ? <View style={[this.state.styles.headerContainer, {height: 52, paddingBottom: 10}]}>

          <View style={this.state.styles.searchContainer}>
            {/* <FontAwesome style={this.state.styles.searchIcon}>{Icons.search}</FontAwesome> */}
            <Icon name="search" type="light" style={this.state.styles.searchIcon} />
            <TextInput
              autoFocus
              style={this.state.styles.search}
              placeholderTextColor="rgba(76,134,217,1)"
              onChangeText={this.onChangeSearchText}
              value={this.props.searchText}
              placeholder="Search"
              returnKeyType="search"
            />
          </View>
          <SalonTouchableOpacity onPress={this.onSearchCancel}>
            <Text
              style={[
                this.state.styles.navButtonText,
                {color: 'white', marginRight: 6, marginLeft: 6},
              ]}
            >
              Cancel
            </Text>
          </SalonTouchableOpacity>

        </View>
      : <View style={[this.state.styles.headerContainer, {height: 44, paddingBottom: 10}]}>

         <SalonActionSheet
            ref={
              o => { 
                if(!this.state.salonActionSheet){
                  this.setState({salonActionSheet:o}) 
                }
              }
            }
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={i => {
              this.handlePress (i);
            }}
            wrapperStyle={{paddingBottom: 11}}
          />

          <BarsActionSheet
            ref={this.assignBarsActionSheet}
            onLogout={this.onLogoutPressed}
            navigation={this.props.navigation}
            onChangeStore={this.onChangeStore}
          />

          <QueueNavButton
            type="solid"
            icon="bars"
            style={{
              alignItems: 'flex-start',
              flex: 1,
              paddingLeft: 8,
              paddingTop: 5,
            }}
            onPress={this.showBarsActionSheet}
          />
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flex: 1,
              paddingRight: 6,
            }}
          >
            <Text style={this.state.styles.headerTitle}>Queue</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flex: 1,
            }}
          >
            <QueueNavButton
              type="solid"
              icon="ellipsisH"
              onPress={this.showActionSheet}
              style={{marginRight: 20, paddingTop: 5}}
            />
            <QueueNavButton
              type="solid"
              icon="search"
              onPress={this.onSearchPress}
              style={{marginRight: 2, paddingTop: 5}}
            />
          </View>
        </View>;
  }
}

const mapStateToProps = state => ({
  navigationState: state.navigationReducer,
});
const mapActionToProps = dispatch => ({
  auth: bindActionCreators ({...loginActions as any}, dispatch),
  storeActions: bindActionCreators ({...storeActions}, dispatch),
});
export default connect (mapStateToProps, mapActionToProps) (QueueHeader);


