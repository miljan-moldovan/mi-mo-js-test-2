import React from 'react';
import { View,
  Text,
  SectionList,
  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ClientListItem from './clientListItem';
import ClientListHeader from './clientListHeader';

import ListLetterFilter from '../../../../components/listLetterFilter';
import SalonTouchableHighlight from '../../../../components/SalonTouchableHighlight';
import EmptyList from './emptyClientList';

const ITEM_HEIGHT = 60;
const HEADER_HEIGHT = 30;

const abecedary = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  guideContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
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
    return (
      <View style={styles.topBar}>
        <ClientListHeader header={item.section.title} />
      </View>
    );
  }

  componentWillMount() {
    this.setState({ letterGuide: this.renderLetterGuide() });
  }

  componentDidMount() {
    const wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
    wait.then(() => {
      this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: 1 });
    });
  }


      scrollToIndex = (letter) => {
        let total = 0;
        let found = false;

        for (let i = 0; i < abecedary.length; i += 1) {
          const letterClients = ClientList.getByValue(
            this.props.clients,
            abecedary[i], 'title',
          );

          if (letter.toUpperCase() === abecedary[i]) {
            total += HEADER_HEIGHT;
            found = letterClients;
            break;
          }

          if (letterClients) {
            total += HEADER_HEIGHT;
            total += letterClients.data.length * ITEM_HEIGHT;
          }
        }

        if (found) {
          this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: total });
        }
      }

      renderItem = obj => (
        <View key={obj.item.id} style={{ height: ITEM_HEIGHT }}>
          <ClientListItem
            client={obj.item}
            boldWords={this.props.boldWords}
            onPress={this.props.onChangeClient ? this.props.onChangeClient : () => {}}
          />
        </View>)

      renderLetterGuide = () => {
        const clientsLetters = [];

        for (let i = 0; i < this.props.clients.length; i += 1) {
          const letter = this.props.clients[i].title;
          clientsLetters.push(letter.toUpperCase());
          // if (clientsLetters.indexOf(client.name.substring(0, 1).toUpperCase()) === -1) {
          //   clientsLetters.push(client.name.substring(0, 1).toUpperCase());
          // }
        }

        const letterGuide = [];

        for (let i = 0; i < abecedary.length; i += 1) {
          const letter = abecedary[i];

          let letterComponent = <Text style={styles.letter}>{letter}</Text>;

          if (clientsLetters.indexOf(letter) > -1) {
            letterComponent = <Text style={styles.foundLetter}>{letter}</Text>;
          }

          letterGuide.push(<SalonTouchableHighlight
            underlayColor="transparent"
            key={letter}
            onPress={() => { this.scrollToIndex((i), letter); }}
          >
            <View style={styles.letterContainer}>{letterComponent}</View>
                           </SalonTouchableHighlight>);
        }

        return (letterGuide);
      }

      render() {
        return (
          <View style={styles.container}>

            <SectionList
              enableEmptySections
              keyboardShouldPersistTaps="always"
              initialNumToRender={this.props.clients.length}
              ref={(ref) => { this.sectionListRef = ref; }}
              sections={this.props.clients}
              renderItem={this.renderItem}
              stickySectionHeadersEnabled
              getItemLayout={(data, index) => (
                  { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
              renderSectionHeader={item => ClientList.renderSection(item)}
              ItemSeparatorComponent={() => ClientList.renderSeparator()}
              ListEmptyComponent={EmptyList}
              refreshing={this.props.refreshing}
            />

            {this.props.clients.length > 0 ? <ListLetterFilter
              onPress={(letter) => { this.scrollToIndex(letter); }}
            /> : null }
          </View>
        );
      }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ClientList);
