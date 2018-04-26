import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import SalonAvatar from '../../../components/SalonAvatar';
import SalonSectionsModal from '../../../components/modals/SalonSectionsModal';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#67A3C7',
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    maxHeight: 120,
  },
  historyMeta: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'rgba(29,29,38,0.35)',
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    color: 'rgba(29,29,38,1)',
  },
  leftContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyPrice: {
    color: '#1D1D26',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  historyTrans: {
    color: '#1D1D26',
    fontSize: 12,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  historyService: {
    color: '#67A3C7',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  historyServiceType: {
    color: '#111415',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  providerWith: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  historyProviderName: {
    color: '#1D1D26',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  providerRound: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  containerLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemSeparator: {
    backgroundColor: '#D3D3D5',
    opacity: 1,
    height: 1,
  },
});

export default class ClientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterModal: false,
    };
  }

  state = {
    showFilterModal: false,
  }

  selectFilter(item) {
    // item
  }


  showModal() {
    this.setState({ showFilterModal: true });
  }

  render() {
    return (
      <View style={styles.container}>


        <SalonSectionsModal
          key="salonSectionsModalClientHistory"
          isVisible={this.state.showFilterModal}
          onPressItem={item => this.selectFilter(item)}
          sections={[{
          data: [{
            id: 1,
          name: 'RETAIL',
          type: 'filter',
          }, {
          id: 2,
          name: 'LOYALTY',
          type: 'filter',
          }, {
          id: 3,
          name: 'REFERRAL',
          type: 'filter',
          }, {
          id: 4,
          name: 'TANNING',
          type: 'filter',
          }, {
          id: 5,
          name: 'ACCOUNT',
          type: 'filter',
          }, {
          id: 6,
          name: 'CANCEL/NO SHOW',
          type: 'filter',
          }, {
          id: 7,
          name: 'PROMOTIONS',
          type: 'filter',
          }, {
          id: 8,
          name: 'MAILINGS',
          type: 'filter',
          }, {
          id: 9,
          name: 'GIFT CARDS',
          type: 'filter',
          }, {
          id: 10,
          name: 'VOIDED',
          type: 'filter',
          }, {
          id: 11,
          name: 'SMS CHAT',
          type: 'filter',
          }, {
          id: 12,
          name: 'EMAILS',
          type: 'filter',
          }],
          title: 'SERVICE',
          },
          ]}
        />


        <View style={styles.header}>
          <Text style={styles.headerTitle}>SERVICE</Text>
          <SalonTouchableOpacity
            style={styles.filterButton}
            onPress={() => this.showModal()}
          >
            <Text style={styles.filterBtnText}>CHANGE</Text>
            <Image style={{ marginLeft: 5, height: 10, width: 10 }} source={require('../../../assets/images/icons/icon_arrow_down_xs.png')} />
          </SalonTouchableOpacity>
        </View>
        <View style={styles.historyContainer}>

          <View style={styles.leftContainer}>
            <View style={styles.containerLine}>
              <Text style={styles.historyMeta}>
              05/24/2017 in Store Store 1
              </Text>
            </View>
            <View style={styles.containerLine}>
              <Text style={styles.historyService}>1X</Text>
              <Text style={styles.historyServiceType}>315 Adult Haircut</Text>
            </View>
            <View style={styles.containerLine}>

              <Text style={styles.providerWith}>
              with
              </Text>
              <SalonAvatar
                wrapperStyle={styles.providerRound}
                width={24}
                borderColor="#67A3C7"
                borderWidth={5}
                image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
              />

              <Text style={styles.historyProviderName}>Joanne Smith </Text>

            </View>
          </View>

          <View style={styles.rightContainer} >
            <Text style={styles.historyPrice}>
                $17.00
            </Text>
            <Text style={styles.historyTrans}>
                Trans. 104277
            </Text>
          </View>
        </View>

        <View style={styles.itemSeparator} />
        <View style={styles.historyContainer}>

          <View style={styles.leftContainer}>
            <View style={styles.containerLine}>
              <Text style={styles.historyMeta}>
              05/24/2017 in Store Store 1
              </Text>
            </View>
            <View style={styles.containerLine}>
              <Text style={styles.historyService}>10X</Text>
              <Text style={styles.historyServiceType}>123 Beard Trim Premier</Text>
            </View>
            <View style={styles.containerLine}>

              <Text style={styles.providerWith}>
              with
              </Text>
              <SalonAvatar
                wrapperStyle={styles.providerRound}
                width={24}
                borderColor="#67A3C7"
                borderWidth={5}
                image="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/1/16/Beautiful-Girl-9.jpg/revision/latest?cb=20160630192742"
              />

              <Text style={styles.historyProviderName}>Joanne Smith </Text>

            </View>
          </View>

          <View style={styles.rightContainer} >
            <Text style={styles.historyPrice}>
                $230.00
            </Text>
            <Text style={styles.historyTrans}>
                Trans. 104277
            </Text>
          </View>
        </View>
        <View style={styles.itemSeparator} />
      </View>
    );
  }
}
