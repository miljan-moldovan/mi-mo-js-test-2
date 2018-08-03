import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import {
  InputDate,
  InputText,
  InputGroup,
  InputButton,
  InputDivider,
  SectionDivider,
  InputPicker,
  ProviderInput,
} from '../../../../components/formHelpers';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';

const formulaTypes = [
  { key: 0, value: 'Color' },
  { key: 1, value: 'Perm' },
  { key: 2, value: 'Skin' },
  { key: 3, value: 'Nail' },
  { key: 4, value: 'Massage' },
  { key: 5, value: 'Hair' },
  { key: -1, value: 'NULL' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  navButton: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
});

const NavButton = ({ icon, onPress }) => (
  <SalonTouchableOpacity onPress={onPress}>
    <FontAwesome style={styles.navButton}>{icon}</FontAwesome>
  </SalonTouchableOpacity>
);

export default class ClientFormula extends React.Component {
  static navigationOptions = rootProps => ({
    headerTitle: (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'white' }}>New Formula</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Roboto-Regular', color: 'white' }}>Rod Stewart</Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity
        onPress={() => {
          rootProps.navigation.goBack();
          }}
      >
        <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'Roboto-Regular' }}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
    headerRight: <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'Roboto-Regular' }}>Save</Text>,
  })

  constructor(props) {
    super(props);

    this.state = {
      formula: {
        date: '',
        type: null,
        provider: {},
        text: '',
      },
    };
  }

  handleClientSelection = (client) => {
  }


  onChangeFormulaField = (field, value) => {
    const newFormula = this.state.formula;
    switch (field) {
      case 'type':
        newFormula.type = value;
        break;
      default:
            /* nothing */
    }

    this.setState({ formula: newFormula });
  }


    cancelButton = () => ({
      leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
      leftButtonOnPress: (navigation) => {
        navigation.goBack();
      },
    });

    handlePressProvider = () => {
      const { navigate } = this.props.navigation;

      this.shouldSave = true;

      navigate('Providers', {
        actionType: 'new',
        ...this.props,
      });
    }


    onChangeProvider = (provider) => {
      const formula = this.state.formula;
      formula.provider = provider;
      this.setState({ formula });
    }

    render() {
      return (
        <View style={styles.container}>
          <InputGroup style={{ flex: 1, flexDirection: 'column', marginTop: 16 }}>
            <InputButton
              style={{ flex: 1 }}
              onPress={() => {
              this.props.navigation.navigate('Clients', {
                actionType: 'update',
                dismissOnSelect: true,
                onChangeClient: this.handleClientSelection,
              });
            }}
              label="Entered by"
              value="Your Cousin"
            />
            <InputDivider />

            <InputPicker
              label="Type"
              value={this.state.formula ? this.state.formula.type : null}
              onChange={(option) => { this.onChangeFormulaField('type', option); }}
              defaultOption={formulaTypes[0]}
              options={formulaTypes}
            />

            <InputDivider />
            <InputText
              placeholder="Write formula"
              onChangeText={(txtNote) => {
                      const { formula } = this.state;
                      formula.text = txtNote;
                      this.setState({ formula });
                  }}
              value={this.state.formula.text}
            />
          </InputGroup>
          <SectionDivider />
          <InputGroup style={{ flex: 1, flexDirection: 'column' }}>
            <InputButton
              style={{ flex: 1 }}
              onPress={() => {}}
              label="Associated appt."
            />
            <InputDivider />
            <InputDate
              placeholder="Date"
              noIcon={this.state.formula.date == null}
              onPress={(selectedDate) => {
                const { formula } = this.state;
                formula.date = selectedDate;
                this.setState({ formula });
              }}
              valueStyle={this.state.formula.date == null ? {
                  fontSize: 14,
                  lineHeight: 22,
                  color: '#727A8F',
                  fontFamily: 'Roboto-Regular',
                } : {}}
              selectedDate={this.state.formula.date == null ? 'Optional' : moment(this.state.formula.date).format('DD MMMM YYYY')}
            />
            <InputDivider />
            <ProviderInput
              apptBook
              noPlaceholder
              filterByService
              style={styles.innerRow}
              selectedProvider={this.state.formula.provider}
              labelText="Provider"
              iconStyle={styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
              onChange={(provider) => { this.onChangeProvider(provider); }}
              onPress={this.handlePressProvider}
            />
          </InputGroup>
          <SectionDivider />
          <InputGroup style={{ flex: 1, height: 44, flexDirection: 'column' }}>
            <InputButton
              style={{ flex: 1 }}
              onPress={() => {}}
              label="Copy formula to"
            />
          </InputGroup>
          <SectionDivider />
        </View>
      );
    }
}
