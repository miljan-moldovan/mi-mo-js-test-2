// @flow
import React from 'react';
import { View,
  StyleSheet,
  Text,
  FlatList } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputButton,
} from '../../../../components/formHelpers';

const styles = StyleSheet.create({
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
});

class CategoryServicesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryServices: props.categoryServices,
      refresh: false,
    };
  }

  state = {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      refresh: true,
    });
  }
  _keyExtractor = (item, index) => item.id;

  renderItem = elem => (
    <InputGroup style={{
        flexDirection: 'row',
        height: 44,
        borderBottomWidth: 1 / 3,
        borderTopWidth: 0,
      }}
    >
      {[
        <InputButton
          noIcon
          key={Math.random().toString()}
          style={{ flex: 1 }}
          labelStyle={{ color: '#110A24' }}
          onPress={this.props.onChangeService ? () => { this.props.servicesActions.setSelectedService(elem.item); this.props.onChangeService(elem.item); } : () => {}}
          label={elem.item.name}
          children={
            <View style={styles.inputRow}>
              {elem.item === this.props.servicesState.selectedService &&
                <FontAwesome style={styles.checkIcon}>
                  {Icons.checkCircle}
                </FontAwesome>
            }
            </View>
          }
        />]}
    </InputGroup>
  )

  render() {
    return (

      <View style={styles.categoryServicesListContainer}>
        <FlatList
          style={styles.categoryServicesList}
          data={this.state.categoryServices}
          extraData={this.props}
          keyExtractor={this._keyExtractor}
          renderItem={elem => this.renderItem(elem)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  servicesState: state.serviceReducer,
});

export default connect(mapStateToProps)(CategoryServicesList);
