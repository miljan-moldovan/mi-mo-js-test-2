import React from 'react';
import { View,
  Text,
  TouchableHighlight,
  SectionList,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ClientListItem from '../../components/clientList/clientListItem';
import ClientListHeader from '../../components/clientList/clientListHeader';

const ITEM_HEIGHT = 60;
const HEADER_HEIGHT = 30;

const abecedary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E7E7E7',
  },
  clientList: {
    backgroundColor: '#FFF',
    flex: 10,
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
    backgroundColor: '#EFEFEF',
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

  static renderSeparator() {
    return (<View
      style={{
            height: 1,
            width: '100%',
            backgroundColor: '#C0C1C6',
          }}
    />);
  }


  static renderSection(item) {
    return (<View style={styles.topBar}>
      <ClientListHeader header={item.section.title} />
            </View>);
  }


  constructor(props) {
    super(props);

    const clients = props.clients.sort(ClientList.compareByName);

    this.state = {
      clients,
      dataSource: ClientList.clients(clients),
      letterGuide: [],
      boldWords: props.boldWords,
    };
  }

    state:{
      clients:[]
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
            boldWords={this.state.boldWords}
            onPress={this.props.onChangeClient ? this.props.onChangeClient : () => {}}
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

            <View style={styles.listContainer}>
              <View style={styles.list}>
                <SectionList
                  key={Math.random().toString()}
                  style={{ height: '100%', flex: 1 }}
                  enableEmptySections
                  keyboardShouldPersistTaps="always"
                  initialNumToRender={this.state.dataSource.length}
                  ref={(ref) => { this.sectionListRef = ref; }}
                  sections={this.state.dataSource}
                  renderItem={this.renderItem}
                  stickySectionHeadersEnabled
                  getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                  )}
                  renderSectionHeader={item => ClientList.renderSection(item)}
                  ItemSeparatorComponent={() => ClientList.renderSeparator()}

                />
              </View>
              {<View style={styles.guideContainer}>
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
