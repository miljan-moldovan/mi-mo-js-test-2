// @flow
import * as React from 'react';
import {View, StyleSheet, RefreshControl, FlatList} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import {
  InputGroup,
  InputButton,
  InputDivider,
} from '../../../../components/formHelpers';
import Colors from '../../../../constants/Colors';

const styles = StyleSheet.create ({
  categoryServicesList: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  categoryServicesListContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  serviceName: {
    color: '#110A24',
    fontSize: 14,
    width: 300,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkIcon: {
    fontSize: 15,
    marginLeft: 10,
    textAlign: 'center',
    color: '#1DBF12',
  },
  dividerComponent: {
    marginLeft: 16,
    height: StyleSheet.hairlineWidth,
    color: Colors.divider,
  },
});

class CategoryServicesList extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      categoryServices: props.categoryServices,
      refreshing: false,
    };
  }

  _keyExtractor = (item, index) => item.id;

  renderItem = elem => {
    const checked =
      this.props.servicesState.selectedService &&
      elem.item.id === this.props.servicesState.selectedService.id;

    const highlightStyle = checked
      ? {color: Colors.selectedGreen}
      : {color: '#110A24'};

    return (
      <InputButton
        icon={false}
        key={Math.random ().toString ()}
        style={{height: 44, paddingLeft: 16}}
        labelStyle={highlightStyle}
        onPress={
          this.props.onChangeService
            ? () => {
                this.props.servicesActions.setSelectedService (elem.item);
                this.props.onChangeService (elem.item);
              }
            : () => {}
        }
        label={elem.item.name}
      >
        <View style={styles.inputRow}>
          {checked &&
            <FontAwesome style={styles.checkIcon}>
              {Icons.checkCircle}
            </FontAwesome>}
        </View>
      </InputButton>
    );
  };

  onRefreshFinish = () => {
    this.setState ({refreshing: false});
  };

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: Colors.divider,
        marginLeft: 16,
        height: StyleSheet.hairlineWidth,
      }}
    />
  );

  render () {
    return (
      <View style={styles.categoryServicesListContainer}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState ({refreshing: true});
                this.props.onRefresh (this.onRefreshFinish);
              }}
            />
          }
          style={styles.categoryServicesList}
          data={this.state.categoryServices}
          extraData={this.props}
          keyExtractor={this._keyExtractor}
          renderItem={elem => this.renderItem (elem)}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect (mapStateToProps) (CategoryServicesList);
