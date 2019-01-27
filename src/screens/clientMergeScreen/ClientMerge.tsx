// @flow
import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { get, filter, remove } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';


class ClientMergeItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  _onPressSelectMain = () => {
    this.props.onPressSelectMain(this.props.id);
  }
  renderMainIcon = () => {
    const { selected, main } = this.props;
    if (!selected) { return null; }
    return (
      <SalonTouchableOpacity onPress={this._onPressSelectMain} style={styles.checkboxContainerTouchable}>
        <View style={[styles.checkboxContainer, main ? { backgroundColor: '#1DBF12' } : null]}>
          <View style={[styles.checkbox, main ? { borderColor: 'transparent' } : null]}>
            {main ? (
              <FontAwesome style={{
                fontSize: 9,
                color: '#fff',
                fontWeight: '100',
                fontFamily: 'FontAwesome5ProLight',
              }}
              >{Icons.check}
              </FontAwesome>

            ) : null}
          </View>
          <Text style={[styles.checkboxLabel, main ? { color: '#fff' } : null]}>Main</Text>
        </View>
      </SalonTouchableOpacity>
    );
  }
  renderCheckContainer = () => {
    const { selected } = this.props;
    return (
      <View style={styles.checkContainer}>
        {/* <Icon
          name={selected ? 'checkCircle' : 'circle'}
          type={selected ? 'regularFree' : 'solid'}
          size={selected ? 23 : 20}
          color={selected ? '#2BBA11' : '#727A8F'}
        /> */}


        <FontAwesome style={{
          fontSize: selected ? 23 : 20,
          color: selected ? '#2BBA11' : '#727A8F',
          fontWeight: selected ? '900' : '100',
          fontFamily: selected ? 'FontAwesome5ProSolid' : 'FontAwesome5ProLight',
        }}
        >{selected ? Icons.checkCircle : Icons.circle}
        </FontAwesome>
      </View>
    );
  }

  render() {
    const { selected, index, type } = this.props;
    // const { id, fullName, phone, zip, email} = this.props.item;
    const {
      id, firstName, middleName, lastName, phone, zip, email,
    } = this.props.item;
    const fullName = `${firstName || ''} ${middleName ? `${middleName} ` : ''}${lastName || ''}`;
    return (
      <SalonTouchableOpacity style={styles.itemContainer} key={id} onPress={this._onPress}>
        {this.renderCheckContainer()}
        <View style={styles.itemSummary}>
          <View style={{ width: '100%' }}>
            <Text style={styles.clientName} numberOfLines={2} ellipsizemode="middle">{fullName}</Text>
            <View style={styles.clientMobileAddress}>
              <FontAwesome style={{
                fontSize: 16,
                color: '#4D5067',
                fontWeight: '100',
                fontFamily: 'FontAwesome',
                marginRight: 5,
              }}
              >{Icons.mobile}
              </FontAwesome>
              <Text style={styles.clientMobileAddressText} numberOfLines={1} ellipsizeMode="tail">
                {phone}
              </Text>
              <FontAwesome style={{
                marginRight: 4,
                marginLeft: 16,
                fontSize: 12,
                color: '#4D5067',
                fontWeight: '100',
                fontFamily: 'FontAwesome5ProLight',
              }}
              >{Icons.home}
              </FontAwesome>

              <Text style={styles.clientMobileAddressText} numberOfLines={1} ellipsizeMode="tail">
                {zip}
              </Text>
            </View>
            <Text style={styles.clientEmail} numberOfLines={1} ellipsizeMode="tail">{email}</Text>
          </View>
          {this.renderMainIcon()}
        </View>
      </SalonTouchableOpacity>
    );
  }
}


export class ClientMerge extends React.Component {
  state = {
    refreshing: false,
    data: [],
    mainClient: null,
    selected: new Map(),
  }
  componentWillMount() {
    // this.setState({ data: this.props.data });
    this._onPressItem(this.props.mainClient);
  }
  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.data !== this.props.data) {
      // this.setState({ data: nextProps.data });
      this._onPressItem(this.props.mainClient);
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    // FIXME this._refreshData();
    // emulate refresh call
    setTimeout(() => this.setState({ refreshing: false }), 500);
  }
  _onPressItem = (id: string) => {
    //
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle

      // if (this.props.onChangeMergeClients) {
      const selectedArray = [];
      selected.forEach((value, key) => {
        if (value) { selectedArray.push(key); }
      });
      // const mainClient = selectedArray[0];
      let { mainClient } = this.state;

      if (selectedArray.length == 0) {
        // if no one is selected, clear group leader
        mainClient = '';
      } else if (mainClient == '') {
        // if no groupLeader is selected, set current item as the leader (so the first person selected will be the default leader)
        mainClient = id;
      } else if (!selectedArray.includes(mainClient)) {
        // if the previous group leader was unselected, the first selected person from the list will be the leader
        mainClient = selectedArray[0];
      }

      if (this.props.onChangeMergeClients) {
        this.props.onChangeMergeClients(selectedArray, mainClient);
      }

      let rest = filter(this.props.data, currentObject => currentObject.id !== mainClient);

      const main = filter(this.props.data, currentObject => currentObject.id === mainClient);

      rest = [...main, ...rest];

      return { selected, mainClient, data: rest };
    });
  };
  _onPressSelectMain = (id: string) => {
    //
    this.setState({ mainClient: id });
    this.props.onChangeMergeClients(null, id);
  }
  renderItem = ({ item, index }) => (
    <ClientMergeItem
      id={item.id}
      onPressItem={this._onPressItem}
      onPressSelectMain={this._onPressSelectMain}
      selected={!!this.state.selected.get(item.id)}
      main={this.state.mainClient == item.id}
      item={item}
    />
  );

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <FlatList
        renderItem={this.renderItem}
        data={this.state.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        style={{ marginBottom: 28, marginTop: 5 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  itemContainer: {
    // minHeight: 100,
    flex: 1,
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  itemSummary: {
    paddingLeft: 8,
    marginRight: 'auto',
    // paddingRight: 10,
    flex: 1,
    height: '100%',
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    left: 1,
  },
  listItem: {
    // height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: 44,
    // height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#F8F8F8',
    borderRightColor: '#EFEFEF',
    borderRightWidth: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftColor: 'transparent',
    borderLeftWidth: 1,
  },
  checkboxContainerTouchable: {
    marginLeft: 'auto',
    height: '100%',
  },
  checkboxContainer: {
    borderRadius: 4,
    height: 24,
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginRight: 16,
    marginLeft: 6,
    marginBottom: 'auto',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#C0C1C6',
    borderRadius: 4,
    width: 15,
    height: 15,
    marginVertical: 4.5,
    marginLeft: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 10,
    color: '#727A8F',
    margin: 7,
    fontFamily: 'Roboto-Regular',
  },
  clientName: {
    fontWeight: '500',
    color: '#111415',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginTop: 14,
    width: '75%',
  },
  clientMobileAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  clientMobileAddressText: {
    color: '#4D5067',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
  },
  clientEmail: {
    color: '#4D5067',
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
    marginBottom: 14,
  },
});
