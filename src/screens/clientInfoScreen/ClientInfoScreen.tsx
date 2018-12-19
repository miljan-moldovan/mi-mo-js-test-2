import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ClientDetails from './components/clientDetails';
import ClientFormulas from './components/clientFormulas';
import ClientNotes from './components/clientNotes';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';
import SalonAlert from '@/components/SalonAlert';
import createStyleSheet from './styles';


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};


interface Props {
  navigation: any;
}

interface State {
  styles: any;
  index: number;
  loading: boolean;
  editionMode: boolean;
  client:any;
  canDelete:boolean;
  routes: any
}

export default class ClientInfoScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'Client Info';
    if (params && params.client) {
      title = `${params.client.name} ${params.client.lastName}`;
    }

    const styles = createStyleSheet();

    const canSave = params.canSave || false;
    const handleDone = () => {
      if (navigation.state.params.handleDone) {
        navigation.state.params.handleDone();
      }
    }

    const handleBack = () => {
      const onPressRight = () => {
        params.setAlert(null)
        handleDone();
        if (params.handleBack) {
          params.handleBack();
        }
        navigation.goBack();
      }
      if(params.hasChanged) {
        const alert = {
          onPressRight,
          btnLeftText: 'Discard changes',
          btnRightText: 'Save changes',
          onPressLeft: () => {
            params.setAlert(null);
            if (params.handleBack) {
              params.handleBack();
            }
            navigation.goBack();
          },
          description: `Are you sure you want to discard changes for client ${title}`,
          title: 'Discard Changes?',
        }
        params.setAlert(alert)
      } else {
        onPressRight();
      }
    }

    return ({
      header: (
        <SalonHeader
          title={title}
          headerLeft={(
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
          )}
          headerRight={(
              <SalonTouchableOpacity
                disabled={!canSave}
                onPress={handleDone}
              >
                <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
                  Save
                </Text>
              </SalonTouchableOpacity>
          )}
        />
      ),
    });
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.props.navigation.setParams({ handleDone: ()=>{}, canSave: false, hasChanged: false, setAlert: this.setAlert });

    const client = params && params.client ? params.client : null;
    const canDelete = params && params.canDelete ? params.canDelete : false;
    const isWalkIn = client && client.id === 1;
    let editionMode = params && params.editionMode ? params.editionMode : true;
    editionMode = editionMode && !isWalkIn;

    this.state = {
      styles: createStyleSheet(),
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

  handleIndexChange = (index) => {;
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

  setAlert = alert => {
    this.setState({ alert });
  }

  renderLabel = ({ position, navigationState }) => ({ route, index }) => (

    <Text
      style={
        this.state.index === index
          ? [this.state.styles.tabLabelText, this.state.styles.tabLabelActive]
          : this.state.styles.tabLabelText
      }
    >
      {` ${route.title}`}
    </Text>

  );

  renderTabBar = props => (
    <TabBar
      {...props}
      tabStyle={[this.state.styles.tabLabel, { backgroundColor: 'transparent' }]}
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
      onDismiss={()=>{}}
      {...this.props}
    />),
    1: () => <ClientNotes editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
    2: () => <ClientFormulas editionMode={this.state.editionMode} client={this.state.client} navigation={this.props.navigation} {...this.props} />,
  })

  render() {
    const { alert } = this.state;
    return (
      <View style={this.state.styles.container}>
        <TabView
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
          /*useNativeDriver*/
        />
        <SalonAlert
          visible={!!alert}
          title={alert ? alert.title : ''}
          description={alert ? alert.description : ''}
          btnLeftText={alert ? alert.btnLeftText : ''}
          btnRightText={alert ? alert.btnRightText : ''}
          onPressLeft={alert ? alert.onPressLeft : null}
          onPressRight={alert ? alert.onPressRight : null}
        />
      </View>
    );
  }
}
