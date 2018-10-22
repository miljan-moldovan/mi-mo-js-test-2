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
import { find, get } from 'lodash';
import clientFormulasActions from '../../../../actions/clientFormulas';
import settingsActions from '../../../../actions/settings';
import fetchFormCache from '../../../../utilities/fetchFormCache';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import groupedSettingsSelector from '../../../../redux/selectors/settingsSelector';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';

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
import ClienteFormulaHeader from './clientFormulaHeader';

class ClientFormula extends React.Component {
  constructor(props) {
    super(props);

    const { client } = props.navigation.state.params;
    props.settingsActions.getSettingsByName(
      'AvailableFormulaTypes',
      () => {
        props.settingsActions.getSettingsByName('DefaultFormulaType', this.loadFormulaTypes);
      },
    );


    this.state = {
      client,
      formula: {
        date: null,
        formulaType: null,
        provider: {},
        enteredBy: {},
        text: '',
      },
      defaultFormulaType: null,
      isVisible: true,
      formulaTypes: [],
    };
  }

  componentWillMount() {
    const onEditionFormula = this.props.navigation.state.params.formula;

    let { formula } = this.state;

    if (this.props.navigation.state.params.actionType === 'update') {
      formula = Object.assign({}, onEditionFormula);

      const provider = { fullName: formula.stylistName, name: formula.stylistName.split(' ')[0], lastName: formula.stylistName.split(' ')[1] };

      const formulaType = find(this.state.formulaTypes, { key: formula.formulaType });
      formula.formulaType = formulaType;
      formula.enteredBy = provider;

      const cachedForm = fetchFormCache('ClientFormulaUpdate', onEditionFormula.id, this.props.formCache);

      if (onEditionFormula.id === cachedForm.id) {
        formula = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      formula.formulaType = this.state.defaultFormulaType;
    }

    this.setState({ formula });

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

    handlePressProvider = (onChangeProvider) => {
      const { navigate } = this.props.navigation;

      this.setState({ isVisible: false });
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
        formula.formulaType
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

    loadFormulaTypes = (result) => {
      if (result) {
        const { settings } = this.props.settingsState;


        const formulaTypes = [];
        let defaultFormulaType = null;

        if (settings) {
          let availableFormulaTypes = find(settings, { settingName: 'AvailableFormulaTypes' });
          availableFormulaTypes = availableFormulaTypes ?
            availableFormulaTypes.settingValue : false;

          availableFormulaTypes = availableFormulaTypes.split(',').length > 0 ? availableFormulaTypes.split(',') : ['Default'];
          for (let i = 0; i < availableFormulaTypes.length; i += 1) {
            formulaTypes.push({ key: formulaTypesEnum[availableFormulaTypes[i]], value: availableFormulaTypes[i] });
          }

          let defaultFormulaTypeSetting = find(settings, { settingName: 'DefaultFormulaType' });
          defaultFormulaTypeSetting = defaultFormulaTypeSetting ?
            defaultFormulaTypeSetting.settingValue : null;

          defaultFormulaType = find(formulaTypes, { value: defaultFormulaTypeSetting });
          defaultFormulaType = defaultFormulaType || null;
        }

        this.setState({
          defaultFormulaType,
          formulaTypes,
        });
      }
    }

    saveFormula() {
      const { client } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
        const formula = Object.assign({}, this.state.formula);
        formula.text = formula.text;
        formula.formulaType = formula.formulaType.key;
        delete formula.provider;
        delete formula.enteredBy;
        // delete formula.date;

        this.props.clientFormulasActions.postClientFormulas(client.id, formula)
          .then((response) => {
            this.goBack();
            this.props.navigation.state.params.onNavigateBack();
          }).catch((error) => {
          });
      } else if (this.props.navigation.state.params.actionType === 'update') {
        const formula = Object.assign({}, this.state.formula);
        formula.text = formula.text;
        formula.formulaType = formula.formulaType.key;
        delete formula.provider;
        delete formula.enteredBy;
        delete formula.store;
        // delete formula.date;
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
            { (this.props.clientFormulasState.isLoading || this.props.settingsState.isLoading) &&
            <LoadingOverlay />
                }
            <ClienteFormulaHeader rootProps={this.props} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
              <View style={styles.topView} />
              <InputGroup>
                <ProviderInput
                  showFirstAvailable={false}
                  placeholder={false}
                  style={styles.innerRow}
                  selectedProvider={this.state.formula.enteredBy}
                  label="Added By"
                  iconStyle={styles.carretIcon}
                  avatarSize={20}
                  navigate={this.props.navigation.navigate}
                  onChange={this.onChangeEnteredBy}
                  onPress={this.handlePressProvider}
                  headerProps={{ title: 'Providers', ...this.cancelButton() }}
                />
                <InputDivider />
                <InputPicker
                  label="Type"
                  value={this.state.formula ? this.state.formula.formulaType : this.state.defaultFormulaType}
                  onChange={this.onChangeType}
                  defaultOption={this.state.defaultFormulaType}
                  options={this.state.formulaTypes}
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
                  icon={!this.state.formula.date ? false : 'default'}
                  onPress={this.onPressDate}
                  valueStyle={this.state.formula.date == null ? styles.dateValueStyle : {}}
                  selectedDate={this.state.formula.date == null ? 'Optional' : moment(this.state.formula.date).format('DD MMMM YYYY')}
                />
                <InputDivider />
                <ProviderInput
                  showFirstAvailable={false}
                  placeholder={false}
                  style={styles.innerRow}
                  selectedProvider={this.state.formula.provider}
                  label="Provider"
                  iconStyle={styles.carretIcon}
                  avatarSize={20}
                  navigate={this.props.navigation.navigate}
                  onChange={this.onChangeProvider}
                  onPress={this.handlePressProvider}
                  headerProps={{ title: 'Providers', ...this.cancelButton() }}
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
  settingsState: state.settingsReducer,
  groupedSettings: groupedSettingsSelector(state),
});

const mapActionsToProps = dispatch => ({
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
  clientFormulasActions: bindActionCreators({ ...clientFormulasActions }, dispatch),
});

ClientFormula.defaultProps = {

};

ClientFormula.propTypes = {
  groupedSettings: PropTypes.any.isRequired,
  settingsState: PropTypes.any.isRequired,
  clientFormulasActions: PropTypes.shape({
    postClientFormulas: PropTypes.func.isRequired,
    putClientFormulas: PropTypes.func.isRequired,
    selectProvider: PropTypes.func.isRequired,
  }).isRequired,
  clientFormulasState: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  settingsActions: PropTypes.shape({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(ClientFormula);
