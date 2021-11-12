import * as React from 'react';
import {
  View,
  ScrollView,
  Text,
  FlatList,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { find } from 'lodash';
import SalonSearchBar from '../../../../components/SalonSearchBar';
import SalonIcon from '../../../../components/SalonIcon';
import SalonBtnTag from '../../../../components/SalonBtnTag';
import SalonDateTxt from '../../../../components/SalonDateTxt';
import SalonCard from '../../../../components/SalonCard';
import FloatingButton from '../../../../components/FloatingButton';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import styles from './stylesClientFormulas';
import formulaTypesEnum from '../../../../constants/FormulaTypesEnum';
import LoadingOverlay from '../../../../components/LoadingOverlay';

const formulaTypes = [
  { id: formulaTypesEnum.Color, name: 'Color' },
  { id: formulaTypesEnum.Perm, name: 'Perm' },
  { id: formulaTypesEnum.Skin, name: 'Skin' },
  { id: formulaTypesEnum.Nail, name: 'Nail' },
  { id: formulaTypesEnum.Massage, name: 'Massage' },
  { id: formulaTypesEnum.Hair, name: 'Hair' },
  { id: formulaTypesEnum.NULL, name: 'NULL' },
];

const activeFilterTypeStyle = {
  icon: 'check',
  iconColor: '#FFFFFF',
  backgroundColor: '#1DBF12',
  valueColor: '#FFFFFF',
  iconSize: 8,
};

const inactiveFilterTypeStyle = {
  icon: 'square',
  iconColor: '#727A8F',
  backgroundColor: '#FFFFFF',
  valueColor: '#727A8F',
  iconSize: 16,
};

interface Props {
  navigation: any;
  editionMode: any;
  client: any;
  clientFormulasActions: any;
  clientFormulasState: any;
  handleOnNavigateBack?: any;
  settingsActions: any,
}

interface State {
  client: any;
  activeTypes: any;
  existingTypes: any;
  showDeleted: boolean;
}

class ClientFormulas extends React.Component<Props, State> {
  static flexFilter(list, info) {
    let matchesFilter: { (item:any) : boolean};
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;

      for (let n = 0; n < info.length; n += 1) {
        if (info[n].Field === 'formulaType') {
          const type = find(formulaTypes, { id: item.formulaType });
          const formulaType = type.name;

          if (formulaType.toLowerCase().indexOf(info[n].Values) > -1) {
            count += 1;
          }
        } else if (info[n].Field === 'service') {
          if (item.service.name.toLowerCase().indexOf(info[n].Values) > -1) {
            count += 1;
          }
        } else if ((typeof item[info[n].Field]) === 'string'
          && item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  static compareByDate(a, b) {
    if (a.date < b.date) { return 1; }
    if (a.date > b.date) { return -1; }

    return 0;
  }

  constructor(props: Props) {
    super(props);

    const { client } = this.props;

    this.state = {
      client,
      activeTypes: [],
      existingTypes: [],
      showDeleted: false,
    };
  }

  componentDidMount() {
    this.getFormulas();
    this.props.settingsActions.getSettingsByName('AvailableFormulaTypes', this.setFilterType);
  }

  setFilterType = (result, data) => {
    const newFilterTypes = data && data.settingValue && data.settingValue.split(',') || [];
    this.setState({
      activeTypes: newFilterTypes,
      existingTypes: [...newFilterTypes],
    });
  };

  onPressTagFilter = (value) => {
    const filterTypes = this.state.activeTypes;

    if (filterTypes.indexOf(value) > -1) {
      filterTypes.splice(filterTypes.indexOf(value), 1);
    } else {
      filterTypes.push(value);
    }
    this.setState({ activeTypes: filterTypes });
    this.filterFormulas(null, this.state.showDeleted);
  };

  getFormulas = () => {
    this.props.clientFormulasActions.getClientFormulas(this.state.client.id).then((response) => {
      if (response.data.error) {
        this.props.clientFormulasActions.setFilteredFormulas([]);
        this.props.clientFormulasActions.setFormulas([]);
      } else {
        const formulas = this.props.clientFormulasState.formulas.sort(ClientFormulas.compareByDate);
        this.props.clientFormulasActions.setFilteredFormulas(formulas);
      }
    });
  };

  getFormulaTypeName = (id) => {
    const type = find(formulaTypes, { id });
    return type.name;
  };

  filterFormulas(searchText: string, showDeleted?: boolean) {
    const baseFormulas = showDeleted ? this.props.clientFormulasState.formulas :
      this.props.clientFormulasState.formulas.filter(el => !el.isDeleted);

    let tagFormulas = [];
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'provider', Values: [searchText.toLowerCase()] },
        { Field: 'formulaType', Values: [searchText.toLowerCase()] },
        { Field: 'service', Values: [searchText.toLowerCase()] },
        { Field: 'date', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientFormulas.flexFilter(
        baseFormulas,
        criteria,
      );


      for (let i = 0; i < filtered.length; i += 1) {
        const formula = filtered[i];

        const type = this.getFormulaTypeName(formula.formulaType);

        const found = this.state.activeTypes.indexOf(type) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(ClientFormulas.compareByDate);
      this.props.clientFormulasActions.setFilteredFormulas(tagFormulas);
    } else {
      for (let i = 0; i < baseFormulas.length; i += 1) {
        const formula = baseFormulas[i];

        const type = this.getFormulaTypeName(formula.formulaType);

        const found = this.state.activeTypes.indexOf(type) !== -1;
        if (found) {
          tagFormulas.push(formula);
        }
      }

      tagFormulas = tagFormulas.sort(ClientFormulas.compareByDate);
      this.props.clientFormulasActions.setFilteredFormulas(tagFormulas);
    }
  }


  editFormula(formula) {
    const params = this.props.navigation.state.params || {};
    const { apptBook = false } = params;

    const { navigate } = this.props.navigation;

    navigate('ClientFormula', {
      actionType: 'update',
      transition: 'SlideFromBottom',
      formula,
      client: this.props.client,
      onNavigateBack: this.getFormulas,
      handleOnNavigateBack: this.props.handleOnNavigateBack,
      apptBook,
      ...this.props,
    });
  }

  onPressFloatingButton = () => {
    const { navigate } = this.props.navigation;
    navigate('ClientFormula', {
      transition: 'SlideFromBottom',
      actionType: 'new',
      ...this.props,
      client: this.props.client,
      onNavigateBack: this.getFormulas,
    });
  };

  renderListItem = ({ item, index }) => {
    return (
      <SalonCard
        key={index}
        containerStyles={styles.salonCardStyle}
        backgroundColor="#FFFFFF"
        headerChildren={[
          <View style={styles.formulaTags} key={Math.random().toString()}>
            <View style={styles.formulaHeaderLeft}>
              <SalonDateTxt
                dateFormat="MMM. DD"
                value={item.date}
                valueColor="#000000"
                valueSize={12}
                fontWeight="500"
              />
              <SalonDateTxt
                dateFormat=" YYYY"
                value={item.date}
                valueColor="#000000"
                valueSize={12}
                fontWeight="normal"
              />
            </View>
            <View style={styles.formulaTypeTag}>
              <Text style={styles.formulaType}>{this.getFormulaTypeName(item.formulaType)}</Text>
            </View>
            <SalonTouchableOpacity
              onPress={() => this.editFormula(item)}
              style={styles.salonTouchableStyle}
            >
              <FontAwesome style={styles.angleRight}>{Icons.angleRight}</FontAwesome>
            </SalonTouchableOpacity>
          </View>,
        ]}
        bodyChildren={[
          <View style={styles.bodyChildren} key={Math.random().toString()}>
            <Text style={styles.formulaTextTitle}>
              <Text style={[styles.formulaTextTitle, styles.boldText]}>
                {item.service.name}
              </Text>
              <Text style={styles.italicText}> by</Text>
              {item.stylistName}
            </Text>
            <Text style={styles.formulaText}>{item.store ? item.store.name : '--'}</Text>
          </View>,
        ]}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {
          this.props.clientFormulasState.isLoading && <LoadingOverlay />
        }
        <View style={styles.header}>
          <View style={styles.topSearchBar}>
            <SalonSearchBar
              // @ts-ignore
              containerStyle={styles.searchStyle}
              placeHolderText="Search"
              marginVertical={0}
              placeholderTextColor="#727A8F"
              searchIconPosition="left"
              iconsColor="#727A8F"
              fontColor="#727A8F"
              borderColor="transparent"
              backgroundColor="rgba(142, 142, 147, 0.24)"
              onChangeText={searchText => this.filterFormulas(searchText)}
            />
          </View>
          <View style={styles.tagsBar} >
            {
              this.state.existingTypes.map(item => (
                <View style={styles.tag} key={Math.random().toString()}>
                  <SalonBtnTag
                    // @ts-ignore
                    onPress={this.onPressTagFilter}
                    tagHeight={24}
                    value={item}
                    valueSize={10}
                    isVisible={this.state.activeTypes.indexOf(item) !== -1}
                    activeStyle={activeFilterTypeStyle}
                    inactiveStyle={inactiveFilterTypeStyle}
                  />
                </View>
              ))
            }
          </View>
        </View>
        <View style={styles.formulasScroller}>
          <ScrollView style={styles.scrollViewStyle}>
            <FlatList
              extraData={this.props}
              keyExtractor={({ item, index }: { item: any, index: any }) => index}
              style={styles.floatListStyle}
              data={this.props.clientFormulasState.filtered}
              renderItem={this.renderListItem}
            />
            <View style={styles.showDeletedButtonContainer}>
              <SalonTouchableOpacity
                style={styles.showDeletedButton}
                onPress={() => this.setState({ showDeleted: !this.state.showDeleted })}
              >
                <Text style={styles.showDeletedText}>
                  {this.state.showDeleted ? 'Hide deleted' : 'Show deleted'}
                </Text>
              </SalonTouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <FloatingButton
          rootStyle={styles.rootStyle}
          handlePress={this.onPressFloatingButton}
        >
          <SalonIcon tintColor="#FFFFFF" icon="plus" size={21} />
        </FloatingButton>
      </View>
    );
  }
}

export default ClientFormulas;
