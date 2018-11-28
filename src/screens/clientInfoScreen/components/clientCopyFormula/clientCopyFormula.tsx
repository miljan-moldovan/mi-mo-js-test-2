import * as React from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import createStyleSheet from './styles';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';

import {
  InputGroup,
  InputRadioGroup,
} from '../../../../components/formHelpers';
import headerStyles from '../../../../constants/headerStyles';
import SalonHeader from '../../../../components/SalonHeader';

const formulaTypes = [
  { id: formulaTypesEnum.Color, name: 'Color' },
  { id: formulaTypesEnum.Perm, name: 'Perm' },
  { id: formulaTypesEnum.Skin, name: 'Skin' },
  { id: formulaTypesEnum.Nail, name: 'Nail' },
  { id: formulaTypesEnum.Massage, name: 'Massage' },
  { id: formulaTypesEnum.Hair, name: 'Hair' },
  { id: formulaTypesEnum.NULL, name: 'NULL' },
];



interface Props {
  navigation: any;
  clientFormulasActions: any;
  clientFormulasState: any;
}

interface State {
  styles: any;
  client: any;
  selectedFormula: any;
}

class ClientCopyFormula extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let subtitle = 'Client Info';
    if (params && params.client) {
      subtitle = `${params.client.name} ${params.client.lastName}`;
    }

    const canSave = params.canSave || false;
    const handleDone = navigation.state.params.handleDone ?
      navigation.state.params.handleDone :
      () => { Alert.alert('Not Implemented'); };


    const styles = createStyleSheet();

    return ({
      header: (
        <SalonHeader
          title="Copy Formula"
          subTitle={subtitle}
          headerLeft={(
            <SalonTouchableOpacity
              onPress={navigation.goBack}
              style={{ paddingLeft: 10 }}
            >
              <Text style={styles.headerLeftText}>
                  Cancel
              </Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity
              style={{ paddingRight: 10 }}
              disabled={!canSave}
              onPress={handleDone}
            >
              <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
              Copy
              </Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    });
  };

  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }

    return 0;
  }

  constructor(props) {
    super(props);

    const { client } = props.navigation.state.params;

    this.state = {
      styles: createStyleSheet(),
      client,
      selectedFormula: null,
    };
  }

  componentWillMount() {
    this.getFormulas();
  }

  getFormulaTypeName = (id) => {
    const type = find(formulaTypes, { id });
    return type.name;
  }

  getFormulas = () => {
    this.props.clientFormulasActions.getClientFormulas(this.state.client.id).then((response) => {
      if (response.data.error) {
        this.props.clientFormulasActions.setFilteredFormulas([]);
        this.props.clientFormulasActions.setFormulas([]);
      } else {
        const formulas = this.props.clientFormulasState.formulas.sort(ClientCopyFormula.compareByDate);
        this.props.clientFormulasActions.setFilteredFormulas(formulas);
      }
    });
  }

  renderOption = option => (
    <View style={this.state.styles.optionContainer}>
      <SalonDateTxt
        dateFormat="MMM. DD YYYY"
        value={option.date}
        valueColor="#000000"
        valueSize={12}
        fontWeight="500"
      />
      <Text style={this.state.styles.formulaType}>{this.getFormulaTypeName(option.formulaType)}</Text>
      <Text style={this.state.styles.italicText}> by {option.stylistName}</Text>
    </View>
  )

  onPressInputGroup = (option, index) => {
    this.setState({ selectedFormula: option });
    this.props.navigation.setParams({ handleDone: this.handleDone, canSave: true });
  }

  handleDone = () => {
    this.props.navigation.state.params.handleSaveCopy ?
      this.props.navigation.state.params.handleSaveCopy(this.state.selectedFormula)
      :
      this.props.navigation.navigation.goBack();
  }

  render() {
    return (
      <View style={this.state.styles.container}>
        <View style={this.state.styles.formulasScroller}>
          <ScrollView style={{ alignSelf: 'stretch' }}>
            <View style={{ marginTop: 15.5, borderColor: 'transparent', borderWidth: 0 }} />
            <InputGroup>
              <InputRadioGroup
                options={this.props.clientFormulasState.formulas}
                defaultOption={this.state.selectedFormula}
                onPress={this.onPressInputGroup}
                renderOption={this.renderOption}
              />
            </InputGroup>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default ClientCopyFormula;
