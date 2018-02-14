import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const ClientsSearchHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'Roboto',
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    }}
    >
      Clients
    </Text>),
});

const mapStateToProps = state => ({
  clientsSearchState: state.clientsSearchReducer,
});
export default connect(mapStateToProps)(ClientsSearchHeader);
