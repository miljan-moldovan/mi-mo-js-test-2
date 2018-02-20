import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 22,
  },
  header: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
    height: 65,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

const ClientsSearchHeader = props => (

  <View style={styles.header}>

    <TouchableOpacity
      style={{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    }}
      onPress={() => { props.navigation.goBack(); }}
    >
      <View>
        <Text style={{
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        backgroundColor: 'transparent',
        }}
        >Cancel
        </Text>
      </View>
    </TouchableOpacity>
    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      }}
    >
      <Text
        style={{
        fontFamily: 'Roboto',
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        }}
      >
        Clients
      </Text>
    </View>

    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      }}
    >
      <Text style={{
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Roboto',
      backgroundColor: 'transparent',
      }}
      >Add
      </Text>
    </View>

  </View>

);

const mapStateToProps = state => ({
  clientsSearchState: state.clientsSearchReducer,
});
export default connect(mapStateToProps)(ClientsSearchHeader);
