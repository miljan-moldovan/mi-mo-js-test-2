import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import HeaderMiddle from '../../../components/HeaderMiddle';

const ClientsSearchHeader = props => HeaderMiddle({
  title: (
    <Text
      style={{
      fontFamily: 'OpenSans-Regular',
      color: '#fff',
      fontSize: 20,
    }}
    >
      Search Clients
    </Text>),
});

const mapStateToProps = state => ({
  clientsSearchState: state.clientsSearchReducer,
});
export default connect(mapStateToProps)(ClientsSearchHeader);
