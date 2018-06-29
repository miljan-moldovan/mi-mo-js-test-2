import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Switch,
} from 'react-native';
import moment from 'moment';

import { AppointmentTime } from './SalonNewAppointmentSlide';
import {
  InputDivider,
  ClientInput,
  ServiceInput,
  ProviderInput,
} from '../formHelpers';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import SalonFlatPicker from '../SalonFlatPicker';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
    flex: 1,
  },
  header: {
    backgroundColor: '#115ECD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
  },
  dateText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 30 - 16,
    color: '#111415',
  },
  placeholderText: {
    fontSize: 14,
    color: '#727A8F',
    lineHeight: 22,
  },
  middleSectionDivider: {
    width: '95%', height: 1, alignSelf: 'center', backgroundColor: '#DDE6F4',
  },

});

const Button = props => (
  <SalonTouchableOpacity
    style={[{
      height: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.disabled ? '#C0C0C0' : props.backgroundColor || '#115ECD',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: props.disabled ? '#86868a' : '#115ECD',
    }, props.style]}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <Text style={{
      fontSize: 12,
      color: props.color || 'white',
      fontFamily: 'Roboto-Bold',
    }}
    >
      {props.text}
    </Text>
  </SalonTouchableOpacity>
);

export default class NewApptSlide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canBook: false,
      visible: true,
      service: null,
      client: null,
      provider: null,
    };
  }

  setClient = client => this.setState({ client }, this.showPanel)

  setService = service => this.setState({ service }, this.showPanel)

  setProvider = provider => this.setState({ provider }, this.showPanel)

  showPanel = () => this.props.show()// this.setState({ visible: true })

  hidePanel = () => this.props.hide()

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      this.showPanel();
      navigation.goBack();
    },
  })

  render() {
    const {
      client,
      service,
      provider,
    } = this.state;
    const contentStyle = { alignItems: 'flex-start', paddingLeft: 11 };
    const selectedStyle = { fontSize: 14, lineHeight: 22, color: this.props.hasConflicts ? 'red' : 'black' };
    return (
      <Modal
        visible={this.props.visible}
        transparent
        style={{ maxHeight: 484 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <SalonTouchableOpacity
              style={{ flex: 4 / 17, justifyContent: 'flex-start' }}
              onPress={() => {}}
            >
              <Text style={{
                color: 'white',
                fontSize: 14,
                lineHeight: 18,
                fontFamily: 'Roboto-Medium',
                textAlign: 'left',
              }}
              >
                Cancel
              </Text>
            </SalonTouchableOpacity>
            <View style={{ flex: 9 / 17, justifyContent: 'center', alignItems: 'stretch' }}>
              <SalonFlatPicker
                rootStyle={{ justifyContent: 'center' }}
                dataSource={['New Appt.', 'Other']}
                selectedColor="#FFFFFF"
                selectedTextColor="#115ECD"
                unSelectedTextColor="#FFFFFF"
                textFontSize={13}
                onItemPress={this.handleTypeChange}
                selectedIndex={this.state.selectedFilter}
              />
            </View>
          </View>
          <View style={styles.body}>
            <ScrollView style={{ paddingVertical: 15 }}>
              <Text style={styles.dateText}>{moment().format('ddd, MMM D')}</Text>
              <AppointmentTime
                containerStyle={{
                justifyContent: 'flex-start',
              }}
                startTime="20:30"
                endTime="20:45"
              />
              <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              borderColor: '#F4F7FC',
              borderWidth: 1,
              marginVertical: 15,
              shadowColor: '#000000',
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 1,
              shadowOffset: { width: 0, height: 2 },
              backgroundColor: '#F3F7FC',
            }}
              >
                <ClientInput
                  apptBook
                  label={false}
                  key={Math.random().toString()}
                  style={{ height: 39 }}
                  selectedClient={client}
                  placeholder={client === null ? 'Select Client' : 'Client'}
                  placeholderStyle={styles.placeholderText}
                  contentStyle={contentStyle}
                  selectedStyle={selectedStyle}
                  onPress={() => this.hidePanel()}
                  navigate={this.props.navigation.navigate}
                  headerProps={{ title: 'Clients', ...this.cancelButton() }}
                  iconStyle={{ color: '#115ECD' }}
                  onChange={this.setClient}
                />
                <InputDivider key={Math.random().toString()} style={styles.middleSectionDivider} />
                <ServiceInput
                  key={Math.random().toString()}
                  apptBook
                  noLabel
                  selectedProvider={provider}
                  selectedService={service}
                  rootStyle={{ height: 39 }}
                  selectedStyle={selectedStyle}
                  placeholder="Select a Service"
                  placeholderStyle={styles.placeholderText}
                  contentStyle={contentStyle}
                  onPress={() => this.hidePanel()}
                  navigate={this.props.navigation.navigate}
                  headerProps={{ title: 'Services', ...this.cancelButton() }}
                  iconStyle={{ color: '#115ECD' }}
                  onChange={this.setService}
                />
                <InputDivider key={Math.random().toString()} style={styles.middleSectionDivider} />
                <ProviderInput
                  key={Math.random().toString()}
                  noLabel
                  apptBook
                  filterByService
                  filterList={this.props.filterProviders}
                  rootStyle={{ height: 39 }}
                  selectedProvider={provider}
                  placeholder="Select a Provider"
                  placeholderStyle={styles.placeholderText}
                  selectedStyle={selectedStyle}
                  contentStyle={contentStyle}
                  iconStyle={{ color: '#115ECD' }}
                  avatarSize={20}
                  onPress={() => this.hidePanel()}
                  navigate={this.props.navigation.navigate}
                  headerProps={{ title: 'Providers', ...this.cancelButton() }}
                  onChange={this.setProvider}
                />
              </View>
              <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
              >
                <Text style={{
                fontSize: 14,
                lineHeight: 22,
                color: '#110A24',
              }}
                >Provider is Requested?
                </Text>
                <Switch />
              </View>
              <View style={{
              marginVertical: 14,
              backgroundColor: '#F1F1F1',
              height: 32,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingHorizontal: 12,
            }}
              >
                <Text style={{
                fontSize: 13,
                lineHeight: 22,
                color: '#2F3142',
                marginRight: 6,
              }}
                >Length
                </Text>
                <Text style={{
                fontSize: 13,
                lineHeight: 22,
                color: '#2F3142',
                opacity: 0.5,
                fontStyle: 'italic',
              }}
                >
              select a service first
                </Text>
              </View>
              <View style={{
              flexDirection: 'column',
            }}
              >
                <Button
                  onPress={() => this.setState({ canBook: !this.state.canBook })}
                  disabled={this.state.canBook}
                  text="BOOK NOW"
                />
                <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 16,
              }}
                >
                  <Button
                    style={{ flex: 8 / 17 }}
                    onPress={() => this.setState({ canBook: !this.state.canBook })}
                    disabled={this.state.canBook}
                    backgroundColor="white"
                    color="#115ECD"
                    text="MORE OPTIONS"
                  />
                  <Button
                    style={{ flex: 8 / 17 }}
                    onPress={() => this.setState({ canBook: !this.state.canBook })}
                    disabled={this.state.canBook}
                    backgroundColor="white"
                    color="#115ECD"
                    text="BOOK ANOTHER"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}
