import * as React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { isFunction } from 'lodash';
import ClientListItem from './clientListItem';
import ClientListHeader from './clientListHeader';
import SalonTouchableHighlight
  from '../../../../components/SalonTouchableHighlight';
import EmptyList from './emptyClientList';
import { checkRestrictionsClientInfo } from '@/redux/actions/restrictions';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';
import { Tasks } from '@/constants/Tasks';

const ITEM_HEIGHT = 88;
const HEADER_HEIGHT = 30;

const { height: screenHeight } = Dimensions.get('window');

const abecedary = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
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

class ClientList extends React.Component<any, any> {
  static renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#C0C1C6',
        }}
      />
    );
  }

  static renderSection(item) {
    return (
      <View style={styles.topBar}>
        <ClientListHeader header={item.section.title} />
      </View>
    );
  }

  state = {
    pressedClientId: null,
  };

  componentWillMount() {
    this.setState({ letterGuide: this.renderLetterGuide() });
  }

  componentDidMount() {

    const wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
    wait.then(() => {
      if (this.sectionListRef) {
        this.sectionListRef._wrapperListRef._listRef.scrollToOffset({
          offset: 1,
        });
      }
    });
  }

  goToClientInfo = client => {
    if (client.id > 1) {
      this.props.navigate('ClientInfo', {
        client,
        apptBook: false,
        canDelete: true,
      });
    }
  };

  scrollToIndex = letter => {
    let total = 0;
    let found = false;

    for (let i = 0; i < abecedary.length; i += 1) {
      const letterClients = ClientList.getByValue(
        this.props.clients,
        abecedary[i],
        'title',
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
      this.sectionListRef._wrapperListRef._listRef.scrollToOffset({
        offset: total,
      });
    }
  };

  handleClientInfoPress = (item) => this.setState(
    { pressedClientId: item.id },
    () => this.props.checkRestrictionsClientInfo(() => this.goToClientInfo(item)),
  );

  renderItem = obj => {
    return (
      <View key={obj.item.id}>
        <ClientListItem
          client={obj.item}
          boldWords={this.props.boldWords}
          onPress={
            this.props.onChangeClient
              ? this.props.onChangeClient
              : () => this.handleClientInfoPress(obj.item)
          }
          clientInfoIsLoading={this.props.clientInfoIsLoading && this.state.pressedClientId === obj.item.id}
        />
      </View>
    );
  };

  renderLetterGuide = () => {
    const clientsLetters = [];

    for (let i = 0; i < this.props.clients.length; i += 1) {
      const letter = this.props.clients[i].title;
      clientsLetters.push(letter.toUpperCase());
    }

    const letterGuide = [];

    for (let i = 0; i < abecedary.length; i += 1) {
      const letter = abecedary[i];

      let letterComponent = <Text style={styles.letter}>{letter}</Text>;

      if (clientsLetters.indexOf(letter) > -1) {
        letterComponent = <Text style={styles.foundLetter}>{letter}</Text>;
      }

      letterGuide.push(
        <SalonTouchableHighlight
          underlayColor="transparent"
          key={letter}
          onPress={() => {
            this.scrollToIndex(i, letter);
          }}
        >
          <View style={styles.letterContainer}>{letterComponent}</View>
        </SalonTouchableHighlight>,
      );
    }

    return letterGuide;
  };

  renderMoreLoading = () => {
    if (this.props.isLoadingMore || this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    return null;
  };

  renderEmptyView = () => {
    const { isLoadingMore, isLoading } = this.props;
    if (!isLoadingMore && !isLoading) {
      return (
        <EmptyList
          onChangeClient={
            isFunction(this.props.onChangeClient)
              ? this.props.onChangeClient
              : null
          }
          navigate={this.props.navigate}
          hideAddButton={this.props.hideAddButton}
          isWalkin={this.props.isWalkin}
          onWalkinPress={this.props.onChangeClient}
          fullName={this.props.fullName}
        />
      );
    }
    return null;
  };

  getKeyboardVerticalOffset() {
    if (screenHeight < 600) {
      return screenHeight * 0.21;
    } else if (screenHeight < 700) {
      return screenHeight * 0.18;
    } else {
      return screenHeight * 0.15;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior='padding'
          keyboardVerticalOffset={this.getKeyboardVerticalOffset()}
        >
          {this.props.clients.length
            ? <SectionList
              onEndReached={this.props.fetchMore}
              enableEmptySections={true}
              keyboardShouldPersistTaps="always"
              initialNumToRender={this.props.clients.length}
              ref={ref => {
                this.sectionListRef = ref;
              }}
              sections={this.props.clients}
              renderItem={this.renderItem}
              stickySectionHeadersEnabled
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              renderSectionHeader={ClientList.renderSection}
              ItemSeparatorComponent={ClientList.renderSeparator}
              refreshing={this.props.refreshing}
              ListFooterComponent={this.renderMoreLoading}
            />
            : this.renderEmptyView()}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapActionsToProps = dispatch => ({
  checkRestrictionsClientInfo: (callback) => dispatch(checkRestrictionsClientInfo(callback)),
});

const mapStateToProps = state => ({
  auth: state.auth,
  clientInfoIsDisabled: restrictionsDisabledSelector(state, Tasks.Clients_Info),
  clientInfoIsLoading: restrictionsLoadingSelector(state, Tasks.Clients_Info),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientList);
