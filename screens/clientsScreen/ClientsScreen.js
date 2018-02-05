// @flow
import React from 'react';
import {
  StyleSheet,
  View, Text,
  Image, SectionList, TouchableOpacity,
} from 'react-native';

import * as actions from '../../actions/clients';
import SideMenuItem from '../../components/SideMenuItem';
import ClientList from '../../components/clientList';
import PrepareClients from '../../components/clientList/prepareClients';
import FloatingButton from '../../components/FloatingButton';
import CustomModal from '../../components/CustomModal';

const mockDataClients = require('../../mockData/clients.json');

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  clientListContainer: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  phoneToolBar: {
    flex: 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  clientsHeader: {
    flex: 1.6,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    flexDirection: 'column',
  },
  clientsList: {
    flex: 9,
    backgroundColor: 'white',
  },
  clientList: {

  },
  clientsHeaderTopSection: {
    flex: 1,
    flexDirection: 'row',
  },
  backIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonCoontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  backText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  newClientContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newClient: {
    // marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
  },
  backIcon: {
    marginTop: 20,
    width: 15,
    height: 15,
  },
  clientsBarBottomSection: {
    flex: 1,
    flexDirection: 'row',
  },
  seachBar: {
    flexDirection: 'row',
    flex: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  topSearchBar: {
    flex: 0.13,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1 / 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  newClientIcon: {
    height: 25,
    width: 21,
  },
  filterModal: {
    padding: 10,
    margin: 0,
    left: 0,
    width: '100%',
    height: 439,
  },
  filterModalContent: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterModalList: {
    left: 0,
    borderRadius: 4,
    width: '100%',
    height: 439,
  },
  modalHeader: {
    height: 40,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalHeaderText: {
    color: '#333B3E',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  modalLine: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalLineText: {
    color: '#333B3E',
    fontSize: 13,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
    flex: 3,
  },
  modalLineImage: {
    width: 18,
    height: 18,
    marginRight: 30,
  },
});


class ClientsScreen extends React.Component {
  static navigationOptions = {

    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Clients"
        icon={require('../../assets/images/sidemenu/icon_appoint_menu.png')}
      />
    ),
  };


  static renderModalHeader(section) {
    return (
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderText}>
          {section.title.toUpperCase()}
        </Text>
      </View>);
  }


  constructor(props) {
    super(props);
    const sortTypes = PrepareClients.getSortTypes();
    const filterTypes = PrepareClients.getFilterTypes();
    const prepareClients = PrepareClients.applyFilter(
      mockDataClients,
      [sortTypes[0], filterTypes[0]],
    );

    this.props.clientsActions.setSubtitle(`${mockDataClients.length} clients`);
    this.props.clientsActions.setPreparedClients(prepareClients.prepared);
    this.props.clientsActions.setClients(prepareClients.clients);
    this.props.clientsActions.setListItem(prepareClients.listItem);
    this.props.clientsActions.setHeaderItem(prepareClients.headerItem);
    this.props.clientsActions.setShowLateralList(prepareClients.showLateralList);
    this.props.clientsActions.setSearchText('');
    this.props.clientsActions.setShowFilterModal(false);
    this.props.clientsActions.setSort(sortTypes[0]);
    this.props.clientsActions.setFilter(filterTypes[0]);
    this.props.clientsActions.setSortTypes(sortTypes);
    this.props.clientsActions.setFilterTypes(filterTypes);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      onChangeText: searchText => this.filterClients(searchText),
      handlePress: () => this.showFilterModal(),
    });

    this.props.clientsActions.setFilteredClients(this.props.clientsState.clients);
  }

  componentDidMount() {
  }

  showFilterModal() {
    this.props.clientsActions.setShowFilterModal(true);
  }

  hideFilterModal() {
    this.props.clientsActions.setShowFilterModal(false);
  }

  filterClients(searchText) {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];

      const filtered = PrepareClients.flexFilter(this.props.clientsState.clients, criteria);

      const prepareClients = PrepareClients.applyFilter(
        filtered,
        [this.props.clientsState.selectedFilter, this.props.clientsState.selectedSort],
      );

      this.props.clientsActions.setFilteredClients(filtered);
      this.props.clientsActions.setSearchText(searchText);
      this.props.clientsActions.setPreparedClients(prepareClients.prepared);
    } else {
      const prepareClients = PrepareClients.applyFilter(
        this.props.clientsState.clients,
        [this.props.clientsState.selectedFilter, this.props.clientsState.selectedSort],
      );

      this.props.clientsActions.setFilteredClients(this.props.clientsState.clients);
      this.props.clientsActions.setSearchText(searchText);
      this.props.clientsActions.setPreparedClients(prepareClients.prepared);
    }
  }

  handleNewClientPress() {
    return this;
  }

  selectFilter(item) {
    if (item.type === 'sort') {
      this.props.clientsActions.setSubtitle(`Sorted by: ${item.name}`);

      this.props.clientsActions.setSort(item);

      const prepareClients = PrepareClients.applyFilter(
        mockDataClients,
        [this.props.clientsState.selectedFilter, item],
      );

      this.props.clientsActions.setFilteredClients(prepareClients.clients);
      this.props.clientsActions.setPreparedClients(prepareClients.prepared);
      this.props.clientsActions.setListItem(prepareClients.listItem);
      this.props.clientsActions.setHeaderItem(prepareClients.headerItem);
      this.props.clientsActions.setShowLateralList(prepareClients.showLateralList);
    } else if (item.type === 'userType') {
      if (this.props.clientsState.selectedFilter.id === item.id) {
        this.props.clientsActions.setFilter({});
      } else {
        this.props.clientsActions.setFilter(item);
      }

      const prepareClients = PrepareClients.applyFilter(
        mockDataClients,
        [item, this.props.clientsState.selectedSort],
      );

      this.props.clientsActions.setFilteredClients(prepareClients.clients);
      this.props.clientsActions.setPreparedClients(prepareClients.prepared);
      this.props.clientsActions.setListItem(prepareClients.listItem);
      this.props.clientsActions.setHeaderItem(prepareClients.headerItem);
      this.props.clientsActions.setShowLateralList(prepareClients.showLateralList);
    }


    this.hideFilterModal();
  }

  renderModalLine(item) {
    const selectFilter = item.type === 'sort' ? this.props.clientsState.selectedSort : this.props.clientsState.selectedFilter;

    return (
      <TouchableOpacity
        key={`${item.type}_${item.id}`}
        style={styles.modalLine}
        onPress={() => this.selectFilter(item)}
      >
        <Text style={styles.modalLineText}>{item.name.toUpperCase()}</Text>

        {selectFilter.id === item.id &&
          <Image
            style={styles.modalLineImage}
            source={require('../../assets/images/clients/icon_check_2.png')}
          />
        }
      </TouchableOpacity>);
  }


  render() {
    return (
      <View style={styles.container}>

        <CustomModal
          style={styles.filterModal}
          contentStyle={styles.filterModalContent}
          isVisible={this.props.clientsState.showFilterModal}
          closeModal={() => this.hideFilterModal()}
        >
          <SectionList
            scrollEnabled={false}
            style={styles.filterModalList}
            renderItem={({ item }) => this.renderModalLine(item)}
            renderSectionHeader={({ section }) => ClientsScreen.renderModalHeader(section)}
            sections={[
              {
                  data: this.props.clientsState.sortTypes,
                  title: 'SORT BY',
              },
              {
                  data: this.props.clientsState.filterTypes,
                  title: '',
              },
            ]}
          />


        </CustomModal>


        <View style={styles.clientsList}>


          <ClientList
            listItem={this.props.clientsState.listItem}
            headerItem={this.props.clientsState.headerItem}
            boldWords={this.props.clientsState.searchText}
            clients={this.props.clientsState.prepared}
            style={styles.clientListContainer}
            showLateralList={this.props.clientsState.showLateralList}
          />


        </View>
        <FloatingButton handlePress={this.handleNewClientPress}>
          <Image
            style={styles.newClientIcon}
            source={require('../../assets/images/clients/icon_plus_quantity.png')}
          />
        </FloatingButton>
      </View>
    );
  }
}
export default ClientsScreen;
