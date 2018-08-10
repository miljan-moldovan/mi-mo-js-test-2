import React from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import ServiceListItem from './serviceListItem';
import ServiceListHeader from './serviceListHeader';

import ListLetterFilter from '../../../../components/listLetterFilter';

const ITEM_HEIGHT = 43;
const HEADER_HEIGHT = 38;

const abecedary = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  topBar: {
    height: HEADER_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

class ServiceList extends React.Component {
  static compareByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  static getByValue(arr, value, attr) {
    const results = [];
    for (let i = 0, iLen = arr.length; i < iLen; i += 1) {
      if (arr[i][attr] === value) {
        results.push(arr[i]);
      }
    }
    return results.length > 0 ? results : null;
  }


  static services(services) {
    const servicesLetters = [];

    // {data: [...], title: ...},

    for (let i = 0; i < services.length; i += 1) {
      const serviceCategory = services[i];

      let firstLetter = serviceCategory.name.substring(0, 1).toUpperCase();
      const isNumber = !isNaN(parseInt(firstLetter, 10));
      firstLetter = isNumber ? '#' : firstLetter;

      const result = ServiceList.getByValue(
        servicesLetters,
        serviceCategory.name, 'title',
      );

      if (result) {
        result[0].data.concat(serviceCategory.services);
      } else {
        servicesLetters.push({
          data: serviceCategory.services,
          title: serviceCategory.name,
          firstLetter,
        });
      }
    }

    return servicesLetters;
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
    return (
      <View key={Math.random().toString()} style={styles.topBar}>
        <ServiceListHeader header={item.section.title} />
      </View>
    );
  }


  constructor(props) {
    super(props);

    const services = props.services.sort(ServiceList.compareByName);

    this.state = {
      dataSource: ServiceList.services(services),
      boldWords: props.boldWords,
      refreshing: false,
      services: [],
    };
  }

  componentDidMount() {
    const wait = new Promise(resolve => setTimeout(resolve, 500)); // Smaller number should work
    wait.then(() => {
      this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: 1 });
    });
  }

  componentWillReceiveProps(nextProps) {
    const services = nextProps.services.sort(ServiceList.compareByName);
    this.setState({
      dataSource: ServiceList.services(services),
      boldWords: nextProps.boldWords,
    });
  }

  scrollToIndex = (letter) => {
    let total = 0;
    let found = false;

    for (let i = 0; i < abecedary.length; i += 1) {
      const letterServices = ServiceList.getByValue(
        this.state.dataSource,
        abecedary[i], 'firstLetter',
      );

      if (letter.toUpperCase() === abecedary[i]) {
        total += HEADER_HEIGHT;
        found = letterServices;
      }

      if (letterServices && !found) {
        for (let x = 0; x < letterServices.length; x += 1) {
          total += HEADER_HEIGHT;
          total += letterServices[x].data.length * ITEM_HEIGHT;
        }
      }
    }

    if (found) {
      this.sectionListRef._wrapperListRef._listRef.scrollToOffset({ offset: total });
    }
  }

  keyExtractor = (item, index) => item.id;

  renderItem = obj => (
    <ServiceListItem
      key={Math.random().toString()}
      service={obj.item}
      height={ITEM_HEIGHT}
      {...this.props}
      boldWords={this.state.boldWords}
      onPress={this.props.onChangeService ?
        () => {
          this.props.servicesActions.setSelectedService(obj.item);
          this.props.onChangeService(obj.item);
        } : () => { }
      }
    />)

  onRefreshFinish = () => {
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.container}>

        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                this.props.onRefresh(this.onRefreshFinish);
              }
              }
            />
          }
          keyExtractor={this.keyExtractor}
          key={Math.random().toString()}
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
          extraData={this.props}
          renderSectionHeader={item => ServiceList.renderSection(item)}
          ItemSeparatorComponent={() => ServiceList.renderSeparator()}
        />
        <ListLetterFilter
          onPress={(letter) => { this.scrollToIndex(letter); }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect(mapStateToProps)(ServiceList);
