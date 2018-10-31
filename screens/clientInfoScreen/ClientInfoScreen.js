import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ClientDetails from './components/clientDetails';
import ClientFormulas from './components/clientFormulas';
import ClientNotes from './components/clientNotes';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    height: 39.5,
    // paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    lineHeight: 14,
  },
  tabLabelActive: {
    color: '#1DBF12',
  },
  tabIcon: {
    marginRight: 5,
  },
  headerLeftText: { fontSize: 14, color: 'white' },
  headerRightText: { paddingRight: 10, fontSize: 14 },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
  },
  backContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
});

export default class ClientInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'Client Info';
    if (params && params.client) {
      title = `${params.client.name} ${params.client.lastName}`;
    }

    const props = this.props;

    const canSave = params.canSave || false;
    const showDoneButton = params.showDoneButton;
    const handleDone = navigation.state.params.handleDone ?
      navigation.state.params.handleDone :
      () => { alert('Not Implemented'); };

    const handleBack = params.handleBack ?
      () => { params.handleBack(); navigation.goBack(); } :
      navigation.goBack;

    return ({
      ...headerStyles,
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity onPress={handleBack}>
          <View style={styles.backContainer}>
            <FontAwesome style={styles.backIcon}>
              {Icons.angleLeft}
            </FontAwesome>
            <Text style={styles.leftButtonText}>
                    Back
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        showDoneButton ? <SalonTouchableOpacity
          disabled={!canSave}
          onPress={handleDone}
        >
          <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
          Done
          </Text>
                         </SalonTouchableOpacity> : null
      ),
    });
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ handleDone: this.handleDone, canSave: false, showDoneButton: true });

    const client = params && params.client ? params.client : null;
    const canDelete = params && params.canDelete ? params.canDelete : false;
    const isWalkIn = client && client.id === 1;
    let editionMode = params && params.editionMode ? params.editionMode : true;
    editionMode = editionMode && !isWalkIn;

    this.state = {
      index: 0,
      loading: true,
      editionMode,
      client,
      canDelete,
      routes: [
        { key: '0', title: 'Details' },
        { key: '1', title: 'Notes' },
        { key: '2', title: 'Formulas' },
      ],
    };
  }

  componentWillMount() {

  }

  handleIndexChange = (index) => {
    const showDoneButton = index === 0;

    this.props.navigation.setParams({ showDoneButton });

    this.setState({ index });
  };

  setCanSave = (canSave) => {
    this.props.navigation.setParams({ canSave });
  }

  setHandleDone = (handleDone) => {
    this.props.navigation.setParams({ handleDone });
  }


  setHandleBack = (handleBack) => {
    this.props.navigation.setParams({ handleBack });
  }

  renderLabel = ({ position, navigationState }) => ({ route, index }) => (

    <Text
      style={
          this.state.index === index
          ? [styles.tabLabelText, styles.tabLabelActive]
          : styles.tabLabelText
        }
    >
      {` ${route.title}`}
    </Text>

  );

  renderTabBar = props => (
    <TabBar
      {...props}
      tabStyle={[styles.tabLabel, { backgroundColor: 'transparent' }]}
      style={{ backgroundColor: 'transparent', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#C0C1C6' }}
      renderLabel={this.renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#1DBF12', height: 2 }}
    />
  );

  renderScene = SceneMap({
    0: () => (<ClientDetails
      canDelete={this.state.canDelete}
      actionType="update"
      setHandleDone={this.setHandleDone}
      setHandleBack={this.setHandleBack}
      setCanSave={this.setCanSave}
      editionMode={this.state.editionMode}
      client={this.state.client}
      navigation={this.props.navigation}
      {...this.props}
    />),
    1: () => <ClientNotes editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
    2: () => <ClientFormulas editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
  })

  render() {
    return (
      <View style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
          useNativeDriver
        />
      </View>
    );
  }
}
