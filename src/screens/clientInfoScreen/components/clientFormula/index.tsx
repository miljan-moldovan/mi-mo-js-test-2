import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { find } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import clientFormulasActions from '../../../../redux/actions/clientFormulas';
import settingsActions from '../../../../redux/actions/settings';
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
import createStyleSheet from './stylesClientFormula';
import headerStyles from '../../../../constants/headerStyles';
import SalonHeader from '../../../../components/SalonHeader';


interface Props {
  navigation: any;
  client: any;
  settingsActions: any;
  settingsState: any;
  formCache: any;
  userInfoState: any;
  clientFormulasActions: any;
  clientFormulasState: any;
}

interface State {
  styles: any;
  client: any;
  formula: {
    date: any;
    formulaType: any;
    provider: any;
    text: string;
    stylistName: string;
    store: any
  },
  isLoading: boolean;
  defaultFormulaType: any;
  formulaTypes: any;
  datePickerOpen: boolean;
  shouldSave: boolean;
}

class ClientFormula extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const canSave = params.canSave || false;
    const title = params.actionType === 'update'
      ? 'Edit Formula'
      : 'New Formula';


    const styles = createStyleSheet();

    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={
            <SalonTouchableOpacity
              wait={3000}
              onPress={navigation.getParam('handleGoBack', () => {})}
            >
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              disabled={!canSave}
              wait={3000}
              onPress={navigation.getParam('handlePress', () => {})}
            >
              <Text
                style={[
                  styles.rightButtonText,
                  { color: canSave ? '#FFFFFF' : '#19428A' },
                ]}
              >
                Save
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props: Props) {
    super(props);

    const { client } = props.navigation.state.params;

    props.settingsActions.getSettingsByName(
      'AvailableFormulaTypes',
      (result, availableFormulaTypes) => {
        props.settingsActions.getSettingsByName(
          'DefaultFormulaType',
          (result, defaultFormulaType) => {
            this.loadFormulaTypes(availableFormulaTypes, defaultFormulaType);
          }
        );
      }
    );

    this.state = {
      styles: createStyleSheet(),
      client,
      formula: {
        date: moment(),
        formulaType: null,
        provider: {},
        text: '',
        stylistName: '',
        store: null,
      },
      isLoading: true,
      defaultFormulaType: null,
      formulaTypes: [],
      datePickerOpen: false,
      shouldSave: false,
    };
  }

  componentWillMount () {}

  handleSaveCopy = copied => {

    const { formula } = this.state;
    formula.text = copied.text;
    formula.date = copied.date;
    formula.provider = copied.stylistName
      ? {
        fullName: copied.stylistName,
        name: copied.stylistName.split(' ')[0],
        lastName: copied.stylistName.split(' ')[1],
      }
      : null;

    const formulaType = find(this.state.formulaTypes, {
      key: copied.formulaType,
    });
    formula.formulaType = formulaType;

    this.setState (
      {formula, defaultFormulaType: formulaType},
      this.checkCanSave
    );
  };

  goBack () {
    this.props.navigation.goBack ();
  }

  handleClientSelection = client => {};

  onChangeType = value => {
    const newFormula = this.state.formula;
    newFormula.formulaType = value;
    this.setState ({formula: newFormula}, this.checkCanSave);
  };

  toogledate = () => {
    this.setState ({datePickerOpen: !this.state.datePickerOpen});
  };

  cancelButton = () => ({
    leftButton: (
      <Text style={{paddingLeft: 10, fontSize: 14, color: 'white'}}>
        Cancel
      </Text>
    ),
    leftButtonOnPress: navigation => {
      navigation.goBack ();
    },
    dismissOnSelect: true,
  });

  handlePressProvider = onChangeProvider => {
    const {navigate} = this.props.navigation;
  };

  onChangeProvider = provider => {
    const { formula } = this.state;
    formula.provider = provider;

    this.setState({ formula }, this.checkCanSave);
  };

  goToCopy = () => {
    const { navigate } = this.props.navigation;

    navigate('ClientCopyFormula', {
      transition: 'SlideFromBottom',
      ...this.props,
      client: this.state.client,
      handleSaveCopy: this.handleSaveCopy,
    });
  };

  goToAssociatedAppt = () => {
    Alert.alert('Not Implemented');
  };

  checkCanSave = () => {
    const { formula } = this.state;

    if (formula.text && formula.text.length > 0 && formula.formulaType && formula.date) {
      this.props.navigation.setParams({ canSave: true });
    } else {
      this.props.navigation.setParams({ canSave: false });
    }
  };

  onChangeText = txtFormula => {
    const { formula } = this.state;
    formula.text = txtFormula;
    this.setState({ formula, shouldSave: true }, this.checkCanSave);
  };

  loadFormulaTypes = (
    availableFormulaTypesSetting,
    defaultFormulaTypeSetting
  ) => {
    if (availableFormulaTypesSetting && defaultFormulaTypeSetting) {
      const {settings} = this.props.settingsState;

      const formulaTypes = [];
      let defaultFormulaType = null;

      if (settings) {
        let availableFormulaTypes = availableFormulaTypesSetting
          ? availableFormulaTypesSetting.settingValue
          : false;

        availableFormulaTypes = availableFormulaTypes &&
          availableFormulaTypes.split (',').length > 0
          ? availableFormulaTypes.split (',')
          : ['Default'];
        for (let i = 0; i < availableFormulaTypes.length; i += 1) {
          formulaTypes.push ({
            key: formulaTypesEnum[availableFormulaTypes[i]],
            value: availableFormulaTypes[i],
          });
        }

        defaultFormulaType = defaultFormulaTypeSetting
          ? defaultFormulaTypeSetting.settingValue
          : null;

        defaultFormulaType = find (formulaTypes, {value: defaultFormulaType});
        defaultFormulaType = defaultFormulaType || null;
      }

      this.setState (
        {
          defaultFormulaType,
          formulaTypes,
        },
        this.loadFormulaData
      );
    } else {
      this.setState ({isLoading: false}, this.checkCanSave);
    }
  };

  loadFormulaData = () => {
    const onEditionFormula = this.props.navigation.state.params.formula;

    let { formula } = this.state;

    if (this.props.navigation.state.params.actionType === 'update') {
      formula = Object.assign({}, onEditionFormula);

      const provider = formula.stylistName
        ? {
          fullName: formula.stylistName,
          name: formula.stylistName.split(' ')[0],
          lastName: formula.stylistName.split(' ')[1],
        }
        : null;

      const formulaType = find(this.state.formulaTypes, {
        key: formula.formulaType,
      });
      formula.formulaType = formulaType;
      formula.provider = provider;

      const cachedForm = fetchFormCache(
        'ClientFormulaUpdate',
        onEditionFormula.id,
        this.props.formCache,
      );

      if (onEditionFormula.id === cachedForm.id) {
        formula = cachedForm;
      }
    } else if (this.props.navigation.state.params.actionType === 'new') {
      formula.formulaType = this.state.defaultFormulaType;
      formula.provider = this.props.userInfoState.currentEmployee
    }

    this.setState({ formula, isLoading: false }, this.checkCanSave);

    this.props.navigation.setParams({
      handlePress: () => this.saveFormula(),
      handleGoBack: () => this.goBack(),
    });
  };

  saveFormula () {
    const { client } = this.props.navigation.state.params;

    if (this.props.navigation.state.params.actionType === 'new') {
      const formula = Object.assign({}, this.state.formula);
      formula.text = formula.text;
      formula.formulaType = formula.formulaType.key;
      formula.stylistName = formula.provider
        ? formula.provider.fullName
        : null;
      delete formula.provider;
      this.props.clientFormulasActions
        .postClientFormulas(client.id, formula)
        .then(response => {
          this.goBack();
          this.props.navigation.state.params.onNavigateBack();
        })
        .catch(error => {});
    } else if (this.props.navigation.state.params.actionType === 'update') {
      const formula = Object.assign({}, this.state.formula);
      formula.text = formula.text;
      formula.formulaType = formula.formulaType.key;
      formula.stylistName = formula.provider
        ? formula.provider.fullName
        : null;
      delete formula.provider;
      delete formula.store;
      this.props.clientFormulasActions
        .putClientFormulas(client.id, formula)
        .then(response => {
          this.goBack();
          this.props.navigation.state.params.onNavigateBack();
        })
        .catch(error => {});
    }
  }

  handleChangedate = dateDateObj => {
    const { formula } = this.state;
    formula.date = moment(dateDateObj);
    this.setState({ formula, shouldSave: true }, this.checkCanSave);
  };

  render () {
    return (
      <View style={this.state.styles.container}>
        {(this.props.clientFormulasState.isLoading ||
          this.props.settingsState.isLoading ||
          this.state.isLoading) &&
          <LoadingOverlay />}
        <KeyboardAwareScrollView
          ref="scroll"
          extraHeight={300}
        >
          <View style={this.state.styles.topView} />
          <InputGroup>
            <InputPicker
              label="Type"
              value={
                this.state.formula
                  ? this.state.formula.formulaType
                  : this.state.defaultFormulaType
              }
              onChange={this.onChangeType}
              defaultOption={this.state.defaultFormulaType}
              options={this.state.formulaTypes}
            />
            <InputDivider />
            <InputText
              placeholder="Write formula"
              onChangeText={this.onChangeText}
              value={this.state.formula.text}
              multiline
            />
          </InputGroup>
          <SectionDivider />
          <InputGroup style={this.state.styles.inputGroupAssociated}>
            <SalonTimePicker
              label="Date"
              noIcon={this.state.formula.date === null}
              icon={
                <FontAwesome
                  style={{ fontSize: 20, color: '#727A8F', marginLeft: 16 }}
                >
                  {Icons.timesCircle}
                </FontAwesome>
              }
              mode="date"
              placeholder="Optional"
              valueStyle={
                this.state.formula.date === null ? this.state.styles.dateValueStyle : {}
              }
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
              style={this.state.styles.innerRow}
              selectedProvider={this.state.formula.provider}
              label="Provider"
              iconStyle={this.state.styles.carretIcon}
              avatarSize={20}
              navigate={this.props.navigation.navigate}
              onChange={this.onChangeProvider}
              onPress={this.handlePressProvider}
              headerProps={{ title: 'Providers', ...this.cancelButton() }}
            />
          </InputGroup>
          <SectionDivider />
          <InputGroup style={this.state.styles.inputGroupCopy}>
            <InputButton
              style={this.state.styles.inputGroupCopyButton}
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
  clientFormulasActions: bindActionCreators(
    { ...clientFormulasActions },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientFormula);
