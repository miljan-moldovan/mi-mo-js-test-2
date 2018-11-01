import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { find } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import clientFormulasActions from '../../../../actions/clientFormulas';
import settingsActions from '../../../../actions/settings';
import fetchFormCache from '../../../../utilities/fetchFormCache';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import groupedSettingsSelector from '../../../../redux/selectors/settingsSelector';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';
import SalonTimePicker from '../../../../components/formHelpers/components/SalonTimePicker';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';


import {
  InputText,
  InputGroup,
  InputButton,
  InputDivider,
  SectionDivider,
  InputPicker,
  ProviderInput,
} from '../../../../components/formHelpers';
import styles from './stylesClientFormula';
import headerStyles from '../../../../constants/headerStyles';
import SalonHeader from '../../../../components/SalonHeader';

class ClientFormula extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const canSave = params.canSave || false;
    const title = params.actionType === 'update' ? 'Edit Formula' : 'New Formula';

    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={(
            <SalonTouchableOpacity style={{ paddingLeft: 10 }} wait={3000} onPress={navigation.getParam('handleGoBack', () => {})}>
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity style={{ paddingRight: 10 }} disabled={!canSave} wait={3000} onPress={navigation.getParam('handlePress', () => {})}>
              <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Save</Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    };
  }


  constructor(props) {
    super(props);

    const { client } = props.navigation.state.params;
    props.settingsActions.getSettingsByName(
      'AvailableFormulaTypes',
      (result, availableFormulaTypes) => {
        props.settingsActions.getSettingsByName('DefaultFormulaType', (result, defaultFormulaType) => {
          this.loadFormulaTypes(availableFormulaTypes, defaultFormulaType);
        });
      },
    );


    this.state = {
      client,
      formula: {
        date: null,
        formulaType: null,
        provider: {},
        enteredBy: this.props.userInfoState.currentEmployee,
        text: '',
      },
      isLoading: true,
      defaultFormulaType: null,
      formulaTypes: [],
      datePickerOpen: false,
    };
  }

  componentWillMount() {

  }


  handleSaveCopy = (copied) => {
    const { formula } = this.state;
    formula.text = copied.text;
    formula.date = copied.date;
    formula.enteredBy = copied.stylistName ? { fullName: copied.stylistName, name: copied.stylistName.split(' ')[0], lastName: copied.stylistName.split(' ')[1] } : null;


    const formulaType = find(this.state.formulaTypes, { key: copied.formulaType });
    formula.formulaType = formulaType;

    this.setState({ formula, defaultFormulaType: formulaType }, this.checkCanSave);
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

  toogledate = () => {
    this.setState({ datePickerOpen: !this.state.datePickerOpen });
  }

  cancelButton = () => ({
    leftButton: <Text style={{ paddingLeft: 10, fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
    dismissOnSelect: true,
  });


    handlePressProvider = (onChangeProvider) => {
      const { navigate } = this.props.navigation;
    }

    onChangeEnteredBy = (enteredBy) => {
      const { formula } = this.state;
      formula.enteredBy = enteredBy;
      this.setState({ formula }, this.checkCanSave);
    }

    onChangeProvider = (provider) => {
      const { formula } = this.state;
      formula.provider = provider;

      this.setState({ formula }, this.checkCanSave);
    }

    goToCopy = () => {
      const { navigate } = this.props.navigation;

      navigate('ClientCopyFormula', {
        transition: 'SlideFromBottom',
        ...this.props,
        client: this.state.client,
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

    loadFormulaTypes = (availableFormulaTypesSetting, defaultFormulaTypeSetting) => {
      if (availableFormulaTypesSetting && defaultFormulaTypeSetting) {
        const { settings } = this.props.settingsState;


        const formulaTypes = [];
        let defaultFormulaType = null;

        if (settings) {
          let availableFormulaTypes = availableFormulaTypesSetting ?
            availableFormulaTypesSetting.settingValue : false;

          availableFormulaTypes = availableFormulaTypes && availableFormulaTypes.split(',').length > 0 ? availableFormulaTypes.split(',') : ['Default'];
          for (let i = 0; i < availableFormulaTypes.length; i += 1) {
            formulaTypes.push({ key: formulaTypesEnum[availableFormulaTypes[i]], value: availableFormulaTypes[i] });
          }

          defaultFormulaType = defaultFormulaTypeSetting ?
            defaultFormulaTypeSetting.settingValue : null;

          defaultFormulaType = find(formulaTypes, { value: defaultFormulaType });
          defaultFormulaType = defaultFormulaType || null;
        }

        this.setState({
          defaultFormulaType,
          formulaTypes,
        }, this.loadFormulaData);
      } else {
        this.setState({ isLoading: false }, this.checkCanSave);
      }
    }

    loadFormulaData = () => {
      const onEditionFormula = this.props.navigation.state.params.formula;

      let { formula } = this.state;

      if (this.props.navigation.state.params.actionType === 'update') {
        formula = Object.assign({}, onEditionFormula);


        const provider = formula.stylistName ? { fullName: formula.stylistName, name: formula.stylistName.split(' ')[0], lastName: formula.stylistName.split(' ')[1] } : null;

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

      this.setState({ formula, isLoading: false }, this.checkCanSave);

      this.props.navigation.setParams({
        handlePress: () => this.saveFormula(),
        handleGoBack: () => this.goBack(),
      });
    }

    saveFormula() {
      const { client } = this.props.navigation.state.params;

      if (this.props.navigation.state.params.actionType === 'new') {
        const formula = Object.assign({}, this.state.formula);
        formula.text = formula.text;
        formula.formulaType = formula.formulaType.key;
        formula.stylistName = formula.enteredBy ? formula.enteredBy.fullName : null;
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
        formula.stylistName = formula.enteredBy ? formula.enteredBy.fullName : null;
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

    handleChangedate = (dateDateObj) => {
      const { formula } = this.state;
      formula.date = moment(dateDateObj);
      this.shouldSave = true;
      this.setState({ formula }, this.checkCanSave);
    }

    render() {
      return (
        <View style={styles.container}>
          { (this.props.clientFormulasState.isLoading
              || this.props.settingsState.isLoading
             || this.state.isLoading) &&
             <LoadingOverlay />
                }
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
              <SalonTimePicker
                label="Date"
                noIcon={this.state.formula.date == null}
                icon={<FontAwesome style={{ fontSize: 20, color: '#727A8F', marginLeft: 16 }}>{Icons.timesCircle}</FontAwesome>}
                mode="date"
                placeholder="Optional"
                valueStyle={this.state.formula.date == null ? styles.dateValueStyle : { }}
                value={this.state.formula.date}
                isOpen={this.state.datePickerOpen}
                onChange={this.handleChangedate}
                toggle={this.toogledate}
                format="DD MMMM YYYY"
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

      );
    }
}

const mapStateToProps = state => ({
  clientFormulasState: state.clientFormulasReducer,
  userInfoState: state.userInfoReducer,
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
  // client: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  settingsActions: PropTypes.shape({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(ClientFormula);
