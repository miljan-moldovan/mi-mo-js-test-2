import * as React from 'react';
import {View, SectionList, Text, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import SalonInputModal from '../../../components/SalonInputModal';
import Card from './card';
import styles from './styles';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import {Client, AppointmentBook} from '../../../utilities/apiWrapper';
import ClientInfoButton from '../../../components/ClientInfoButton';
import SalonHeader from '../../../components/SalonHeader';
import Colors from '../../../constants/Colors';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { dateTimeConstants } from '@/constants';

const query = {
  SortOrder: 1,
  SortField: 'Start,Date',
};

class ShowApptScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const client = navigation.state.params && navigation.state.params.client
      ? navigation.state.params.client
      : null;
    const title = client ? `${client.name} ${client.lastName}` : '';
    const sendEmail = navigation.state.params.sendEmail
      ? navigation.state.params.sendEmail
      : null;
    return {
      header: (
        <SalonHeader
          title={title}
          subTitle="Appointment List"
          headerLeft={
            <SalonTouchableOpacity
              onPress={navigation.goBack}
              style={styles.leftButton}
            >
              <Icon
                name="chevronLeft"
                size={20}
                color={Colors.white}
                type="regular"
              />
            </SalonTouchableOpacity>
          }
          headerRight={
            <View style={styles.rightBtnContainer}>
              <SalonTouchableOpacity
                onPress={sendEmail}
                style={styles.leftButton}
              >
                <Icon
                  name="envelope"
                  style={styles.envelopeIcon}
                  type="regular"
                />
              </SalonTouchableOpacity>
              <ClientInfoButton
                client={client}
                navigation={navigation}
                onDonePress={() => {}}
                apptBook
                style={styles.leftButton}
                iconStyle={styles.infoIcon}
              />
            </View>
          }
        />
      ),
    };
  };
  
  constructor (props) {
    super (props);
    const {clientApptActions, navigation: {state: {params: {client}}}} = props;
    this.state = {
      client,
      isEmailVisible: false,
      date: moment().format(dateTimeConstants.date)
    };
    clientApptActions.clearAppts ();
  }

  componentDidMount () {
    this.state
    const {
      navigation: {state: {params: {client, date}}, setParams},
      clientApptActions,
    } = this.props;
    clientApptActions.getClientAppt ({
      clientId: client.id,
      fromDate: this.state.date,
      query,
    });
    setParams ({sendEmail: this.showEmailModal});
  }

  fetchMore = () => {
    const {
      navigation: {state: {params: {client, date}}},
      clientApptActions,
      total,
      showing,
    } = this.props;
    if (total > showing) {
      const newQuery = {
        ...query,
        skip: showing,
      };
      clientApptActions.getMoreClientAppt ({
        clientId: client.id,
        fromDate: this.state.date,
        query: newQuery,
      });
    }
  };

  handleOk = email => {
    if (this.state.client.email === email) {
      this.sendEmail ();
    } else {
      const client = {...this.state.client, email};
      Client.putClientEmail (client.id, email)
        .then (() => this.setState ({client}, this.putClientSuccess))
        .catch (ex => alert (ex));
    }
  };

  handleOnPress = item => {
    const {navigation: {popToTop, state: {params: {goToAppt}}}} = this.props;
    goToAppt ({date: item.date, endDate: item.date, appointmentId: item.id});
    popToTop ();
  };

  putClientSuccess = () => {
    this.sendEmail ();
    this.props.appointmentCalendarActions.setGridView ();
  };

  sendEmail = () => {
    AppointmentBook.postEmailUpcomingAppointments ()
      .then (() => this.setState ({isEmailVisible: false}))
      .catch (ex => alert (ex));
  };

  showEmailModal = () => {
    this.setState ({isEmailVisible: true});
  };

  hideEmailModal = () => {
    this.setState ({isEmailVisible: false});
  };

  renderItem = ({item}) => (
    <Card onPress={() => this.handleOnPress (item)} key={item.id} item={item} />
  );

  renderSectionHeader = ({section: {title}}) => {
    const isToday = title.startsWith ('Today');
    return (
      <Text
        key={title}
        style={[styles.sectionText, isToday && styles.activeSection]}
      >
        {title}
      </Text>
    );
  };

  renderMoreLoading = () =>
    this.props.isLoadingMore &&
    <View style={styles.container}>
      <ActivityIndicator size="small" />
    </View>;

  renderEmptyLoading = () =>
    this.props.isLoading &&
    <View style={styles.container}>
      <ActivityIndicator size="small" />
    </View>;

  renderEmailDescription = () => {
    const {client: {name, lastName, email}} = this.state;
    const clientName = `${name} ${lastName}`;
    if (email) {
      return `Please check the below mentioned email id is correct for ${clientName} in order to send email for Upcoming Appointment`;
    }
    return `Please, provide the email address for ${clientName} in order to email Upcoming Appointments.`;
  };

  render () {
    const {appointments, isLoading} = this.props;
    const {isEmailVisible, client: {email}} = this.state;
    return (
      <View style={styles.container}>
        {isLoading
          ? <LoadingOverlay />
          : <SectionList
              stickySectionHeadersEnabled={false}
              renderItem={this.renderItem}
              renderSectionHeader={this.renderSectionHeader}
              sections={appointments}
              onEndReached={this.fetchMore}
              ListFooterComponent={this.renderMoreLoading}
            />}
        <SalonInputModal
          visible={isEmailVisible}
          title="Client Email"
          description={this.renderEmailDescription ()}
          onPressCancel={this.hideEmailModal}
          onPressOk={this.handleOk}
          value={email}
          isTextArea={false}
          placeholder="Enter email"
          onChangeText={this.handleChangeEmail}
        />
      </View>
    );
  }
}

ShowApptScreen.propTypes = {
  appointmentCalendarActions: PropTypes.shape ({
    setGridView: PropTypes.func,
  }).isRequired,
  clientApptActions: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  showing: PropTypes.number.isRequired,
  appointments: PropTypes.arrayOf (
    PropTypes.shape ({
      title: PropTypes.string,
    })
  ).isRequired,
};

export default ShowApptScreen;
