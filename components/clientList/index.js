import React from 'react';
import { View,
  Text,
  TouchableHighlight,
  Dimensions,
  SectionList,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ClientListItem from '../../components/clientList/clientListItem';
import ClientListHeader from '../../components/clientList/clientListHeader';

const ITEM_HEIGHT = 60;
const HEADER_HEIGHT = 30;
const window = Dimensions.get('window');
const abecedary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
  listContainer: {
    flex: 9,
    flexDirection: 'row',
    height: '100%',
  },
  list: {
    flex: 10,
    backgroundColor: '#FFF',
    height: '100%',
  },
  guideContainer: {
    flex: 1 / 2,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  letterContainer: {
    backgroundColor: 'transparent',
  },
  topBar: {
    height: HEADER_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  foundLetter: {
    color: '#727A8F',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  letter: {
    color: '#727A8F',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  noResults: {
    color: '#3D3C3B',
    fontSize: 30,
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
    alignSelf: 'center',
  },
});

class ClientList extends React.Component {
  static compareByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  static getByValue(arr, value, attr) {
    for (let i = 0, iLen = arr.length; i < iLen; i += 1) {
      if (arr[i][attr] === value) return arr[i];
    }
    return null;
  }


  static clients(clients) {
    const clientsLetters = [];

    // {data: [...], title: ...},

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      const result = ClientList.getByValue(
        clientsLetters,
        client.name.substring(0, 1).toUpperCase(), 'title',
      );

      if (result) {
        result.data.push(client);
      } else {
        clientsLetters.push({ data: [client], title: client.name.substring(0, 1).toUpperCase() });
      }
    }

    return clientsLetters;
  }

  static renderSeparator(show) {
    if (show) {
      return (<View
        style={{
            height: 1,
            width: '100%',
            backgroundColor: '#C0C1C6',
          }}
      />);
    }
    return (null);
  }


  static renderSection(item, showSectionHeader) {
    if (showSectionHeader) {
      return (<View style={styles.topBar}>
        <ClientListHeader header={item.section.title} />
      </View>);
    }
    return (null);
  }


  constructor(props) {
    super(props);

    const clients = props.clients.sort(ClientList.compareByName);

    this.state = {
      clients,
      boldWords: props.boldWords,
      dataSource: ClientList.clients(clients),
      letterGuide: [],
      onPressItem: props.onPressItem,
      showSectionHeader: props.showSectionHeader,
      simpleListItem: props.simpleListItem,
    };
  }

    state:{
      clients:[],
      showLateralList: true,
      showSectionHeader: true,
      simpleListItem: false,
    };


    componentWillMount() {
      this.setState({ letterGuide: this.renderLetterGuide() });
    }

    componentDidMount() {
      const wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
      wait.then(() => {
        this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: 1 });
      });
    }

    componentWillReceiveProps(nextProps) {
      const clients = nextProps.clients.sort(ClientList.compareByName);
      this.setState({
        dataSource: ClientList.clients(clients),
        boldWords: nextProps.boldWords,
        showLateralList: nextProps.showLateralList,
        onPressItem: nextProps.onPressItem,
        showSectionHeader: nextProps.showSectionHeader,
        simpleListItem: nextProps.simpleListItem,
      });
    }

      scrollToIndex = (section, letter) => {
        let total = 0;

        for (let i = 0; i < abecedary.length; i += 1) {
          const letterClients = ClientList.getByValue(
            this.state.dataSource,
            abecedary[i], 'title',
          );

          if (letter.toUpperCase() === abecedary[i]) {
            total += HEADER_HEIGHT;
            break;
          }

          if (letterClients) {
            total += HEADER_HEIGHT;
            total += letterClients.data.length * ITEM_HEIGHT;
          }
        }


        this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: total });
      }

      renderItem = obj => (
        <View key={Math.random().toString()} style={{ height: ITEM_HEIGHT }}>
          <ClientListItem
            client={obj.item}
            simpleListItem={this.state.simpleListItem}
            boldWords={this.state.boldWords}
            onPress={this.state.onPressItem}
          />
        </View>)

      renderLetterGuide = () => {
        const clientsLetters = [];

        for (let i = 0; i < this.state.clients.length; i += 1) {
          const client = this.state.clients[i];
          if (clientsLetters.indexOf(client.name.substring(0, 1).toUpperCase()) === -1) {
            clientsLetters.push(client.name.substring(0, 1).toUpperCase());
          }
        }

        const letterGuide = [];

        for (let i = 0; i < abecedary.length; i += 1) {
          const letter = abecedary[i];

          let letterComponent = <Text style={styles.letter}>{letter}</Text>;

          if (clientsLetters.indexOf(letter) > -1) {
            letterComponent = <Text style={styles.foundLetter}>{letter}</Text>;
          }

          letterGuide.push(<TouchableHighlight
            underlayColor="transparent"
            key={Math.random().toString()}
            onPress={() => { this.scrollToIndex((i), letter); }}
          >
            <View style={styles.letterContainer}>{letterComponent}</View>
          </TouchableHighlight>);
        }

        return (letterGuide);
      }

      render() {
        return (
          <View style={styles.container}>
            {this.state.dataSource.length === 0 &&

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


            <View style={styles.listContainer}>
              <View style={styles.list}>
                <SectionList
                  key={Math.random().toString()}
                  style={{ height: '100%', flex: 1 }}
                  enableEmptySections
                  initialNumToRender={this.state.dataSource.length}
                  ref={(ref) => { this.sectionListRef = ref; }}
                  sections={this.state.dataSource}
                  renderItem={this.renderItem}
                  stickySectionHeadersEnabled
                  getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                  )}
                  renderSectionHeader={item => ClientList.renderSection(item, this.state.showSectionHeader)}
                  ItemSeparatorComponent={() => ClientList.renderSeparator(this.state.showSectionHeader)}

                />
              </View>
              {this.state.showLateralList && <View style={styles.guideContainer}>
                {this.state.letterGuide}
              </View>}
            </View>
          </View>
        );
      }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientList);
