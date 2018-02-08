import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D5',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#111415',
  },
  balancesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    minHeight: 170,
  },
  body: {
    flex: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  lineLeft: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  lineRight: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemSeparatorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  itemSeparator: {
    width: '90%',
    backgroundColor: '#D3D3D5',
    height: 1,
    paddingHorizontal: 50,
  },
  lineTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
    color: '#7C7F81',
  },
  lineValue: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#3D3C3B',
  },
});

export default class ClientBalances extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>

          <View style={styles.balancesContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>ON ACCOUNT</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.line}>
                <View style={styles.lineLeft}>
                  <Text style={styles.lineTitle}>BALANCE</Text>
                  <Text style={styles.lineValue}>$92.00</Text>
                </View>
                <View style={styles.lineRight} />
              </View>
            </View>
          </View>
          <View style={styles.itemSeparatorContainer}>
            <View style={styles.itemSeparator} />
          </View>


          <View style={styles.balancesContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>BAD CHECK</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.line}>
                <View style={styles.lineLeft}>
                  <Text style={styles.lineTitle}>USED BAD CHECK</Text>
                  <Text style={styles.lineValue}>None</Text>
                </View>
                <View style={styles.lineRight} >
                  <Text style={styles.lineTitle}>TOTAL AMOUNT</Text>
                  <Text style={styles.lineValue}>$0.00</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.itemSeparatorContainer}>
            <View style={styles.itemSeparator} />
          </View>


          <View style={styles.balancesContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>LOYALTY</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.line}>
                <View style={styles.lineLeft}>
                  <Text style={styles.lineTitle}>LOYALTY PROGRAM START DATE</Text>
                  <Text style={styles.lineValue}>12/07/2016</Text>
                </View>
                <View style={styles.lineRight} />
              </View>
              <View style={styles.line}>
                <View style={styles.lineLeft}>
                  <Text style={styles.lineTitle}>LOYALTY LEVEL</Text>
                  <Text style={styles.lineValue}>None</Text>
                </View>
                <View style={styles.lineRight} >
                  <Text style={styles.lineTitle}>POINT BALANCE</Text>
                  <Text style={styles.lineValue}>0</Text>
                </View>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}
