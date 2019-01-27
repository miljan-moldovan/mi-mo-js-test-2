import * as React from 'react';
import { View, Text, SectionList, FlatList } from 'react-native';
import {
  InputGroup,
  InputButton,
  InputDivider,
  InputSwitch,
  SectionTitle,
} from '../../components/formHelpers';
import Icon from '@/components/common/Icon';
import SalonTouchableHighlight from '../../components/SalonTouchableHighlight';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonHeader from '../../components/SalonHeader';
import styles from './style';

const SelectedWithRemove = props => (
  <View style={{ flexDirection: 'row' }}>
    <Text
      style={styles.styleSelectorWithRemove}
    >
      {props.value}
    </Text>
    <SalonTouchableHighlight onPress={() => props.onPressRemove()}>
      <Icon name="timesCircle" size={20} color="#C0C1C6" type="solid" />
    </SalonTouchableHighlight>
  </View>
);

class ApptBookViewOptionsScreen extends React.Component<any, any> {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <SalonHeader
        title="View Options"
        headerLeft={
          <SalonTouchableOpacity
            wait={300}
            style={styles.leftButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.leftButtonText}>Cancel</Text>
          </SalonTouchableOpacity>
        }
        headerRight={
          <SalonTouchableOpacity
            wait={300}
            style={styles.rightButton}
            onPress={navigation.getParam('handlePress', () => {
            })}
          >
            <Text style={styles.rightButtonText}>Done</Text>
          </SalonTouchableOpacity>
        }
      />
    ),
  });

  private shouldSave: boolean;

  constructor(props) {
    super(props);

    const { filterOptions } = this.props.apptBookState;

    this.shouldSave = false;
    this.state = {
      options: filterOptions,
    };

    this.props.employeeOrderActions.getEmployees();
    this.props.navigation.setParams({
      handlePress: this.saveOptions,
      hideTabBar: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
  }

  saveOptions = () => {
    const {
      company,
      position,
      showMultiBlock,
      showOffEmployees,
      showRoomAssignments,
      showAssistantAssignments,
    } = this.state.options;
    this.props.apptBookActions.setFilterOptionCompany(company);
    this.props.apptBookActions.setFilterOptionPosition(position);
    this.props.apptBookActions.setFilterOptionShowOffEmployees(showOffEmployees);
    this.props.apptBookActions.setFilterOptionRoomAssignments(showRoomAssignments);
    this.props.apptBookActions.setFilterOptionAssistantAssignments(showAssistantAssignments);
    this.props.apptBookActions.setFilterOptionShowMultiBlock(showMultiBlock);

    this.props.apptBookActions.setGridView();
    this.goBack();
  };

  goBack = () => {
    this.props.navigation.setParams({ hideTabBar: false });
    this.props.navigation.goBack();
  };

  handleChangeCompany = company => {
    this.setState({ options: { ...this.state.options, company } });
  };

  handleChangePosition = position => {
    this.setState({ options: { ...this.state.options, position } });
  };

  handleRemoveCompany = () =>
    this.setState({ options: { ...this.state.options, company: null } });

  handleRemovePosition = () =>
    this.setState({ options: { ...this.state.options, position: null } });

  goToEmployeesOrder = () => {
    this.props.navigation.navigate('ApptBookSetEmployeeOrder', {
      transition: 'SlideFromBottom',
      dismissOnSelect: true,
    });
  };

  getData = () => {
    const { position, company } = this.state.options;

    const dataArray = [];
    const employeeOptions = {
      title: 'EMPLOYEE OPTIONS',
      data: [
        {
          impolyeeOption: true,
          dataForRender: [
            {
              label: 'Filter By Position',
              onPress: () => {
                this.props.navigation.navigate('FilterByPosition', {
                  transition: 'SlideFromBottom',
                  onChangePosition: this.handleChangePosition,
                  dismissOnSelect: true,
                  selectedPosition: position,
                });
              },
              value: position === null
                ? null
                : (
                  <SelectedWithRemove
                    onPressRemove={this.handleRemovePosition}
                    value={position.name}
                  />
                ),
            },
            {
              label: 'Filter By Company',
              onPress: () => {
                this.props.navigation.navigate('FilterByCompany', {
                  transition: 'SlideFromBottom',
                  onChangeCompany: this.handleChangeCompany,
                  dismissOnSelect: true,
                  selectedCompany: company,
                });
              },
              value: company === null
                ? null
                : (
                  <SelectedWithRemove
                    onPressRemove={this.handleRemoveCompany}
                    value={company.name}
                  />
                ),
            },
            {
              label: 'Set Employee Order',
              onPress: () => this.goToEmployeesOrder(),
              value: this.props.employeeOrderState.orderInitials,
            },
            {
              label: 'Service Check',
              onPress: () => {
                this.props.navigation.navigate('ServiceCheck', {
                  transition: 'SlideFromBottom',
                  dismissOnSelect: true,
                });
              },
              value: this.state.options.serviceCheck,
            },
          ],
        },
      ],
    };


    const displayOptionsDataForRender = [
      {
        text: 'Room Assigments',
        value: this.state.options.showRoomAssignments,
        onChange: (state) => {
          const { options } = this.state;
          options.showRoomAssignments = !options.showRoomAssignments;
          this.shouldSave = true;
          this.setState({ options });
        },
      },
      {
        text: 'Assistant Assigments',
        value: this.state.options.showAssistantAssignments,
        onChange: (state) => {
          const { options } = this.state;
          options.showAssistantAssignments = !options.showAssistantAssignments;
          this.shouldSave = true;
          this.setState({ options });
        },
      },
      {
        text: 'Client name in every blocks',
        value: this.state.options.showMultiBlock,
        onChange: (state) => {
          const { options } = this.state;
          options.showMultiBlock = !options.showMultiBlock;
          this.shouldSave = true;
          this.setState({ options });
        },
      },
    ];

    if (!this.props.onlyOwnAppt) {
      displayOptionsDataForRender.push({
        text: 'Show employees that are off',
        value: this.state.options.showOffEmployees,
        onChange: (state) => {
          const { options } = this.state;
          options.showOffEmployees = !options.showOffEmployees;
          this.shouldSave = true;
          this.setState({ options });
        },
      });
    }
    const displayOptions = {
      title: 'DISPLAY OPTIONS',
      data: [
        {
          impolyeeOption: false,
          dataForRender: displayOptionsDataForRender,
        },
      ],
    };

    if (!this.props.onlyOwnAppt) {
      dataArray.push(employeeOptions);
    }
    dataArray.push(displayOptions);
    
    return dataArray;
  };

  keyExtractor = (item, index) => item + index;

  renderSectionHeader = (props) => {
    const { section: { title } } = props;

    return <SectionTitle value={title} style={styles.styleForSectionTitle} />;
  };

  itemSeparatorComponent = () => <InputDivider />;

  renderItem = (props) => {
    const { item } = props;

    return (
      <InputGroup>
        <FlatList
          style={{ flex: 1 }}
          data={item.dataForRender}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={this.itemSeparatorComponent}
          renderItem={item.impolyeeOption ? this.renderButton : this.renderSwitcher}
        />
      </InputGroup>
    );
  };

  renderButton = (props) => {
    const { item } = props;
    return (
      <InputButton
        style={styles.styleForInputButton}
        labelStyle={{ color: '#110A24' }}
        onPress={item.onPress}
        label={item.label}
        icon={'default'}
        value={item.value}
      />
    );
  };

  renderSwitcher = (props) => {
    const { item } = props;
    return (
      <InputSwitch
        style={styles.heightForInputSwitch}
        textStyle={{ color: '#000000' }}
        onChange={item.onChange}
        value={item.value}
        text={item.text}
      />
    );
  };

  render() {
    const sections = this.getData();
    return (
      <SectionList
        sections={sections || []}
        style={styles.container}
        keyExtractor={this.keyExtractor}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        stickySectionHeadersEnabled={false}
      />
    );
  }
}


export default ApptBookViewOptionsScreen;
