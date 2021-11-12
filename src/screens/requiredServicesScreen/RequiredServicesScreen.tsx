import * as React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {get, includes} from 'lodash';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SelectableServiceList from '../../components/SelectableServiceList';

import styles from './styles';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

const PHONE_WIDTH = Dimensions.get ('window').width;

export default class RecommendedServicesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    const serviceTitle = params.serviceTitle || '';
    const showCancelButton = params.showCancelButton || false;
    const handleSave = params.handleSave || (() => null);
    const onNavigateBack = params.onNavigateBack || (() => null);
    const handleGoBack = () => {
      onNavigateBack ();
      navigation.goBack ();
    };
    const title = PHONE_WIDTH < 375 ? 'Req. Services' : 'Required Services';
    return {
      tabBarVisible: false,
      header: (
        <SalonHeader
          title={title}
          subTitle={serviceTitle}
          headerLeft={
            <SalonTouchableOpacity
              style={{paddingLeft: 10}}
              onPress={() => handleGoBack ()}
            >
              <Text style={styles.headerButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity onPress={() => handleSave ()}>
              <Text style={[styles.headerButtonText, styles.robotoMedium]}>
                Done
              </Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor (props) {
    super (props);
    const params = props.navigation.state.params || {};
    const selected = params.selectedIds || [];
    props.navigation.setParams ({handleSave: this.handleSave});
    this.state = {
      selected,
    };
  }

  onChangeSelected = selected => this.setState ({selected}, this.handleSave);

  onPressNone = () => this.handleSave (true);

  handleSave = (empty = false) => {
    const {navigation: {goBack, state}, services: allServices} = this.props;
    const {selected} = this.state;
    const params = state.params || {};
    const onSave = get (params, 'onSave', srv => srv);
    if (empty) {
      onSave ([]);
      return goBack ();
    }
    const services = allServices.filter (srv => includes (selected, srv.id));
    onSave (services);
    return goBack ();
  };

  render () {
    const {selected} = this.state;
    const params = this.props.navigation.state.params || {};
    const services = get (params, 'services', []);
    return (
      <SelectableServiceList
        selected={selected}
        services={services}
        noneButton={{name: 'No Required', onPress: this.onPressNone}}
        onChangeSelected={this.onChangeSelected}
        ref={ref => {
          this.serviceList = ref;
        }}
      />
    );
  }
}
