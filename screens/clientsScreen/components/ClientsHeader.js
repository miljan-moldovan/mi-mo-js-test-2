import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const ClientsHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'OpenSans-Regular',
      color: '#fff',
      fontSize: 20,
    }}
    >
    Clients
    </Text>),
  subTitle: (
    <Text
      style={{
      fontFamily: 'OpenSans-Regular',
      color: '#fff',
      fontSize: 12,
    }}
    >
      { ` ${props.clientsState.subtitle}` }
    </Text>
  ),
});

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
});
export default connect(mapStateToProps)(ClientsHeader);
