import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';

import Button from '../../../components/Button';
import SalonAvatar from '../../../components/SalonAvatar';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D5',
    flexDirection: 'column',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    borderBottomColor: '#D3D3D5',
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#1D1D26',

  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    color: 'rgba(29,29,38,1)',
  },
  preferencesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    minHeight: 80,
  },

  buttonContainer: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    minHeight: 100,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerLine: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemSeparator: {
    backgroundColor: '#D3D3D5',
    opacity: 1,
    height: 1,
  },
  providerClass: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    opacity: 0.7,
    color: '#000000',
  },
  providerName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#1D1D26',
    marginRight: 10,
  },
  line: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  lineTitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#1D1D26',
  },
  lineSubTitle: {
    fontFamily: 'OpenSans-Light',
    fontSize: 12,
    color: '#000000',
  },
  lineValue: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#333B3E',
  },
});

export default class ClientPreferences extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>PREFERRED SERVICE PROVIDERS</Text>
          </View>


          <View style={styles.preferencesContainer}>

            <View style={[styles.leftContainer, { flex: 1 }]}>
              <View style={styles.containerLine}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={36}
                  borderColor="#67A3C7"
                  borderWidth={5}
                  image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
                />
              </View>
            </View>
            <View style={[styles.middleContainer, { flex: 5 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.providerClass}>STYLIST</Text>
                <Text style={styles.providerName}>Denise Freye</Text>
              </View>
            </View>
            <View style={[styles.rightContainer, { flex: 1 / 2 }]}>
              <View style={styles.containerLine}>
                <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
              </View>
            </View>
          </View>


          <View style={styles.itemSeparator} />


          <View style={styles.preferencesContainer}>

            <View style={[styles.leftContainer, { flex: 1 }]}>
              <View style={styles.containerLine}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={36}
                  borderColor="#67A3C7"
                  borderWidth={5}
                  image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
                />
              </View>
            </View>
            <View style={[styles.middleContainer, { flex: 5 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.providerClass}>NAIL TECH</Text>
                <Text style={styles.providerName}>Marguerite Bass</Text>
              </View>
            </View>
            <View style={[styles.rightContainer, { flex: 1 / 2 }]}>
              <View style={styles.containerLine}>
                <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
              </View>
            </View>
          </View>

          <View style={styles.itemSeparator} />


          <View style={styles.preferencesContainer}>

            <View style={[styles.leftContainer, { flex: 1 }]}>
              <View style={styles.containerLine}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={36}
                  borderColor="#67A3C7"
                  borderWidth={5}
                  image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
                />
              </View>
            </View>
            <View style={[styles.middleContainer, { flex: 5 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.providerClass}>ESTHETICIAN</Text>
                <Text style={styles.providerName}>Lois Springfield</Text>
              </View>
            </View>
            <View style={[styles.rightContainer, { flex: 1 / 2 }]}>
              <View style={styles.containerLine}>
                <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
              </View>
            </View>
          </View>

          <View style={styles.itemSeparator} />

          <View style={styles.buttonContainer} >
            <Button style={styles.button} type="light" text="+ ADD PREFERRED PROVIDER" onPress={() => {}} />
          </View>

          <View style={styles.itemSeparator} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>REBOOKING PREFERENCES</Text>
          </View>


          <View style={styles.preferencesContainer}>

            <View style={[styles.leftContainer, { flex: 5 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.lineTitle}>342 <Text style={styles.textBold}>Loose Hair Cut Large</Text></Text>
                <Text style={styles.lineSubTitle}>every 4 weeks</Text>
              </View>
            </View>
            <View style={[styles.middleContainer, { flex: 2 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.lineSubTitle}>Mon, Tue, Wed, Thu, Fri, Sat</Text>
              </View>
            </View>
            <View style={[styles.rightContainer, { flex: 1 / 2 }]}>
              <View style={styles.containerLine}>
                <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
              </View>
            </View>
          </View>

          <View style={styles.itemSeparator} />


          <View style={styles.preferencesContainer}>

            <View style={[styles.leftContainer, { flex: 5 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.lineTitle}>122 <Text style={styles.textBold}>Nail Polish Finish</Text></Text>
                <Text style={styles.lineSubTitle}>every 1 week</Text>
              </View>
            </View>
            <View style={[styles.middleContainer, { flex: 2 }]}>
              <View style={styles.containerLine}>
                <Text style={styles.lineSubTitle}>Any Day</Text>
              </View>
            </View>
            <View style={[styles.rightContainer, { flex: 1 / 2 }]}>
              <View style={styles.containerLine}>
                <Image style={{ marginLeft: 5, height: 15, width: 10 }} source={require('../../../assets/images/icons/icon_caret_right.png')} />
              </View>
            </View>
          </View>

          <View style={styles.itemSeparator} />

          <View style={styles.buttonContainer} >
            <Button style={styles.button} type="light" text="+ ADD REBOOKING PREFERENCE" onPress={() => {}} />
          </View>

        </ScrollView>
      </View>
    );
  }
}
