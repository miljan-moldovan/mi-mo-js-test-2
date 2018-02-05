import React from 'react';
import { View,
  Text,
  TouchableHighlight,
  Dimensions,
  StyleSheet } from 'react-native';
import { LargeList } from 'react-native-largelist';
import { connect } from 'react-redux';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E7E7E7',
  },
  itemSeparator: {
    backgroundColor: '#EEE',
    height: 1,
  },
  lineItemCointainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'transparent',
  },
  noResultsContainer:
  {
    flex: 10000,
    height: '100%',
    width: '100%',
    backgroundColor: '#E7E7E7',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsView: {
    flex: 1,
    marginTop: 150,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  clientList: {
    backgroundColor: '#FFF',
    flex: 10,
  },
  letterList: {
    flex: 0.6,
    backgroundColor: '#FFF',
  },
  list: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  guideContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  letterContainer: {
    backgroundColor: 'transparent',
  },
  topBar: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  // topBarText: {
  //   color: '#1D1D26',
  //   fontSize: 12,
  //   marginLeft: 12,
  //   fontFamily: 'OpenSans-Bold',
  //   backgroundColor: 'transparent',
  // },
  foundLetter: {
    color: '#67A3C7',
    fontSize: 12,
    marginTop: 5,
    marginHorizontal: 5,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  letter: {
    color: '#1D1D26',
    fontSize: 12,
    marginTop: 6,
    marginHorizontal: 12,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  noResults: {
    color: '#3D3C3B',
    fontSize: 30,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  newClientButton: {
    borderRadius: 30,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50,
  },
  newClient: {
    color: '#3078A4',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignSelf: 'center',
  },

  hiddenContainer: {
    top: window.height,
    bottom: -window.height,
    flex: 0,
  },
});

class ClientList extends React.Component {
    selectedIndex: number = 0;
    listRef: LargeList;
    indexes: LargeList;


    constructor(props) {
      super(props);
      const clients = props.clients;

      this.state = {
        clients,
        boldWords: props.boldWords,
        listItem: props.listItem,
        headerItem: props.headerItem,
        showLateralList: props.showLateralList,
      };
    }

    state:{
      clients:[],
      showLateralList: true
    };

    componentWillReceiveProps(nextProps) {
      const clients = nextProps.clients;
      this.setState({
        clients,
        boldWords: nextProps.boldWords,
        listItem: nextProps.listItem,
        headerItem: nextProps.headerItem,
        showLateralList: nextProps.showLateralList,
      });
      this.listRef.reloadData();
      if (nextProps.showLateralList) {
        this.indexes.reloadData();
      }
    }


    getNumberOfSections() {
      return this.state.clients.length;
    }

    getNumberOfRowsInSection(section) {
      return this.state.clients[section].list.length;
    }

    onSectionChange(section:number) {
      this.state.clients[section].selected = true;

      if (this.state.clients[this.selectedIndex]) {
        this.state.clients[this.selectedIndex].selected = false;
      }

      this.selectedIndex = section;
      this.indexes.reloadData();
      let bFind = false;
      this.indexes.visibleIndexPaths().forEach((indexPath) => {
        if (indexPath.row === section) {
          bFind = true;
        }
      });
      if (!bFind) {
        this.indexes.scrollToIndexPath({ section: 0, row: section });
      }
    }


    renderItem(section: number, row: number) {
      const client = this.state.clients[section].list[row];

      return (
        <View key={client.id} style={styles.lineItemCointainer}>
          {React.createElement(this.state.listItem, { boldWords: this.state.boldWords, client })}
        </View>
      );
    }

    renderSection(section: number) {
      //  <Text style={styles.topBarText}>{this.state.clients[section].header}</Text>

      return (
        <View key={section} style={styles.topBar}>
          {React.createElement(
            this.state.headerItem,
            { headerData: this.state.clients[section] },
          )}
        </View>
      );
    }

    renderIndexes(section: number, row: number) {
      const selected = this.state.clients[row].selected;
      return (
        <TouchableHighlight
          key={`${section}_${row}`}
          underlayColor="transparent"
          onPress={() => {
               this.listRef.scrollToIndexPath({ section: row, row: 0 });
                this.state.clients[row].selected = true;
                if (this.state.clients[this.selectedIndex]) {
                  this.state.clients[this.selectedIndex].selected = false;
                }

                this.selectedIndex = row;
                this.indexes.reloadData();
              }}
        >
          <Text style={styles.foundLetter}>
            {this.state.clients[row].header.substring(0, 1)}
          </Text>
        </TouchableHighlight>
      );
    }
    render() {
      return (
        <View style={styles.container}>
          {this.getNumberOfSections() === 0 &&

          <View style={styles.noResultsContainer}>

            <View style={styles.noResultsView}>

              <Text style={styles.noResults}>NO RESULTS</Text>

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {}}
                style={styles.newClientButton}
              >
                <Text style={styles.newClient}>
                    CREATE NEW CLIENT
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          }

          <LargeList
            ref={ref => (this.listRef = ref)}
            style={styles.clientList}
            numberOfSections={() => this.getNumberOfSections()}
            numberOfRowsInSection={section => this.getNumberOfRowsInSection(section)}
            heightForSection={() => 36}
            renderSection={section => this.renderSection(section)}
            heightForCell={() => 96}
            renderCell={(section, row) => this.renderItem(section, row)}
            renderItemSeparator={() => <View style={styles.itemSeparator} />}
            onSectionDidHangOnTop={section => this.onSectionChange(section)}
          />
          <LargeList
            style={[styles.letterList, this.state.showLateralList ? null : styles.hiddenContainer]}
            ref={ref => (this.indexes = ref)}
            numberOfRowsInSection={() => this.state.clients.length}
            heightForCell={() => 22}
            renderCell={(section, row) => this.renderIndexes(section, row)}
            showsVerticalScrollIndicator={false}
            renderItemSeparator={() => <View />}
            bounces={false}
          />
        </View>
      );
    }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientList);
