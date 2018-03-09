import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonAvatar from '../components/SalonAvatar';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 39.5,
    alignItems: 'center',
  },
  textMedium: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  textNormal: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  serviceContainer: {
    borderRadius: 4,
    borderColor: 'rgba(195,214,242,0.5)',
    borderWidth: 1,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 10,
    marginBottom: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    height: 80,
  },
  angleIcon: {
    fontSize: 20,
    color: '#115ECD',
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderColor: 'rgba(195,214,242,0.5)',
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  providerRound: {
    width: 26,
    marginRight: 14.5,
  }
});
const queueListItemSummary = props => (
  <View>
    <View style={styles.serviceContainer}>
      <TouchableOpacity onPress={()=>alert("Not implemented")}>
        <View style={[styles.row, styles.rowBorderBottom]}>
          <Text style={styles.textMedium}>{props.service.serviceName}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>alert("Not implemented")}>
        <View style={styles.row}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={26}
            image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
            hasBadge
            badgeComponent={
              <FontAwesome style={{ color: '#1DBF12', fontSize: 10 }}>
                  {Icons.lock}
              </FontAwesome>}
          />
          <Text style={styles.textNormal}>{`${props.service.employeeFirstName} ${props.service.employeeLastName}`}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

export default queueListItemSummary;
