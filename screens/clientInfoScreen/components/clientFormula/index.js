import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientFormulasActions from '../../../../actions/clientFormulas';
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
import styles from './stylesClientFormula';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';
import ClienteFormulaHeader from './clientFormulaHeader';

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
  constructor(props) {
    super(props);

    const { client } = props.navigation.state.params;

    this.state = {
      client,
      formula: {
        date: null,
        formulaType: null,
        provider: {},
        enteredBy: {},
        text: '',
      },
      isVisible: true,
    };
  }

  componentWillMount() {
    const { formula } = this.state;
    // const { client } = this.props.navigation.state.params;

    this.props.navigation.setParams({
      handlePress: () => this.saveFormula(),
      handleGoBack: () => this.goBack(),
    });
  }

  handleGoBackCopy = () => {
    this.setState({ isVisible: true });
  }

  handleSaveCopy = (copied) => {
    const { formula } = this.state;
    formula.text = copied.text;
    formula.date = copied.date;
    formula.formulaType = copied.formulaType;

    this.setState({ isVisible: true, formula });
  }

  goBack() {
    this.setState({ isVisible: false });
    this.props.navigation.goBack();
  }

  handleClientSelection = (client) => {
  }

  onChangeType = (value) => {
    const newFormula = this.state.formula;
    newFormula.formulaType = value;
    this.setState({ formula: newFormula }, this.checkCanSave);
  }

    cancelButton = () => ({
      leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
      leftButtonOnPress: () => {
        this.dismissOnSelect();
      },
    });

    handleOnNavigateBack = () => {
      this.setState({ isVisible: true });
    }

    dismissOnSelect() {
      this.setState({ isVisible: true });
    }

    handlePressProvider = () => {
      const { navigate } = this.props.navigation;

      this.setState({ isVisible: false });


      navigate('Providers', {
        actionType: 'update',
        dismissOnSelect: this.dismissOnSelect,
        onNavigateBack: this.handleOnNavigateBack,
        ...this.props,
      });
    }

    onChangeEnteredBy = (enteredBy) => {
      const { formula } = this.state;
      formula.enteredBy = enteredBy;
      this.setState({ formula, isVisible: true }, this.checkCanSave);
    }

    onChangeProvider = (provider) => {
      const { formula } = this.state;
      formula.provider = provider;
      this.setState({ formula, isVisible: true }, this.checkCanSave);
    }

    goToCopy = () => {
      const { navigate } = this.props.navigation;
      this.setState({ isVisible: false });

      navigate('ClientCopyFormula', {
        ...this.props,
        client: this.state.client,
        handleGoBack: this.handleGoBackCopy,
        handleSaveCopy: this.handleSaveCopy,
      });
    }

    goToAssociatedAppt = () => {
      alert('Not Implemented');
    }


    checkCanSave = () => {
      const { formula } = this.state;

      if (formula.text &&
        formula.text.length > 0 &&
        formula.formulaType &&
        formula.date &&
        formula.enteredBy
      ) {
        this.props.navigation.setParams({ canSave: true });
      } else {
        this.props.navigation.setParams({ canSave: false });
      }
    }

    onChangeText = (txtFormula) => {
      const { formula } = this.state;
      formula.text = txtFormula;
      this.shouldSave = true;
      this.setState({ formula }, this.checkCanSave);
    }

    onPressDate = (selectedDate) => {
      const { formula } = this.state;
      formula.date = selectedDate;
      this.shouldSave = true;
      this.setState({ formula }, this.checkCanSave);
    }

    saveFormula() {
      const { client } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
        const formula = Object.assign({}, this.state.formula);
        formula.text = formula.text;
        formula.stylistName = formula.enteredBy.fullName;
        formula.formulaType = formula.formulaType.key;
        delete formula.provider;
        delete formula.enteredBy;

        this.props.clientFormulasActions.postClientFormulas(client.id, formula)
          .then((response) => {
            this.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const formula = this.state.formula;
        formula.text = formula.text;
        this.props.clientFormulasActions.putClientFormulas(client.id, formula)
          .then((response) => {
            this.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      }
    }

    render() {
      return (
        <Modal
          isVisible={this.state.isVisible}
          style={styles.modal}
        >
          <View style={styles.container}>
            <ClienteFormulaHeader rootProps={this.props} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
              <View style={styles.topView} />
              <InputGroup>
                <ProviderInput
                  showFirstAvailable={false}
                  noPlaceholder
                  style={styles.innerRow}
                  selectedProvider={this.state.formula.enteredBy}
                  labelText="Entered By"
                  iconStyle={styles.carretIcon}
                  avatarSize={20}
                  navigate={this.props.navigation.navigate}
                  headerProps={{ title: 'Providers', ...this.cancelButton() }}
                  onChange={this.onChangeEnteredBy}
                  onPress={this.handlePressProvider}
                />
                <InputDivider />
                <InputPicker
                  label="Type"
                  value={this.state.formula ? this.state.formula.formulaType : null}
                  onChange={this.onChangeType}
                  defaultOption={formulaTypes[0]}
                  options={formulaTypes}
                />
                <InputDivider />
                <InputText
                  placeholder="Write formula"
                  onChangeText={this.onChangeText}
                  value={this.state.formula.text}
                />
              </InputGroup>
              <SectionDivider />
              <InputGroup style={styles.inputGroupAssociated}>
                <InputButton
                  style={styles.inputButton}
                  onPress={this.goToAssociatedAppt}
                  label="Associated appt."
                />
                <InputDivider />
                <InputDate
                  style={styles.inputDate}
                  placeholder="Date"
                  noIcon={this.state.formula.date == null}
                  onPress={this.onPressDate}
                  valueStyle={this.state.formula.date == null ? styles.dateValueStyle : {}}
                  selectedDate={this.state.formula.date == null ? 'Optional' : moment(this.state.formula.date).format('DD MMMM YYYY')}
                />
                <InputDivider />
                <ProviderInput
                  showFirstAvailable={false}
                  noPlaceholder
                  style={styles.innerRow}
                  selectedProvider={this.state.formula.provider}
                  labelText="Provider"
                  iconStyle={styles.carretIcon}
                  avatarSize={20}
                  navigate={this.props.navigation.navigate}
                  headerProps={{ title: 'Providers', ...this.cancelButton() }}
                  onChange={this.onChangeProvider}
                  onPress={this.handlePressProvider}
                />
              </InputGroup>
              <SectionDivider />
              <InputGroup style={styles.inputGroupCopy}>
                <InputButton
                  style={styles.inputGroupCopyButton}
                  onPress={this.goToCopy}
                  label="Copy formula to"
                />
              </InputGroup>
              <SectionDivider />
            </KeyboardAwareScrollView>
          </View>
        </Modal>
      );
    }
}

const mapStateToProps = state => ({
  clientFormulasState: state.clientFormulasReducer,
});

const mapActionsToProps = dispatch => ({
  clientFormulasActions: bindActionCreators({ ...clientFormulasActions }, dispatch),
});

ClientFormula.defaultProps = {

};

ClientFormula.propTypes = {
  clientFormulasActions: PropTypes.shape({
    postClientFormulas: PropTypes.func.isRequired,
  }).isRequired,
  clientFormulasState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(ClientFormula);
