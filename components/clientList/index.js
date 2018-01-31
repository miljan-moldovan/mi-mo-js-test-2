import React from "react";
import {   View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Platform } from "react-native";
import { LargeList } from "react-native-largelist";
import { connect } from 'react-redux';
import ClientListItem from './clientListItem';

class ClientList extends React.Component {
    selectedIndex: number = 0;
    listRef: LargeList;
    indexes: LargeList;

    constructor(props) {
      super(props);

      let clients = props.clients.sort(this._compareByName);
      this.clients = this._clients(clients);
      this.state = { clients: clients, boldWords: props.boldWords };
    }

    componentWillReceiveProps(nextProps){
      let clients = nextProps.clients.sort(this._compareByName);
      this.clients = this._clients(clients);
      this.setState({clients: clients, boldWords: nextProps.boldWords});
      this.listRef.reloadData();
      this.indexes.reloadData();
    }

    _compareByName(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }

    _getByValue(arr, value) {

      for (var i=0, iLen=arr.length; i<iLen; i++) {

        if (arr[i].header == value) return arr[i];
      }
      return null;
    }

    _clients(clients){

       var dataSource = [];

        for (var i = 0; i < clients.length; i++) {
          let client = clients[i];

          var result = this._getByValue(dataSource, client.name.substring(0, 1).toUpperCase());

          if(result){
            result.list.push(client);
          }else{
            dataSource.push({list:[client], header: client.name.substring(0, 1).toUpperCase()});
          }
        }

       return dataSource;
     }

     _getNumberOfSections(){
       return this.clients.length;
     }

    _getNumberOfRowsInSection(section){
      return this.clients[section].list.length;
    }

    render() {
      return (
        <View style={styles.container}>
          {this._getNumberOfSections() === 0 &&

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
            numberOfSections={()=>this._getNumberOfSections()}
            numberOfRowsInSection={section => this._getNumberOfRowsInSection(section)}
            heightForSection={() => 36}
            renderSection={this.renderSection.bind(this)}
            heightForCell={() => 96}
            renderCell={this.renderItem.bind(this)}
            renderItemSeparator={()=> <View style={styles.itemSeparator} /> }
            onSectionDidHangOnTop={this.onSectionChange.bind(this)}
          />
          <LargeList
            style={styles.letterList}
            ref={ref => (this.indexes = ref)}
            numberOfRowsInSection={() => this.clients.length}
            heightForCell={() => 22}
            renderCell={this.renderIndexes.bind(this)}
            showsVerticalScrollIndicator={false}
            renderItemSeparator={()=>< View / >}
            bounces={false}
          />
        </View>
      );
    }

    renderIndexes(section: number, row: number) {
      let selected = this.clients[row].selected;
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
           this.listRef.scrollToIndexPath({ section: row, row: 0 });
            this.clients[row].selected = true;
            if(this.clients[this.selectedIndex]){
              this.clients[this.selectedIndex].selected = false;
            }

            this.selectedIndex = row;
            this.indexes.reloadData();
          }}
        >
          <Text style={styles.foundLetter}>
            {this.clients[row].header}
          </Text>
        </TouchableHighlight>
      );
    }

    renderSection(section: number) {
      return (
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>{this.clients[section].header}</Text>
        </View>
      );
    }

    renderItem(section: number, row: number) {
      let client = this.clients[section].list[row];
      return (
        <View style={styles.lineItemCointainer}>
            <ClientListItem boldWords={this.state.boldWords} client={client}></ClientListItem>
        </View>
      );
    }

    onSectionChange(section:number){

      this.clients[section].selected = true;

      if(this.clients[this.selectedIndex]){
        this.clients[this.selectedIndex].selected = false;
      }

      this.selectedIndex = section;
      this.indexes.reloadData();
      let bFind = false;
      this.indexes.visibleIndexPaths().forEach(indexPath=>{
        if (indexPath.row===section) {
          bFind = true;
        }
      });
      if (!bFind) {
        this.indexes.scrollToIndexPath({section:0,row:section});

      }

    }

  }

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(ClientList);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E7E7E7'
  },
  itemSeparator:{
    backgroundColor: "#EEE",
    height: 1
  },
  lineItemCointainer:{
    flex: 1,
    flexDirection: 'row',
    borderBottomColor:'transparent'
  },
  noResultsContainer:
  {
    flex: 10000,
    height: '100%',
    width: '100%',
    backgroundColor: '#E7E7E7',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center"
  },
  noResultsView:{
    flex: 1,
    marginTop: 150,
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "center"
  },
  clientList:{
    backgroundColor: '#FFF',
    flex: 10
  },
  letterList:{
    flex: 1,
    backgroundColor: '#FFF'
  },
  list:{
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column'
  },
  guideContainer:{
    flex: 1,
    flexDirection: 'column'
  },
  letterContainer:{
    backgroundColor: 'transparent'
  },
  topBar:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarText:{
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 12,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent'
  },
  foundLetter:{
    color: '#67A3C7',
    fontSize: 12,
    marginTop: 5,
    marginHorizontal: 10,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent'
  },
  letter:{
    color: '#1D1D26',
    fontSize: 12,
    marginTop: 6,
    marginHorizontal: 12,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent'
  },
  noResults:{
    color: '#3D3C3B',
    fontSize: 30,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    textAlign:'center',
    alignSelf:'center',
    marginBottom: 20
  },
  newClientButton:{
    borderRadius:30,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50
  },
  newClient:{
    color: '#3078A4',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    textAlign:'center',
    alignSelf:'center',
  }
});
