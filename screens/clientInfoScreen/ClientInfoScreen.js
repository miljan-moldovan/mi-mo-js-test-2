import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ClientDetails from './components/ClientDetails';
import ClientFormulas from './components/clientFormulas';
import ClientNotes from './components/clientNotes';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';


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
  headerRightText: { fontSize: 14 },
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
    alignItems: 'flex-start',
    justifyContent: 'center',
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

    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity onPress={() => { navigation.goBack(); }}>
          <Text style={styles.leftButtonText}>
            <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
          </Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        showDoneButton ? <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => {
          if (navigation.state.params.handleDone) {
            navigation.state.params.handleDone();
          }
        }}
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

    this.state = {
      index: 0,
      loading: true,
      editionMode: params && params.editionMode ? params.editionMode : true,
      client: params && params.client ? params.client : null,
      routes: [
        { key: '0', title: 'Details' },
        { key: '1', title: 'Notes' },
        { key: '2', title: 'Formulas' },
      ],
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
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

  renderHeader = props => (
    <TabBar
      {...props}
      tabStyle={[styles.tabLabel, { backgroundColor: 'transparent' }]}
      style={{ backgroundColor: 'transparent', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#C0C1C6' }}
      renderLabel={this.renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#1DBF12', height: 2 }}
    />
  );

  renderScene = SceneMap({
    0: () => <ClientDetails setHandleDone={this.setHandleDone} setCanSave={this.setCanSave} editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
    1: () => <ClientNotes editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
    2: () => <ClientFormulas editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
  })


  render() {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
          useNativeDriver
        />
      </View>
    );
  }
}
