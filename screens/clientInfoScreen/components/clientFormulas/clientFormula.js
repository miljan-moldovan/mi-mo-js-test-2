import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
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
import styles from './stylesClientFormula';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';

const formulaTypes = [
  { key: formulaTypesEnum.Color, value: 'Color' },
  { key: formulaTypesEnum.Perm, value: 'Perm' },
  { key: formulaTypesEnum.Skin, value: 'Skin' },
  { key: formulaTypesEnum.Nail, value: 'Nail' },
  { key: formulaTypesEnum.Massage, value: 'Massage' },
  { key: formulaTypesEnum.Hair, value: 'Hair' },
  { key: formulaTypesEnum.NULL, value: 'NULL' },
];

class ClientFormula extends React.Component {
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
        enteredBy: {},
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

      navigate('Providers', {
        actionType: 'update',
        dismissOnSelect: true,
        ...this.props,
      });
    }

    onChangeEnteredBy = (enteredBy) => {
      const { formula } = this.state;
      formula.enteredBy = enteredBy;
      this.setState({ formula });
    }

    onChangeProvider = (provider) => {
      const { formula } = this.state;
      formula.provider = provider;
      this.setState({ formula });
    }

    render() {
      return (
        <Modal
          isVisible={this.state.isVisible}
          style={styles.modal}
        >
          <View style={styles.container}>
            <InputGroup style={{ flex: 1, flexDirection: 'column', marginTop: 16 }}>

              <ProviderInput
                apptBook
                noPlaceholder
                filterByService
                style={styles.innerRow}
                selectedProvider={this.state.formula.enteredBy}
                labelText="Entered by"
                iconStyle={styles.carretIcon}
                avatarSize={20}
                navigate={this.props.navigation.navigate}
                headerProps={{ title: 'Providers', ...this.cancelButton() }}
                onChange={(provider) => { this.onChangeEnteredBy(provider); }}
                onPress={this.handlePressProvider}
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
        </Modal>
      );
    }
}


ClientFormula.defaultProps = {
  // editionMode: true,
};

ClientFormula.propTypes = {
  clientFormulasActions: PropTypes.shape({
    getClientFormulas: PropTypes.func.isRequired,
    setFilteredFormulas: PropTypes.func.isRequired,
    setFormulas: PropTypes.func.isRequired,
  }).isRequired,
  clientFormulasState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default ClientFormula;
