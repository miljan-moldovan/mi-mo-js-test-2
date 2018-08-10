import React from 'react';
import { View, SectionList, Text, ActivityIndicator } from 'react-native';

import Card from './card';
import styles from './styles';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import Icon from '../../../components/UI/Icon';

const query = {
  SortOrder: 1,
  SortField: 'Start,Date',
};

class ShowApptScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const client = navigation.state.params && navigation.state.params.client ?
      navigation.state.params.client : null;
    const title = client ? `${client.name} ${client.lastName}` : '';
    return {
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subTitleText}>Appointment List</Text>
        </View>),
      headerLeft: (
        <View style={styles.leftBtnContainer}>
          <SalonTouchableOpacity
            onPress={navigation.goBack}
            style={styles.leftButton}
          >
            <Icon name="chevronLeft" style={styles.goBackIcon} type="solid" />
          </SalonTouchableOpacity>
        </View>),
      headerRight: (
        <View style={styles.rightBtnContainer}>
          <SalonTouchableOpacity
            onPress={navigation.goBack}
            style={styles.leftButton}
          >
            <Icon name="chevronLeft" style={styles.goBackIcon} type="solid" />
          </SalonTouchableOpacity>
          <SalonTouchableOpacity
            onPress={navigation.goBack}
            style={styles.leftButton}
          >
            <Icon name="chevronLeft" style={styles.goBackIcon} type="solid" />
          </SalonTouchableOpacity>
        </View>),
    };
  };

  componentDidMount() {
    const { navigation: { state: { params: { client, date } } },
      clientApptActions } = this.props;
    clientApptActions.getClientAppt({
      clientId: client.id,
      fromDate: date,
      query,
    });
  }

  fetchMore = () => {
    const { navigation: { state: { params: { client, date } } },
      clientApptActions, appointments, total, showing } = this.props;
    if (total > showing) {
      const newQuery = {
        ...query,
        skip: showing,
      };
      console.log('BACONFLAG')
      clientApptActions.getMoreClientAppt({
        clientId: client.id,
        fromDate: date,
        query: newQuery,
      });
    }
  }

  //keyExtractor = (section, index) => section.title + index;

  renderItem = ({ item }) => <Card key={item.id} item={item} />

  renderSectionHeader = ({ section: { title } }) => {
    const isToday = title.startsWith('Today');
    return (
      <Text key={title} style={[styles.sectionText, isToday && styles.activeSection]}>
        {title}
      </Text>
    );
  }

  renderMoreLoading = () => this.props.isLoadingMore && (
    <View style={{ flex: 1 }}>
      <ActivityIndicator size="small" />
    </View>
  );

  render() {
    const { appointments, isLoading, isLoadingMore, total, showing } = this.props;
    return (
      <SectionList
        stickySectionHeadersEnabled={false}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={appointments}
        onEndReached={this.fetchMore}
        renderFooter={this.renderMoreLoading}
      />
    );
  }
}

export default ShowApptScreen;
