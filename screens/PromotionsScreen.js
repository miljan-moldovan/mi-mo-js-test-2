// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import SearchBar from '../components/searchBar';
import SalonModal from '../components/SalonModal';
import SalonTouchableHighlight from '../../../../components/SalonTouchableHighlight';

export default class PromotionsScreen extends React.Component {

  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);

    this.state = {
      activeData: null,
      storedData: null,
      modalVisible: true,
    };
  }

  componentWillMount() {
    this.setState({ activeData: this.mapData(promotions) });
  }

  mapData(data, parent = false) {
    return data.map((item) => {
      const mapped = {
        data: item,
        key: item.id,
        // renderItem: this._renderItem,
      };

      for (key in item) {
        if (typeof item[key] === 'object') {
          mapped.data.children = this.mapData(item[key]);
        }
      }

      return mapped;
    });
  }

  hasMappedChildren(data) {
    for (key in data) {
      if (typeof data[key] === 'object') {
        if (typeof data[key].data !== undefined && typeof data[key].key !== undefined) { return true; }
      }
    }

    return false;
  }

  _filterServices(searchText) {
    if (searchText.length === 0) {
      this.setState({ activeData: this.state.storedData, storedData: null, searchText });
    } else {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'promoCode', Values: [searchText.toLowerCase()] },
      ];

      const toStore = this.state.storedData === null ? this.state.activeData : this.state.storedData;

      const filtered = this.flexFilter(toStore, criteria);

      this.setState({ storedData: toStore, searchText, activeData: filtered });
    }
  }

  flexFilter(list, info) {
    let matchesFilter,
      matches = [];

    matchesFilter = function (item) {
      let count = 0;
      for (let n = 0; n < info.length; n++) {
        if (item.data[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count++;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i++) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }
  _handleOnChangePromotion = (promotion) => {
    const { onPromotionChange, dismissOnSelect } = this.props.navigation.state.params;
    if (onPromotionChange) { onPromotionChange(promotion); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  _renderItem = ({ item, index }) => {
    const { data, key } = item;

    return (
      <SalonTouchableHighlight
        style={data.id === this.state.activeListItem ? styles.listItemActive : styles.listItemInactive}
        onPress={(e) => {
          if (this.hasMappedChildren(data)) {
            this.setState({
              prevData: this.state.activeData,
              activeData: data.children,
              parentList: data,
              currentStep: this.state.currentStep + 1,
            });
          }
          this.setState(
{
            activeListItem: data.id,
            },
            () => this._handleOnChangePromotion(data),
);
        }}
        underlayColor="#ffffff"
        activeOpacity={2}
      >
        <View>
          <View style={{
 flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
}}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              { data.promoCode !== undefined && <Text style={styles.superTitle}>{data.promoCode}</Text>}
              <Text style={data.id === this.state.activeListItem ? [styles.listText, { fontFamily: 'OpenSans-Bold' }] : styles.listText}>{data.name}</Text>
            </View>
            <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.discountText}>{data.discount}%</Text>
            </View>
          </View>
        </View>
      </SalonTouchableHighlight>
    );
  }

  renderList() {
    return (
      <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}>
        <View style={styles.sectionNavigate}>
          <Text style={[styles.listText, { fontFamily: 'OpenSans-Bold' }]}>No Promotion</Text>
        </View>
        <FlatList
          style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }}
          data={this.state.activeData}
          renderItem={this._renderItem}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')}
        />
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select Promotion</Text>
            <Text style={styles.subTitle}>Walkin Service - 4 of 4</Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <SearchBar showCancel={false} placeholder="Search by name or promo code" searchIconPosition="right" style={styles.seachBar} onChangeText={(searchText) => { this._filterServices(searchText); }} />
          </View>
        </View>
        <View style={styles.searchContainer} />
        <View style={styles.listContainer}>
          {this.renderList()}
        </View>
        <SalonModal
          isVisible={this.state.modalVisible}
          closeButton={false}
          closeModal={() => { this.setState({ modalVisible: false }); }}
        >
          <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <Image style={{ height: 99, width: 99, margin: 25 }} source={require('../assets/images/clubCardModal/icon_clubcard.png')} />

          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
color: '#0A274A', fontSize: 22, fontFamily: 'OpenSans-Bold', marginBottom: 8,
}}
            >Scan Club Card
            </Text>
            <Text style={{ color: '#0A274A', fontSize: 15 }}>Please enter the card number</Text>
          </View>
          <View style={{ paddingHorizontal: 30, marginVertical: 20, alignSelf: 'stretch' }}>
            <TextInput
              style={{
height: 50, paddingHorizontal: 13, marginVertical: 15, paddingVertical: 11, borderColor: 'rgba(10,39,74,0.2)', borderWidth: 1,
}}
              onChangeText={text => this.setState({ text })}
              value="Whatever"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 0 }}>
            <SalonTouchableHighlight
              style={{
                width: 140,
                height: 60,
                backgroundColor: 'white',
                borderColor: '#67A3C7',
                borderWidth: 1,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View><Text style={{ color: '#67A3C7', fontSize: 18 }}>Cancel</Text></View>
            </SalonTouchableHighlight>
            <SalonTouchableHighlight
              style={{
                width: 140,
                height: 60,
                backgroundColor: '#67A3C7',
                borderColor: '#67A3C7',
                borderWidth: 1,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View><Text style={{ color: 'white', fontSize: 18 }}>Ok</Text></View>
            </SalonTouchableHighlight>
          </View>
        </SalonModal>
      </View>
    );
  }
}
// export default connect(null, )(ServicesScreen);

const modalStyles = StyleSheet.create({

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold',
    // padding: 20,
    marginTop: 20,
    marginBottom: 4,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 12,
  },
  superTitle: {
    fontSize: 14,
    color: 'rgba(29,29,38,.35)',
  },
  discountText: {
    fontSize: 18,
    color: 'rgba(29,29,38,.35)',
  },
  seachBar: {
    flexDirection: 'row',
    flex: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  loginButton: {
    width: 250,
    height: 65,
    marginTop: 17,
    marginBottom: 18,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItemInactive: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,.2)',
  },
  listItemActive: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(29,29,38,.03)',
    borderLeftWidth: 6,
    borderLeftColor: '#00B782',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29,29,38,.2)',
  },
  listText: {
    fontSize: 18,
    color: '#242424',
  },
  durationText: {
    fontSize: 12,
    color: '#3D3C3B',
    opacity: 0.5,
  },
  caretIcon: {
    height: 12,
    width: 6,
    alignSelf: 'flex-end',
  },
  sectionNavigate: {
    alignSelf: 'stretch',
    padding: 20,
    borderBottomWidth: 3,
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(5,5,5,.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

const promotions = [{
  id: 1, name: 'Programmable composite architecture', promoCode: '525999883-9', discount: 61,
},
{
  id: 2, name: 'Grass-roots composite throughput', promoCode: '516747380-2', discount: 14,
},
{
  id: 3, name: 'Intuitive value-added encryption', promoCode: '360478983-4', discount: 98,
},
{
  id: 4, name: 'Business-focused user-facing projection', promoCode: '717072798-6', discount: 12,
},
{
  id: 5, name: 'Profit-focused demand-driven process improvement', promoCode: '005662117-5', discount: 32,
},
{
  id: 6, name: 'Multi-layered coherent conglomeration', promoCode: '579398010-5', discount: 61,
},
{
  id: 7, name: 'Intuitive even-keeled website', promoCode: '907053073-2', discount: 39,
},
{
  id: 8, name: 'Enhanced national groupware', promoCode: '668363852-7', discount: 47,
},
{
  id: 9, name: 'Profound eco-centric support', promoCode: '092773405-2', discount: 84,
},
{
  id: 10, name: 'Synergistic mission-critical website', promoCode: '324225508-9', discount: 6,
},
{
  id: 11, name: 'Stand-alone grid-enabled firmware', promoCode: '858747117-1', discount: 22,
},
{
  id: 12, name: 'Proactive bandwidth-monitored circuit', promoCode: '827315387-8', discount: 14,
},
{
  id: 13, name: 'De-engineered executive capacity', promoCode: '963725417-X', discount: 76,
},
{
  id: 14, name: 'Stand-alone cohesive intranet', promoCode: '101159275-4', discount: 19,
},
{
  id: 15, name: 'Progressive secondary neural-net', promoCode: '515524707-1', discount: 63,
},
{
  id: 16, name: 'Balanced systemic functionalities', promoCode: '536737942-7', discount: 62,
},
{
  id: 17, name: 'Open-source demand-driven strategy', promoCode: '398658553-2', discount: 25,
},
{
  id: 18, name: 'Integrated transitional leverage', promoCode: '701727382-6', discount: 95,
},
{
  id: 19, name: 'Inverse responsive superstructure', promoCode: '466502057-4', discount: 27,
},
{
  id: 20, name: 'Compatible system-worthy capability', promoCode: '779479498-6', discount: 74,
},
{
  id: 21, name: 'Re-engineered holistic encryption', promoCode: '056154585-5', discount: 19,
},
{
  id: 22, name: 'Multi-layered encompassing capacity', promoCode: '416568432-5', discount: 53,
},
{
  id: 23, name: 'Self-enabling systemic model', promoCode: '798286732-4', discount: 15,
},
{
  id: 24, name: 'Universal 24/7 process improvement', promoCode: '473672488-9', discount: 28,
},
{
  id: 25, name: 'Synergized maximized strategy', promoCode: '562236107-9', discount: 80,
},
{
  id: 26, name: 'Organized empowering initiative', promoCode: '869103951-5', discount: 22,
},
{
  id: 27, name: 'Networked local superstructure', promoCode: '263036732-0', discount: 93,
},
{
  id: 28, name: 'Integrated intangible superstructure', promoCode: '399812949-9', discount: 57,
},
{
  id: 29, name: 'Visionary 5th generation algorithm', promoCode: '642067971-0', discount: 59,
},
{
  id: 30, name: 'Function-based dynamic circuit', promoCode: '171407368-8', discount: 56,
},
{
  id: 31, name: 'Pre-emptive optimal concept', promoCode: '000197042-9', discount: 2,
},
{
  id: 32, name: 'Switchable 24 hour synergy', promoCode: '682881640-4', discount: 55,
},
{
  id: 33, name: 'Automated national model', promoCode: '293338605-4', discount: 93,
},
{
  id: 34, name: 'Synergistic cohesive parallelism', promoCode: '529462652-7', discount: 100,
},
{
  id: 35, name: 'Devolved systemic installation', promoCode: '599155148-0', discount: 57,
},
{
  id: 36, name: 'Ameliorated bifurcated help-desk', promoCode: '458009127-2', discount: 46,
},
{
  id: 37, name: 'Progressive high-level function', promoCode: '011864416-5', discount: 66,
},
{
  id: 38, name: 'Cross-group coherent flexibility', promoCode: '904998334-0', discount: 53,
},
{
  id: 39, name: 'Expanded asymmetric algorithm', promoCode: '263074248-2', discount: 48,
},
{
  id: 40, name: 'User-centric well-modulated pricing structure', promoCode: '461213607-1', discount: 93,
},
{
  id: 41, name: 'Quality-focused eco-centric website', promoCode: '157260785-8', discount: 88,
},
{
  id: 42, name: 'Face to face motivating project', promoCode: '571401911-3', discount: 76,
},
{
  id: 43, name: 'Face to face encompassing utilisation', promoCode: '070198856-8', discount: 47,
},
{
  id: 44, name: 'Virtual human-resource implementation', promoCode: '136055554-4', discount: 8,
},
{
  id: 45, name: 'Progressive well-modulated intranet', promoCode: '899235953-5', discount: 11,
},
{
  id: 46, name: 'Organized clear-thinking paradigm', promoCode: '529155103-8', discount: 66,
},
{
  id: 47, name: 'Reactive grid-enabled Graphical User Interface', promoCode: '545424444-9', discount: 41,
},
{
  id: 48, name: 'Integrated content-based toolset', promoCode: '904757075-8', discount: 91,
},
{
  id: 49, name: 'Phased asymmetric open system', promoCode: '444507134-X', discount: 62,
},
{
  id: 50, name: 'Synergized mobile leverage', promoCode: '264095674-4', discount: 99,
},
{
  id: 51, name: 'Organic responsive archive', promoCode: '895449278-9', discount: 19,
},
{
  id: 52, name: 'Expanded static archive', promoCode: '359019924-5', discount: 48,
},
{
  id: 53, name: 'Devolved upward-trending functionalities', promoCode: '151076046-6', discount: 98,
},
{
  id: 54, name: 'Customizable solution-oriented website', promoCode: '773337299-2', discount: 59,
},
{
  id: 55, name: 'Innovative bottom-line Graphical User Interface', promoCode: '562830290-2', discount: 5,
},
{
  id: 56, name: 'Adaptive real-time moderator', promoCode: '259912180-9', discount: 1,
},
{
  id: 57, name: 'Front-line motivating methodology', promoCode: '908736417-2', discount: 11,
},
{
  id: 58, name: 'Horizontal secondary attitude', promoCode: '524285538-X', discount: 32,
},
{
  id: 59, name: 'Synergistic system-worthy core', promoCode: '152245097-1', discount: 30,
},
{
  id: 60, name: 'Fully-configurable multi-tasking instruction set', promoCode: '477901771-8', discount: 35,
},
{
  id: 61, name: 'Down-sized bifurcated projection', promoCode: '191588169-2', discount: 75,
},
{
  id: 62, name: 'Digitized scalable system engine', promoCode: '869812841-6', discount: 71,
},
{
  id: 63, name: 'Diverse foreground interface', promoCode: '179271392-4', discount: 79,
},
{
  id: 64, name: 'Profound 5th generation service-desk', promoCode: '989120416-2', discount: 83,
},
{
  id: 65, name: 'Seamless radical leverage', promoCode: '740721973-7', discount: 29,
},
{
  id: 66, name: 'Fundamental modular orchestration', promoCode: '014813327-4', discount: 10,
},
{
  id: 67, name: 'Ameliorated bi-directional process improvement', promoCode: '504427680-4', discount: 64,
},
{
  id: 68, name: 'Focused didactic projection', promoCode: '738087809-3', discount: 97,
},
{
  id: 69, name: 'Decentralized zero defect collaboration', promoCode: '860756218-5', discount: 52,
},
{
  id: 70, name: 'Realigned tangible secured line', promoCode: '630682910-5', discount: 44,
},
{
  id: 71, name: 'Polarised scalable internet solution', promoCode: '066014758-0', discount: 32,
},
{
  id: 72, name: 'Persevering bifurcated data-warehouse', promoCode: '181078527-8', discount: 99,
},
{
  id: 73, name: 'Configurable leading edge approach', promoCode: '318106141-7', discount: 59,
},
{
  id: 74, name: 'Decentralized didactic conglomeration', promoCode: '588473355-0', discount: 45,
},
{
  id: 75, name: 'Reverse-engineered contextually-based protocol', promoCode: '805144791-3', discount: 48,
},
{
  id: 76, name: 'Reduced encompassing application', promoCode: '984129047-2', discount: 47,
},
{
  id: 77, name: 'Ergonomic discrete adapter', promoCode: '449479673-5', discount: 28,
},
{
  id: 78, name: 'Adaptive grid-enabled challenge', promoCode: '664147113-6', discount: 44,
},
{
  id: 79, name: 'Open-architected 24 hour circuit', promoCode: '120146945-7', discount: 44,
},
{
  id: 80, name: 'Ergonomic bifurcated methodology', promoCode: '666530239-3', discount: 15,
},
{
  id: 81, name: 'Synergistic fault-tolerant hierarchy', promoCode: '179594791-8', discount: 92,
},
{
  id: 82, name: 'Synergized even-keeled moderator', promoCode: '995159372-0', discount: 71,
},
{
  id: 83, name: 'Synchronised global paradigm', promoCode: '917321985-1', discount: 25,
},
{
  id: 84, name: 'Streamlined zero defect initiative', promoCode: '254593073-3', discount: 8,
},
{
  id: 85, name: 'Visionary modular paradigm', promoCode: '615339362-4', discount: 65,
},
{
  id: 86, name: 'Exclusive methodical matrix', promoCode: '288312866-9', discount: 80,
},
{
  id: 87, name: 'Balanced bifurcated database', promoCode: '179050652-2', discount: 71,
},
{
  id: 88, name: 'Diverse user-facing software', promoCode: '034618063-5', discount: 54,
},
{
  id: 89, name: 'Cross-group real-time approach', promoCode: '593268946-3', discount: 28,
},
{
  id: 90, name: 'Balanced reciprocal analyzer', promoCode: '429305583-5', discount: 22,
},
{
  id: 91, name: 'Balanced leading edge time-frame', promoCode: '202856993-X', discount: 64,
},
{
  id: 92, name: 'Fundamental cohesive algorithm', promoCode: '275229433-6', discount: 21,
},
{
  id: 93, name: 'Function-based encompassing migration', promoCode: '415054143-4', discount: 83,
},
{
  id: 94, name: 'Mandatory bottom-line synergy', promoCode: '834923032-0', discount: 70,
},
{
  id: 95, name: 'Phased systemic core', promoCode: '937606815-7', discount: 12,
},
{
  id: 96, name: 'Right-sized incremental hub', promoCode: '953213701-7', discount: 1,
},
{
  id: 97, name: 'Sharable human-resource archive', promoCode: '439111984-6', discount: 1,
},
{
  id: 98, name: 'Compatible logistical interface', promoCode: '729734654-3', discount: 85,
},
{
  id: 99, name: 'Synchronised national parallelism', promoCode: '264845998-7', discount: 38,
},
{
  id: 100, name: 'Expanded asynchronous success', promoCode: '048837128-7', discount: 9,
},
{
  id: 101, name: 'Integrated heuristic definition', promoCode: '304724427-8', discount: 97,
},
{
  id: 102, name: 'Object-based scalable complexity', promoCode: '459903844-X', discount: 34,
},
{
  id: 103, name: 'Assimilated homogeneous help-desk', promoCode: '093721954-1', discount: 9,
},
{
  id: 104, name: 'Multi-layered encompassing moratorium', promoCode: '687515818-3', discount: 10,
},
{
  id: 105, name: 'Switchable value-added conglomeration', promoCode: '750485995-8', discount: 15,
},
{
  id: 106, name: 'Managed uniform internet solution', promoCode: '389077086-X', discount: 21,
},
{
  id: 107, name: 'Operative object-oriented access', promoCode: '636941590-1', discount: 13,
},
{
  id: 108, name: 'Advanced asynchronous interface', promoCode: '979076629-7', discount: 42,
},
{
  id: 109, name: 'Team-oriented 24/7 complexity', promoCode: '216985267-0', discount: 78,
},
{
  id: 110, name: 'Integrated multi-tasking task-force', promoCode: '216128511-4', discount: 67,
},
{
  id: 111, name: 'Total mobile infrastructure', promoCode: '548344529-5', discount: 95,
},
{
  id: 112, name: 'Future-proofed uniform alliance', promoCode: '484768773-6', discount: 32,
},
{
  id: 113, name: 'Re-engineered transitional encoding', promoCode: '217208061-6', discount: 76,
},
{
  id: 114, name: 'Proactive optimizing customer loyalty', promoCode: '628675426-1', discount: 72,
},
{
  id: 115, name: 'Polarised dynamic capability', promoCode: '657621473-1', discount: 31,
},
{
  id: 116, name: 'Reverse-engineered impactful customer loyalty', promoCode: '662881719-9', discount: 43,
},
{
  id: 117, name: 'Centralized discrete analyzer', promoCode: '216753986-X', discount: 79,
},
{
  id: 118, name: 'Robust interactive project', promoCode: '457349674-2', discount: 12,
},
{
  id: 119, name: 'Polarised bottom-line pricing structure', promoCode: '070518433-1', discount: 56,
},
{
  id: 120, name: 'Persistent encompassing installation', promoCode: '222972072-4', discount: 53,
},
{
  id: 121, name: 'Realigned actuating analyzer', promoCode: '748834722-6', discount: 96,
},
{
  id: 122, name: 'Cloned background instruction set', promoCode: '239235268-2', discount: 25,
},
{
  id: 123, name: 'Open-source coherent function', promoCode: '492762135-9', discount: 8,
},
{
  id: 124, name: 'Reduced radical infrastructure', promoCode: '031307822-X', discount: 61,
},
{
  id: 125, name: 'Right-sized contextually-based internet solution', promoCode: '331382165-0', discount: 64,
},
{
  id: 126, name: 'Face to face background archive', promoCode: '595497903-0', discount: 41,
},
{
  id: 127, name: 'Enterprise-wide heuristic productivity', promoCode: '549592165-8', discount: 55,
},
{
  id: 128, name: 'Front-line empowering strategy', promoCode: '686764063-X', discount: 74,
},
{
  id: 129, name: 'Business-focused high-level utilisation', promoCode: '140106036-6', discount: 22,
},
{
  id: 130, name: 'Networked empowering methodology', promoCode: '737634624-4', discount: 91,
},
{
  id: 131, name: 'Diverse homogeneous model', promoCode: '005809234-X', discount: 16,
},
{
  id: 132, name: 'Multi-layered secondary application', promoCode: '132472320-3', discount: 91,
},
{
  id: 133, name: 'Business-focused logistical website', promoCode: '832141042-1', discount: 29,
},
{
  id: 134, name: 'Cross-group scalable pricing structure', promoCode: '042794792-8', discount: 9,
},
{
  id: 135, name: 'Organic full-range algorithm', promoCode: '122702898-9', discount: 82,
},
{
  id: 136, name: 'Business-focused interactive strategy', promoCode: '544152730-7', discount: 3,
},
{
  id: 137, name: 'Robust intermediate challenge', promoCode: '823099416-1', discount: 66,
},
{
  id: 138, name: 'Optional asymmetric challenge', promoCode: '870902315-1', discount: 17,
},
{
  id: 139, name: 'Open-architected fresh-thinking core', promoCode: '025608651-6', discount: 33,
},
{
  id: 140, name: 'Monitored mobile frame', promoCode: '266388189-9', discount: 5,
},
{
  id: 141, name: 'Innovative analyzing Graphical User Interface', promoCode: '968732500-3', discount: 26,
},
{
  id: 142, name: 'Reduced upward-trending conglomeration', promoCode: '465147267-2', discount: 73,
},
{
  id: 143, name: 'Object-based system-worthy system engine', promoCode: '670048114-7', discount: 32,
},
{
  id: 144, name: 'Adaptive grid-enabled knowledge base', promoCode: '292890611-8', discount: 27,
},
{
  id: 145, name: 'Open-architected web-enabled archive', promoCode: '394338599-X', discount: 98,
},
{
  id: 146, name: 'Versatile next generation middleware', promoCode: '747552757-3', discount: 67,
},
{
  id: 147, name: 'Profit-focused heuristic interface', promoCode: '134740496-1', discount: 17,
},
{
  id: 148, name: 'Managed holistic software', promoCode: '828451250-5', discount: 68,
},
{
  id: 149, name: 'Customizable bottom-line complexity', promoCode: '776208228-X', discount: 56,
},
{
  id: 150, name: 'Streamlined hybrid framework', promoCode: '357285904-2', discount: 39,
},
{
  id: 151, name: 'Digitized systemic productivity', promoCode: '677324823-X', discount: 29,
},
{
  id: 152, name: 'Distributed regional service-desk', promoCode: '570587359-X', discount: 57,
},
{
  id: 153, name: 'Implemented context-sensitive array', promoCode: '647986637-1', discount: 32,
},
{
  id: 154, name: 'Devolved asynchronous framework', promoCode: '649257325-0', discount: 55,
},
{
  id: 155, name: 'Profit-focused object-oriented artificial intelligence', promoCode: '723479376-3', discount: 57,
},
{
  id: 156, name: 'Intuitive discrete attitude', promoCode: '704025553-7', discount: 63,
},
{
  id: 157, name: 'Open-source disintermediate firmware', promoCode: '098018801-6', discount: 35,
},
{
  id: 158, name: 'Open-source reciprocal superstructure', promoCode: '356706982-9', discount: 96,
},
{
  id: 159, name: 'Advanced zero defect initiative', promoCode: '464133749-7', discount: 82,
},
{
  id: 160, name: 'Seamless mobile model', promoCode: '462769292-7', discount: 57,
},
{
  id: 161, name: 'Self-enabling context-sensitive intranet', promoCode: '459300266-4', discount: 61,
},
{
  id: 162, name: 'Right-sized solution-oriented parallelism', promoCode: '453829871-9', discount: 6,
},
{
  id: 163, name: 'Mandatory solution-oriented adapter', promoCode: '594385162-3', discount: 54,
},
{
  id: 164, name: 'Synergized motivating groupware', promoCode: '621664830-6', discount: 12,
},
{
  id: 165, name: 'Decentralized modular moderator', promoCode: '753010508-6', discount: 85,
},
{
  id: 166, name: 'Switchable demand-driven leverage', promoCode: '274044599-7', discount: 27,
},
{
  id: 167, name: 'User-centric leading edge capability', promoCode: '040569691-4', discount: 14,
},
{
  id: 168, name: 'Multi-layered next generation artificial intelligence', promoCode: '447856327-6', discount: 55,
},
{
  id: 169, name: 'Re-contextualized value-added hub', promoCode: '687853749-5', discount: 15,
},
{
  id: 170, name: 'Stand-alone zero defect infrastructure', promoCode: '746209355-3', discount: 73,
},
{
  id: 171, name: 'Quality-focused even-keeled throughput', promoCode: '677471956-2', discount: 67,
},
{
  id: 172, name: 'Organized asymmetric product', promoCode: '860716746-4', discount: 86,
},
{
  id: 173, name: 'Re-contextualized bottom-line knowledge user', promoCode: '449916781-7', discount: 40,
},
{
  id: 174, name: 'Balanced contextually-based contingency', promoCode: '178590385-3', discount: 34,
},
{
  id: 175, name: 'Managed dedicated access', promoCode: '864768952-6', discount: 56,
},
{
  id: 176, name: 'Stand-alone human-resource function', promoCode: '487552435-8', discount: 71,
},
{
  id: 177, name: 'Stand-alone executive Graphical User Interface', promoCode: '661589951-5', discount: 87,
},
{
  id: 178, name: 'Polarised regional monitoring', promoCode: '637603053-X', discount: 9,
},
{
  id: 179, name: 'Expanded impactful internet solution', promoCode: '247186997-1', discount: 18,
},
{
  id: 180, name: 'Organized well-modulated frame', promoCode: '326240861-1', discount: 57,
},
{
  id: 181, name: 'Realigned high-level archive', promoCode: '559999787-1', discount: 37,
},
{
  id: 182, name: 'Vision-oriented transitional leverage', promoCode: '039907312-4', discount: 70,
},
{
  id: 183, name: 'Progressive leading edge matrix', promoCode: '298661157-5', discount: 36,
},
{
  id: 184, name: 'Ameliorated impactful archive', promoCode: '914082018-1', discount: 55,
},
{
  id: 185, name: 'Enterprise-wide mobile interface', promoCode: '397749248-9', discount: 2,
},
{
  id: 186, name: 'Switchable even-keeled task-force', promoCode: '653455424-0', discount: 82,
},
{
  id: 187, name: 'Integrated 24 hour budgetary management', promoCode: '638935955-1', discount: 10,
},
{
  id: 188, name: 'Customizable local paradigm', promoCode: '359405310-5', discount: 73,
},
{
  id: 189, name: 'Horizontal content-based utilisation', promoCode: '254428911-2', discount: 96,
},
{
  id: 190, name: 'Robust optimizing structure', promoCode: '138014136-2', discount: 82,
},
{
  id: 191, name: 'Enterprise-wide disintermediate interface', promoCode: '822838758-X', discount: 61,
},
{
  id: 192, name: 'Fundamental dedicated alliance', promoCode: '198285814-1', discount: 56,
},
{
  id: 193, name: 'Horizontal 6th generation conglomeration', promoCode: '470323009-7', discount: 93,
},
{
  id: 194, name: 'Optional neutral moratorium', promoCode: '942147877-0', discount: 97,
},
{
  id: 195, name: 'Adaptive homogeneous capability', promoCode: '648889826-4', discount: 79,
},
{
  id: 196, name: 'Distributed human-resource open system', promoCode: '103231322-6', discount: 33,
},
{
  id: 197, name: 'Devolved methodical concept', promoCode: '353423963-6', discount: 76,
},
{
  id: 198, name: 'Future-proofed transitional adapter', promoCode: '512169954-9', discount: 56,
},
{
  id: 199, name: 'Front-line mobile leverage', promoCode: '674672478-6', discount: 85,
},
{
  id: 200, name: 'Fully-configurable radical projection', promoCode: '781493013-8', discount: 90,
},
{
  id: 201, name: 'Universal mobile firmware', promoCode: '721012182-X', discount: 48,
},
{
  id: 202, name: 'Multi-layered dynamic service-desk', promoCode: '719681448-7', discount: 58,
},
{
  id: 203, name: 'Centralized systemic flexibility', promoCode: '531349046-X', discount: 19,
},
{
  id: 204, name: 'Switchable client-driven structure', promoCode: '295564388-2', discount: 65,
},
{
  id: 205, name: 'Synergized uniform ability', promoCode: '234654274-1', discount: 63,
},
{
  id: 206, name: 'Customer-focused intermediate success', promoCode: '735064117-6', discount: 3,
},
{
  id: 207, name: 'Stand-alone cohesive solution', promoCode: '144268399-6', discount: 89,
},
{
  id: 208, name: 'Front-line background infrastructure', promoCode: '059861482-6', discount: 14,
},
{
  id: 209, name: 'Digitized global firmware', promoCode: '541724248-9', discount: 8,
},
{
  id: 210, name: 'Re-contextualized 24/7 application', promoCode: '731676099-0', discount: 55,
},
{
  id: 211, name: 'Optimized radical portal', promoCode: '006622910-3', discount: 2,
},
{
  id: 212, name: 'Re-engineered zero defect benchmark', promoCode: '231347083-0', discount: 6,
},
{
  id: 213, name: 'Assimilated intermediate alliance', promoCode: '966181485-6', discount: 68,
},
{
  id: 214, name: 'Inverse intangible functionalities', promoCode: '703552596-3', discount: 88,
},
{
  id: 215, name: 'Sharable fault-tolerant workforce', promoCode: '793518017-2', discount: 83,
},
{
  id: 216, name: 'Synergistic user-facing solution', promoCode: '242029596-X', discount: 48,
},
{
  id: 217, name: 'Synchronised exuding pricing structure', promoCode: '845300156-1', discount: 83,
},
{
  id: 218, name: 'Optimized motivating infrastructure', promoCode: '693708396-3', discount: 95,
},
{
  id: 219, name: 'Vision-oriented optimal attitude', promoCode: '980958669-8', discount: 65,
},
{
  id: 220, name: 'Expanded actuating definition', promoCode: '037038558-6', discount: 47,
},
{
  id: 221, name: 'Cloned optimal encryption', promoCode: '819282196-X', discount: 97,
},
{
  id: 222, name: 'Configurable context-sensitive matrices', promoCode: '164730208-0', discount: 60,
},
{
  id: 223, name: 'Devolved value-added hierarchy', promoCode: '315525125-5', discount: 26,
},
{
  id: 224, name: 'Business-focused local productivity', promoCode: '670562211-3', discount: 12,
},
{
  id: 225, name: 'Assimilated client-server concept', promoCode: '247905828-X', discount: 79,
},
{
  id: 226, name: 'Cross-group bifurcated implementation', promoCode: '824849248-6', discount: 62,
},
{
  id: 227, name: 'Organic homogeneous hierarchy', promoCode: '990893808-8', discount: 91,
},
{
  id: 228, name: 'Switchable directional capacity', promoCode: '903603648-8', discount: 41,
},
{
  id: 229, name: 'Sharable non-volatile moratorium', promoCode: '868913259-7', discount: 57,
},
{
  id: 230, name: 'Devolved dynamic workforce', promoCode: '733267610-9', discount: 71,
},
{
  id: 231, name: 'Operative tangible projection', promoCode: '634778200-6', discount: 92,
},
{
  id: 232, name: 'Fundamental intangible secured line', promoCode: '885782739-9', discount: 70,
},
{
  id: 233, name: 'Centralized systematic portal', promoCode: '308427043-0', discount: 16,
},
{
  id: 234, name: 'Secured maximized array', promoCode: '922303883-9', discount: 82,
},
{
  id: 235, name: 'Focused responsive parallelism', promoCode: '636216707-4', discount: 12,
},
{
  id: 236, name: 'Advanced demand-driven ability', promoCode: '451441053-5', discount: 98,
},
{
  id: 237, name: 'Horizontal analyzing intranet', promoCode: '893625245-3', discount: 49,
},
{
  id: 238, name: 'Managed discrete capacity', promoCode: '255075085-3', discount: 20,
},
{
  id: 239, name: 'Cross-platform bandwidth-monitored support', promoCode: '137362903-7', discount: 2,
},
{
  id: 240, name: 'Centralized multimedia contingency', promoCode: '865829277-0', discount: 50,
},
{
  id: 241, name: 'Mandatory human-resource artificial intelligence', promoCode: '802577959-9', discount: 60,
},
{
  id: 242, name: 'Adaptive web-enabled pricing structure', promoCode: '436881798-2', discount: 8,
},
{
  id: 243, name: 'Configurable motivating standardization', promoCode: '539893188-1', discount: 15,
},
{
  id: 244, name: 'Extended national solution', promoCode: '693910735-5', discount: 85,
},
{
  id: 245, name: 'Cross-platform scalable infrastructure', promoCode: '381872985-9', discount: 28,
},
{
  id: 246, name: 'Inverse even-keeled complexity', promoCode: '278688124-2', discount: 87,
},
{
  id: 247, name: 'Multi-lateral didactic matrices', promoCode: '946997901-X', discount: 57,
},
{
  id: 248, name: 'Front-line reciprocal paradigm', promoCode: '875398611-3', discount: 25,
},
{
  id: 249, name: 'Re-contextualized solution-oriented orchestration', promoCode: '589162902-X', discount: 29,
},
{
  id: 250, name: 'Compatible next generation implementation', promoCode: '659640665-2', discount: 8,
},
{
  id: 251, name: 'User-friendly client-server system engine', promoCode: '225288251-4', discount: 80,
},
{
  id: 252, name: 'Organic exuding local area network', promoCode: '562098218-1', discount: 9,
},
{
  id: 253, name: 'Up-sized motivating system engine', promoCode: '292793731-1', discount: 12,
},
{
  id: 254, name: 'Universal 24 hour local area network', promoCode: '967256832-0', discount: 88,
},
{
  id: 255, name: 'Public-key systematic matrix', promoCode: '945170017-X', discount: 50,
},
{
  id: 256, name: 'Automated actuating workforce', promoCode: '088889671-9', discount: 8,
},
{
  id: 257, name: 'Intuitive motivating emulation', promoCode: '146795426-8', discount: 2,
},
{
  id: 258, name: 'Seamless logistical firmware', promoCode: '590106882-3', discount: 98,
},
{
  id: 259, name: 'Virtual systemic analyzer', promoCode: '814049426-7', discount: 44,
},
{
  id: 260, name: 'Vision-oriented fresh-thinking paradigm', promoCode: '014388308-9', discount: 88,
},
{
  id: 261, name: 'Innovative national approach', promoCode: '961407279-2', discount: 2,
},
{
  id: 262, name: 'Cross-platform holistic framework', promoCode: '657976693-X', discount: 8,
},
{
  id: 263, name: 'Adaptive hybrid functionalities', promoCode: '404566789-X', discount: 61,
},
{
  id: 264, name: 'Fully-configurable leading edge archive', promoCode: '834469176-1', discount: 49,
},
{
  id: 265, name: 'Inverse eco-centric methodology', promoCode: '292530595-4', discount: 38,
},
{
  id: 266, name: 'Switchable encompassing flexibility', promoCode: '152491484-3', discount: 33,
},
{
  id: 267, name: 'Devolved user-facing process improvement', promoCode: '305128849-7', discount: 9,
},
{
  id: 268, name: 'Sharable content-based infrastructure', promoCode: '530289665-6', discount: 36,
},
{
  id: 269, name: 'Down-sized high-level ability', promoCode: '584605922-8', discount: 15,
},
{
  id: 270, name: 'Organized clear-thinking interface', promoCode: '391134569-0', discount: 12,
},
{
  id: 271, name: 'Face to face fresh-thinking capacity', promoCode: '152470869-0', discount: 96,
},
{
  id: 272, name: 'Reverse-engineered reciprocal array', promoCode: '880199842-2', discount: 83,
},
{
  id: 273, name: 'Synchronised methodical middleware', promoCode: '124777547-X', discount: 69,
},
{
  id: 274, name: 'Virtual coherent algorithm', promoCode: '413435177-4', discount: 88,
},
{
  id: 275, name: 'Ergonomic content-based throughput', promoCode: '071642922-5', discount: 72,
},
{
  id: 276, name: 'Versatile 3rd generation matrices', promoCode: '688523176-2', discount: 29,
},
{
  id: 277, name: 'Profound incremental contingency', promoCode: '485039952-5', discount: 12,
},
{
  id: 278, name: 'Customer-focused contextually-based pricing structure', promoCode: '807882905-1', discount: 2,
},
{
  id: 279, name: 'Multi-lateral logistical archive', promoCode: '979677131-4', discount: 53,
},
{
  id: 280, name: 'Grass-roots systemic encoding', promoCode: '310375634-8', discount: 55,
},
{
  id: 281, name: 'Organic bi-directional throughput', promoCode: '876683895-9', discount: 98,
},
{
  id: 282, name: 'Innovative bottom-line hub', promoCode: '764879029-7', discount: 40,
},
{
  id: 283, name: 'Team-oriented 24 hour internet solution', promoCode: '723387949-4', discount: 60,
},
{
  id: 284, name: 'Fundamental attitude-oriented pricing structure', promoCode: '452644677-7', discount: 32,
},
{
  id: 285, name: 'Enhanced intermediate capacity', promoCode: '461850277-0', discount: 78,
},
{
  id: 286, name: 'Business-focused clear-thinking capability', promoCode: '779261779-3', discount: 65,
},
{
  id: 287, name: 'Expanded mobile complexity', promoCode: '126570279-9', discount: 74,
},
{
  id: 288, name: 'Ergonomic user-facing paradigm', promoCode: '992535042-5', discount: 41,
},
{
  id: 289, name: 'Adaptive context-sensitive portal', promoCode: '006790367-3', discount: 17,
},
{
  id: 290, name: 'Optimized 3rd generation attitude', promoCode: '758141084-6', discount: 37,
},
{
  id: 291, name: 'Front-line actuating methodology', promoCode: '247845096-8', discount: 72,
},
{
  id: 292, name: 'Reverse-engineered neutral intranet', promoCode: '530321141-X', discount: 67,
},
{
  id: 293, name: 'Synergized interactive superstructure', promoCode: '062960733-8', discount: 79,
},
{
  id: 294, name: 'Devolved dedicated hub', promoCode: '021436056-3', discount: 42,
},
{
  id: 295, name: 'Automated bifurcated alliance', promoCode: '142830914-4', discount: 41,
},
{
  id: 296, name: 'Up-sized neutral task-force', promoCode: '283346866-0', discount: 62,
},
{
  id: 297, name: 'Extended fault-tolerant infrastructure', promoCode: '567844401-8', discount: 8,
},
{
  id: 298, name: 'Function-based dynamic superstructure', promoCode: '040840508-2', discount: 97,
},
{
  id: 299, name: 'Open-source fresh-thinking benchmark', promoCode: '011729069-6', discount: 20,
},
{
  id: 300, name: 'Horizontal explicit policy', promoCode: '989626876-2', discount: 72,
},
{
  id: 301, name: 'Function-based systematic function', promoCode: '949400690-9', discount: 97,
},
{
  id: 302, name: 'Focused needs-based workforce', promoCode: '480689551-2', discount: 98,
},
{
  id: 303, name: 'Fundamental mobile circuit', promoCode: '788981189-6', discount: 5,
},
{
  id: 304, name: 'Self-enabling value-added functionalities', promoCode: '551945332-2', discount: 93,
},
{
  id: 305, name: 'Optimized bifurcated hierarchy', promoCode: '403323601-5', discount: 51,
},
{
  id: 306, name: 'Pre-emptive web-enabled migration', promoCode: '383533214-7', discount: 88,
},
{
  id: 307, name: 'Business-focused full-range methodology', promoCode: '036799919-6', discount: 27,
},
{
  id: 308, name: 'Progressive clear-thinking knowledge base', promoCode: '982022564-7', discount: 4,
},
{
  id: 309, name: 'Enhanced optimal parallelism', promoCode: '531858735-6', discount: 66,
},
{
  id: 310, name: 'Function-based global website', promoCode: '792145527-1', discount: 36,
},
{
  id: 311, name: 'Ergonomic leading edge Graphical User Interface', promoCode: '828469535-9', discount: 4,
},
{
  id: 312, name: 'Inverse context-sensitive info-mediaries', promoCode: '129899168-4', discount: 21,
},
{
  id: 313, name: 'Ameliorated discrete neural-net', promoCode: '140727329-9', discount: 3,
},
{
  id: 314, name: 'Proactive analyzing Graphical User Interface', promoCode: '322434351-6', discount: 94,
},
{
  id: 315, name: 'De-engineered regional process improvement', promoCode: '840518976-9', discount: 19,
},
{
  id: 316, name: 'Re-engineered bifurcated paradigm', promoCode: '840967862-4', discount: 3,
},
{
  id: 317, name: 'Distributed asynchronous knowledge base', promoCode: '774085324-0', discount: 75,
},
{
  id: 318, name: 'Business-focused modular support', promoCode: '484631871-0', discount: 13,
},
{
  id: 319, name: 'Universal foreground pricing structure', promoCode: '481347913-8', discount: 70,
},
{
  id: 320, name: 'Configurable intangible data-warehouse', promoCode: '329866262-3', discount: 28,
},
{
  id: 321, name: 'Future-proofed well-modulated function', promoCode: '688901165-1', discount: 7,
},
{
  id: 322, name: 'Up-sized zero tolerance throughput', promoCode: '157661715-7', discount: 49,
},
{
  id: 323, name: 'Persevering solution-oriented moratorium', promoCode: '118676793-6', discount: 64,
},
{
  id: 324, name: 'Re-contextualized fresh-thinking circuit', promoCode: '535931007-3', discount: 17,
},
{
  id: 325, name: 'Operative systemic ability', promoCode: '107168511-2', discount: 75,
},
{
  id: 326, name: 'Intuitive discrete local area network', promoCode: '826220333-X', discount: 66,
},
{
  id: 327, name: 'Multi-tiered methodical project', promoCode: '502040020-3', discount: 43,
},
{
  id: 328, name: 'Centralized 4th generation standardization', promoCode: '704402804-7', discount: 36,
},
{
  id: 329, name: 'User-centric context-sensitive archive', promoCode: '344449663-X', discount: 95,
},
{
  id: 330, name: 'Right-sized 3rd generation capacity', promoCode: '087086345-2', discount: 52,
},
{
  id: 331, name: 'Operative real-time initiative', promoCode: '945183116-9', discount: 32,
},
{
  id: 332, name: 'Reverse-engineered full-range toolset', promoCode: '126937381-1', discount: 77,
},
{
  id: 333, name: 'Virtual 4th generation orchestration', promoCode: '604280366-2', discount: 92,
},
{
  id: 334, name: 'Profit-focused directional artificial intelligence', promoCode: '970774075-2', discount: 89,
},
{
  id: 335, name: 'Adaptive background middleware', promoCode: '606301311-3', discount: 24,
},
{
  id: 336, name: 'Open-source needs-based encoding', promoCode: '813090220-6', discount: 35,
},
{
  id: 337, name: 'Seamless exuding neural-net', promoCode: '051574754-8', discount: 61,
},
{
  id: 338, name: 'Future-proofed didactic attitude', promoCode: '354461080-9', discount: 91,
},
{
  id: 339, name: 'Open-source scalable interface', promoCode: '111056528-3', discount: 7,
},
{
  id: 340, name: 'Networked responsive archive', promoCode: '378956604-7', discount: 56,
},
{
  id: 341, name: 'Stand-alone next generation encryption', promoCode: '958099018-2', discount: 40,
},
{
  id: 342, name: 'Extended neutral projection', promoCode: '133912558-7', discount: 1,
},
{
  id: 343, name: 'Integrated homogeneous time-frame', promoCode: '992030541-3', discount: 59,
},
{
  id: 344, name: 'Profound encompassing hierarchy', promoCode: '358439203-9', discount: 7,
},
{
  id: 345, name: 'Future-proofed static database', promoCode: '178201235-4', discount: 38,
},
{
  id: 346, name: 'Multi-channelled uniform function', promoCode: '621268108-2', discount: 1,
},
{
  id: 347, name: 'Open-source zero administration knowledge base', promoCode: '632177552-5', discount: 88,
},
{
  id: 348, name: 'Sharable multi-tasking hub', promoCode: '130623739-4', discount: 81,
},
{
  id: 349, name: 'Cloned encompassing hierarchy', promoCode: '314163164-6', discount: 82,
},
{
  id: 350, name: 'Secured fresh-thinking process improvement', promoCode: '005753810-7', discount: 11,
},
{
  id: 351, name: 'Multi-layered intangible model', promoCode: '681223670-5', discount: 51,
},
{
  id: 352, name: 'Operative attitude-oriented info-mediaries', promoCode: '916949709-5', discount: 81,
},
{
  id: 353, name: 'Upgradable dynamic installation', promoCode: '915360295-1', discount: 74,
},
{
  id: 354, name: 'Horizontal dynamic neural-net', promoCode: '112896128-8', discount: 88,
},
{
  id: 355, name: 'Total optimal data-warehouse', promoCode: '085795966-2', discount: 8,
},
{
  id: 356, name: 'Ameliorated executive initiative', promoCode: '524821275-8', discount: 95,
},
{
  id: 357, name: 'Quality-focused maximized knowledge user', promoCode: '720900170-0', discount: 100,
},
{
  id: 358, name: 'Configurable system-worthy framework', promoCode: '404093422-9', discount: 28,
},
{
  id: 359, name: 'Versatile mission-critical attitude', promoCode: '338398839-2', discount: 74,
},
{
  id: 360, name: 'Down-sized bottom-line solution', promoCode: '662370005-6', discount: 35,
},
{
  id: 361, name: 'Synchronised attitude-oriented structure', promoCode: '481106212-4', discount: 79,
},
{
  id: 362, name: 'Managed solution-oriented productivity', promoCode: '526414087-1', discount: 27,
},
{
  id: 363, name: 'Secured analyzing emulation', promoCode: '146477812-4', discount: 64,
},
{
  id: 364, name: 'Organic needs-based utilisation', promoCode: '794864143-2', discount: 60,
},
{
  id: 365, name: 'Centralized eco-centric secured line', promoCode: '834255759-6', discount: 67,
},
{
  id: 366, name: 'Reactive intangible encoding', promoCode: '303559473-2', discount: 88,
},
{
  id: 367, name: 'Automated heuristic encryption', promoCode: '913541985-7', discount: 62,
},
{
  id: 368, name: 'Seamless human-resource middleware', promoCode: '296119775-9', discount: 10,
},
{
  id: 369, name: 'Advanced multi-tasking info-mediaries', promoCode: '463949960-4', discount: 20,
},
{
  id: 370, name: 'Distributed client-server strategy', promoCode: '074917084-0', discount: 3,
},
{
  id: 371, name: 'Open-architected asynchronous open system', promoCode: '765706646-6', discount: 58,
},
{
  id: 372, name: 'Diverse bifurcated infrastructure', promoCode: '997225172-1', discount: 68,
},
{
  id: 373, name: 'Re-engineered user-facing matrices', promoCode: '688250533-0', discount: 51,
},
{
  id: 374, name: 'Synchronised uniform array', promoCode: '195080425-9', discount: 45,
},
{
  id: 375, name: 'Balanced hybrid ability', promoCode: '149203872-5', discount: 77,
},
{
  id: 376, name: 'Profit-focused eco-centric model', promoCode: '917965617-X', discount: 53,
},
{
  id: 377, name: 'Triple-buffered grid-enabled collaboration', promoCode: '789967840-4', discount: 85,
},
{
  id: 378, name: 'Horizontal human-resource parallelism', promoCode: '569240935-6', discount: 44,
},
{
  id: 379, name: 'Multi-layered real-time methodology', promoCode: '093626594-9', discount: 49,
},
{
  id: 380, name: 'Synergized value-added projection', promoCode: '919110487-4', discount: 29,
},
{
  id: 381, name: 'Digitized 6th generation info-mediaries', promoCode: '830042629-9', discount: 5,
},
{
  id: 382, name: 'Implemented foreground architecture', promoCode: '366783880-8', discount: 20,
},
{
  id: 383, name: 'Distributed zero defect knowledge base', promoCode: '932416262-4', discount: 34,
},
{
  id: 384, name: 'Team-oriented mobile conglomeration', promoCode: '512762216-5', discount: 54,
},
{
  id: 385, name: 'Assimilated foreground Graphic Interface', promoCode: '178936946-0', discount: 45,
},
{
  id: 386, name: 'Re-contextualized systemic open system', promoCode: '905431549-0', discount: 62,
},
{
  id: 387, name: 'Progressive explicit database', promoCode: '047515313-8', discount: 10,
},
{
  id: 388, name: 'Ameliorated scalable customer loyalty', promoCode: '456431578-1', discount: 28,
},
{
  id: 389, name: 'Organic methodical toolset', promoCode: '299294696-6', discount: 88,
},
{
  id: 390, name: 'Secured solution-oriented extranet', promoCode: '551252632-4', discount: 3,
},
{
  id: 391, name: 'Enterprise-wide 6th generation interface', promoCode: '635934549-8', discount: 11,
},
{
  id: 392, name: 'Vision-oriented encompassing synergy', promoCode: '000260715-8', discount: 57,
},
{
  id: 393, name: 'Visionary 24/7 local area network', promoCode: '296970285-1', discount: 50,
},
{
  id: 394, name: 'Seamless optimal superstructure', promoCode: '199285829-2', discount: 64,
},
{
  id: 395, name: 'Customizable composite circuit', promoCode: '627312478-7', discount: 46,
},
{
  id: 396, name: 'Multi-layered multi-state knowledge base', promoCode: '301584234-X', discount: 37,
},
{
  id: 397, name: 'Triple-buffered systemic info-mediaries', promoCode: '931172313-4', discount: 19,
},
{
  id: 398, name: 'Adaptive even-keeled framework', promoCode: '405984874-3', discount: 17,
},
{
  id: 399, name: 'Visionary maximized Graphical User Interface', promoCode: '565842037-7', discount: 3,
},
{
  id: 400, name: 'Progressive exuding matrices', promoCode: '797882722-4', discount: 55,
},
{
  id: 401, name: 'Profound homogeneous installation', promoCode: '653731528-X', discount: 50,
},
{
  id: 402, name: 'Phased interactive solution', promoCode: '097827830-5', discount: 56,
},
{
  id: 403, name: 'Multi-channelled multi-state framework', promoCode: '591983181-2', discount: 25,
},
{
  id: 404, name: 'Implemented tangible superstructure', promoCode: '591587430-4', discount: 4,
},
{
  id: 405, name: 'Synergized mobile local area network', promoCode: '037628497-8', discount: 36,
},
{
  id: 406, name: 'Exclusive radical middleware', promoCode: '228918330-X', discount: 84,
},
{
  id: 407, name: 'Decentralized demand-driven local area network', promoCode: '867371101-0', discount: 62,
},
{
  id: 408, name: 'Reduced grid-enabled knowledge user', promoCode: '599227314-X', discount: 74,
},
{
  id: 409, name: 'Total grid-enabled standardization', promoCode: '911306453-3', discount: 51,
},
{
  id: 410, name: 'Ergonomic next generation structure', promoCode: '540373044-3', discount: 87,
},
{
  id: 411, name: 'Switchable 6th generation array', promoCode: '475333518-6', discount: 47,
},
{
  id: 412, name: 'De-engineered national interface', promoCode: '760809974-7', discount: 49,
},
{
  id: 413, name: 'Customer-focused 5th generation strategy', promoCode: '176085923-0', discount: 27,
},
{
  id: 414, name: 'Total analyzing adapter', promoCode: '959385440-1', discount: 32,
},
{
  id: 415, name: 'Ergonomic intangible system engine', promoCode: '876777268-4', discount: 13,
},
{
  id: 416, name: 'Distributed fresh-thinking local area network', promoCode: '794942915-1', discount: 24,
},
{
  id: 417, name: 'Team-oriented directional database', promoCode: '974660923-8', discount: 92,
},
{
  id: 418, name: 'Streamlined foreground task-force', promoCode: '642899881-5', discount: 86,
},
{
  id: 419, name: 'Organized eco-centric product', promoCode: '465463008-2', discount: 33,
},
{
  id: 420, name: 'Universal national secured line', promoCode: '523035361-9', discount: 41,
},
{
  id: 421, name: 'Reverse-engineered didactic hierarchy', promoCode: '907507120-5', discount: 6,
},
{
  id: 422, name: 'De-engineered zero defect orchestration', promoCode: '235206022-2', discount: 71,
},
{
  id: 423, name: 'Robust demand-driven website', promoCode: '276379117-4', discount: 81,
},
{
  id: 424, name: 'De-engineered transitional synergy', promoCode: '885186464-0', discount: 19,
},
{
  id: 425, name: 'Ameliorated coherent process improvement', promoCode: '291838128-4', discount: 27,
},
{
  id: 426, name: 'Up-sized zero defect functionalities', promoCode: '871462185-1', discount: 6,
},
{
  id: 427, name: 'Grass-roots 5th generation matrix', promoCode: '256525371-0', discount: 91,
},
{
  id: 428, name: 'Realigned real-time productivity', promoCode: '571835387-5', discount: 20,
},
{
  id: 429, name: 'Triple-buffered bottom-line benchmark', promoCode: '738491171-0', discount: 91,
},
{
  id: 430, name: 'Up-sized value-added forecast', promoCode: '885635387-3', discount: 36,
},
{
  id: 431, name: 'Profound high-level service-desk', promoCode: '131063591-9', discount: 64,
},
{
  id: 432, name: 'Distributed interactive productivity', promoCode: '482306293-0', discount: 59,
},
{
  id: 433, name: 'Reverse-engineered leading edge emulation', promoCode: '291636771-3', discount: 15,
},
{
  id: 434, name: 'Sharable executive system engine', promoCode: '909567437-1', discount: 50,
},
{
  id: 435, name: 'Grass-roots non-volatile protocol', promoCode: '819951193-1', discount: 41,
},
{
  id: 436, name: 'Right-sized secondary analyzer', promoCode: '917614263-9', discount: 4,
},
{
  id: 437, name: 'Virtual user-facing definition', promoCode: '204834634-0', discount: 54,
},
{
  id: 438, name: 'Centralized scalable interface', promoCode: '404348401-1', discount: 63,
},
{
  id: 439, name: 'De-engineered multi-tasking product', promoCode: '946688698-3', discount: 79,
},
{
  id: 440, name: 'Ameliorated local strategy', promoCode: '650680901-9', discount: 78,
},
{
  id: 441, name: 'Proactive global interface', promoCode: '260387750-X', discount: 79,
},
{
  id: 442, name: 'Enterprise-wide web-enabled definition', promoCode: '900260417-3', discount: 35,
},
{
  id: 443, name: 'Focused actuating help-desk', promoCode: '893376673-1', discount: 35,
},
{
  id: 444, name: 'Face to face static approach', promoCode: '255014812-6', discount: 27,
},
{
  id: 445, name: 'Sharable static system engine', promoCode: '135784107-8', discount: 55,
},
{
  id: 446, name: 'Triple-buffered leading edge project', promoCode: '752787848-7', discount: 6,
},
{
  id: 447, name: 'Right-sized bandwidth-monitored hub', promoCode: '739900030-1', discount: 68,
},
{
  id: 448, name: 'Implemented high-level database', promoCode: '447781253-1', discount: 57,
},
{
  id: 449, name: 'Programmable asynchronous artificial intelligence', promoCode: '619619469-0', discount: 40,
},
{
  id: 450, name: 'Progressive scalable knowledge user', promoCode: '672190622-8', discount: 27,
},
{
  id: 451, name: 'Phased motivating circuit', promoCode: '713242850-0', discount: 54,
},
{
  id: 452, name: 'Reactive actuating portal', promoCode: '066202566-0', discount: 86,
},
{
  id: 453, name: 'Pre-emptive fresh-thinking alliance', promoCode: '674855563-9', discount: 90,
},
{
  id: 454, name: 'Diverse leading edge focus group', promoCode: '429207361-9', discount: 98,
},
{
  id: 455, name: 'Multi-channelled homogeneous moratorium', promoCode: '929024815-7', discount: 49,
},
{
  id: 456, name: 'Seamless value-added firmware', promoCode: '048985410-9', discount: 2,
},
{
  id: 457, name: 'Assimilated explicit conglomeration', promoCode: '771434445-8', discount: 66,
},
{
  id: 458, name: 'Exclusive analyzing synergy', promoCode: '507523857-2', discount: 40,
},
{
  id: 459, name: 'Grass-roots bifurcated framework', promoCode: '263903875-3', discount: 50,
},
{
  id: 460, name: 'Advanced context-sensitive encoding', promoCode: '076267338-9', discount: 10,
},
{
  id: 461, name: 'Versatile actuating protocol', promoCode: '638608298-2', discount: 89,
},
{
  id: 462, name: 'Customizable client-driven hub', promoCode: '202336473-6', discount: 84,
},
{
  id: 463, name: 'Streamlined solution-oriented open system', promoCode: '795125854-7', discount: 40,
},
{
  id: 464, name: 'Customer-focused 24/7 archive', promoCode: '652583929-7', discount: 2,
},
{
  id: 465, name: 'Persevering systemic focus group', promoCode: '070855063-0', discount: 16,
},
{
  id: 466, name: 'Adaptive asymmetric open system', promoCode: '744425415-X', discount: 90,
},
{
  id: 467, name: 'Self-enabling web-enabled leverage', promoCode: '152330708-0', discount: 81,
},
{
  id: 468, name: 'Extended logistical pricing structure', promoCode: '888465464-5', discount: 48,
},
{
  id: 469, name: 'Switchable user-facing success', promoCode: '950510222-4', discount: 46,
},
{
  id: 470, name: 'User-centric hybrid synergy', promoCode: '369915454-8', discount: 8,
},
{
  id: 471, name: 'User-centric reciprocal budgetary management', promoCode: '289476136-8', discount: 92,
},
{
  id: 472, name: 'Face to face hybrid protocol', promoCode: '008900475-2', discount: 8,
},
{
  id: 473, name: 'Ameliorated neutral open architecture', promoCode: '591949281-3', discount: 78,
},
{
  id: 474, name: 'Profound coherent interface', promoCode: '615985746-0', discount: 58,
},
{
  id: 475, name: 'Organized modular project', promoCode: '782490940-9', discount: 49,
},
{
  id: 476, name: 'Re-engineered bifurcated secured line', promoCode: '275982855-7', discount: 69,
},
{
  id: 477, name: 'Extended transitional capacity', promoCode: '709079468-7', discount: 94,
},
{
  id: 478, name: 'Self-enabling encompassing success', promoCode: '085059102-3', discount: 31,
},
{
  id: 479, name: 'Switchable full-range moratorium', promoCode: '561222904-6', discount: 12,
},
{
  id: 480, name: 'Total actuating approach', promoCode: '491971064-X', discount: 72,
},
{
  id: 481, name: 'Public-key fresh-thinking artificial intelligence', promoCode: '986157354-2', discount: 45,
},
{
  id: 482, name: 'Up-sized foreground adapter', promoCode: '688282344-8', discount: 7,
},
{
  id: 483, name: 'Optional web-enabled encryption', promoCode: '553069852-2', discount: 82,
},
{
  id: 484, name: 'Right-sized explicit intranet', promoCode: '203762192-2', discount: 94,
},
{
  id: 485, name: 'Cloned didactic analyzer', promoCode: '908833362-9', discount: 5,
},
{
  id: 486, name: 'Persevering bifurcated firmware', promoCode: '759687868-7', discount: 40,
},
{
  id: 487, name: 'Decentralized next generation implementation', promoCode: '726510939-2', discount: 14,
},
{
  id: 488, name: 'Enhanced fresh-thinking database', promoCode: '986878192-2', discount: 49,
},
{
  id: 489, name: 'Enterprise-wide human-resource collaboration', promoCode: '778010353-6', discount: 24,
},
{
  id: 490, name: 'Persevering fresh-thinking time-frame', promoCode: '895617784-8', discount: 57,
},
{
  id: 491, name: 'Inverse static firmware', promoCode: '891855771-X', discount: 89,
},
{
  id: 492, name: 'Re-contextualized coherent frame', promoCode: '550630291-6', discount: 61,
},
{
  id: 493, name: 'Visionary local alliance', promoCode: '609758680-9', discount: 14,
},
{
  id: 494, name: 'Monitored systemic application', promoCode: '510753520-8', discount: 55,
},
{
  id: 495, name: 'Programmable analyzing complexity', promoCode: '579019264-5', discount: 95,
},
{
  id: 496, name: 'Adaptive radical structure', promoCode: '515420974-5', discount: 7,
},
{
  id: 497, name: 'Open-architected clear-thinking alliance', promoCode: '411988035-4', discount: 34,
},
{
  id: 498, name: 'Open-source dynamic functionalities', promoCode: '741758341-5', discount: 44,
},
{
  id: 499, name: 'Fundamental needs-based core', promoCode: '079658346-3', discount: 17,
},
{
  id: 500, name: 'Multi-layered national data-warehouse', promoCode: '680008048-9', discount: 79,
},
{
  id: 501, name: 'Object-based leading edge productivity', promoCode: '028113456-1', discount: 70,
},
{
  id: 502, name: 'De-engineered leading edge product', promoCode: '604834958-0', discount: 12,
},
{
  id: 503, name: 'Innovative didactic capability', promoCode: '712670522-0', discount: 69,
},
{
  id: 504, name: 'Secured 5th generation workforce', promoCode: '227577777-6', discount: 38,
},
{
  id: 505, name: 'Quality-focused systematic functionalities', promoCode: '442742620-4', discount: 71,
},
{
  id: 506, name: 'Integrated clear-thinking array', promoCode: '944758120-X', discount: 89,
},
{
  id: 507, name: 'User-friendly high-level forecast', promoCode: '552062336-8', discount: 70,
},
{
  id: 508, name: 'Devolved leading edge algorithm', promoCode: '190834144-0', discount: 10,
},
{
  id: 509, name: 'Streamlined empowering access', promoCode: '381168945-2', discount: 22,
},
{
  id: 510, name: 'Fully-configurable mission-critical portal', promoCode: '681878597-2', discount: 35,
},
{
  id: 511, name: 'Realigned asymmetric array', promoCode: '823784238-3', discount: 42,
},
{
  id: 512, name: 'Advanced bifurcated analyzer', promoCode: '826460533-8', discount: 21,
},
{
  id: 513, name: 'Configurable demand-driven utilisation', promoCode: '206637269-2', discount: 37,
},
{
  id: 514, name: 'Integrated interactive middleware', promoCode: '194767188-X', discount: 61,
},
{
  id: 515, name: 'Configurable incremental monitoring', promoCode: '767403311-2', discount: 28,
},
{
  id: 516, name: 'Front-line leading edge forecast', promoCode: '909739478-3', discount: 97,
},
{
  id: 517, name: 'Intuitive systematic utilisation', promoCode: '207403424-5', discount: 82,
},
{
  id: 518, name: 'Intuitive explicit challenge', promoCode: '794186675-7', discount: 70,
},
{
  id: 519, name: 'Future-proofed 24/7 emulation', promoCode: '318106605-2', discount: 19,
},
{
  id: 520, name: 'Networked coherent contingency', promoCode: '234405536-3', discount: 77,
},
{
  id: 521, name: 'Inverse foreground synergy', promoCode: '155527858-2', discount: 44,
},
{
  id: 522, name: 'Organic object-oriented data-warehouse', promoCode: '025599537-7', discount: 78,
},
{
  id: 523, name: 'Networked asymmetric function', promoCode: '320381578-8', discount: 54,
},
{
  id: 524, name: 'Re-contextualized executive encryption', promoCode: '967026848-6', discount: 42,
},
{
  id: 525, name: 'Enhanced cohesive synergy', promoCode: '577347023-3', discount: 66,
},
{
  id: 526, name: 'Multi-tiered homogeneous initiative', promoCode: '312146158-3', discount: 50,
},
{
  id: 527, name: 'Managed solution-oriented adapter', promoCode: '026033956-3', discount: 3,
},
{
  id: 528, name: 'Phased mission-critical knowledge user', promoCode: '300413864-6', discount: 41,
},
{
  id: 529, name: 'Stand-alone systemic initiative', promoCode: '386361528-X', discount: 77,
},
{
  id: 530, name: 'Persistent reciprocal project', promoCode: '543055068-X', discount: 17,
},
{
  id: 531, name: 'Programmable well-modulated instruction set', promoCode: '428713213-0', discount: 3,
},
{
  id: 532, name: 'Vision-oriented grid-enabled superstructure', promoCode: '746230287-X', discount: 92,
},
{
  id: 533, name: 'Virtual fresh-thinking utilisation', promoCode: '549737126-4', discount: 58,
},
{
  id: 534, name: 'Reverse-engineered intermediate middleware', promoCode: '054608519-9', discount: 3,
},
{
  id: 535, name: 'Networked zero tolerance knowledge user', promoCode: '040528252-4', discount: 97,
},
{
  id: 536, name: 'Organic zero defect conglomeration', promoCode: '714213717-7', discount: 1,
},
{
  id: 537, name: 'Open-architected even-keeled service-desk', promoCode: '325557916-3', discount: 59,
},
{
  id: 538, name: 'Persevering motivating task-force', promoCode: '082356260-3', discount: 53,
},
{
  id: 539, name: 'Managed leading edge strategy', promoCode: '389089400-3', discount: 54,
},
{
  id: 540, name: 'Right-sized contextually-based extranet', promoCode: '662906322-8', discount: 28,
},
{
  id: 541, name: 'Down-sized discrete Graphic Interface', promoCode: '804468457-3', discount: 47,
},
{
  id: 542, name: 'Automated even-keeled function', promoCode: '477389642-6', discount: 44,
},
{
  id: 543, name: 'Object-based intermediate local area network', promoCode: '182151921-3', discount: 29,
},
{
  id: 544, name: 'Multi-tiered global concept', promoCode: '700581597-1', discount: 51,
},
{
  id: 545, name: 'Function-based contextually-based methodology', promoCode: '125823966-3', discount: 23,
},
{
  id: 546, name: 'Compatible empowering hub', promoCode: '961845015-5', discount: 68,
},
{
  id: 547, name: 'Integrated uniform definition', promoCode: '684602508-1', discount: 81,
},
{
  id: 548, name: 'Persevering motivating alliance', promoCode: '197678658-4', discount: 6,
},
{
  id: 549, name: 'Compatible web-enabled toolset', promoCode: '028213640-1', discount: 86,
},
{
  id: 550, name: 'Virtual background synergy', promoCode: '762441817-7', discount: 76,
},
{
  id: 551, name: 'Cross-group cohesive product', promoCode: '030597808-X', discount: 84,
},
{
  id: 552, name: 'Configurable 6th generation budgetary management', promoCode: '258998366-2', discount: 73,
},
{
  id: 553, name: 'Automated composite methodology', promoCode: '744962215-7', discount: 5,
},
{
  id: 554, name: 'Object-based homogeneous customer loyalty', promoCode: '245488953-6', discount: 33,
},
{
  id: 555, name: 'Managed asynchronous frame', promoCode: '466875947-3', discount: 69,
},
{
  id: 556, name: 'Optimized composite website', promoCode: '163699853-4', discount: 5,
},
{
  id: 557, name: 'Devolved static adapter', promoCode: '649629100-4', discount: 47,
},
{
  id: 558, name: 'Cloned holistic portal', promoCode: '394878273-3', discount: 58,
},
{
  id: 559, name: 'Right-sized eco-centric application', promoCode: '895823268-4', discount: 100,
},
{
  id: 560, name: 'Fundamental demand-driven circuit', promoCode: '395770143-0', discount: 62,
},
{
  id: 561, name: 'Synergized zero defect application', promoCode: '757813285-7', discount: 64,
},
{
  id: 562, name: 'Focused next generation groupware', promoCode: '787511265-6', discount: 37,
},
{
  id: 563, name: 'Distributed dynamic moratorium', promoCode: '473155040-8', discount: 23,
},
{
  id: 564, name: 'Profit-focused mobile hierarchy', promoCode: '236255544-5', discount: 59,
},
{
  id: 565, name: 'Persistent coherent algorithm', promoCode: '731035899-6', discount: 60,
},
{
  id: 566, name: 'Configurable uniform hardware', promoCode: '362493296-9', discount: 15,
},
{
  id: 567, name: 'Automated background solution', promoCode: '140447783-7', discount: 88,
},
{
  id: 568, name: 'Persistent zero defect internet solution', promoCode: '205286754-6', discount: 53,
},
{
  id: 569, name: 'Vision-oriented coherent data-warehouse', promoCode: '612859228-7', discount: 100,
},
{
  id: 570, name: 'Stand-alone leading edge focus group', promoCode: '205905472-9', discount: 4,
},
{
  id: 571, name: 'Open-architected context-sensitive local area network', promoCode: '491525252-3', discount: 18,
},
{
  id: 572, name: 'Advanced web-enabled framework', promoCode: '739221070-X', discount: 57,
},
{
  id: 573, name: 'Sharable holistic toolset', promoCode: '858458921-X', discount: 9,
},
{
  id: 574, name: 'Face to face real-time moderator', promoCode: '590014516-6', discount: 15,
},
{
  id: 575, name: 'Advanced well-modulated circuit', promoCode: '297297434-4', discount: 50,
},
{
  id: 576, name: 'Compatible contextually-based protocol', promoCode: '499624354-6', discount: 53,
},
{
  id: 577, name: 'Grass-roots interactive monitoring', promoCode: '071356586-1', discount: 32,
},
{
  id: 578, name: 'Sharable empowering array', promoCode: '419679027-5', discount: 98,
},
{
  id: 579, name: 'Re-engineered 4th generation collaboration', promoCode: '797447476-9', discount: 29,
},
{
  id: 580, name: 'Stand-alone global time-frame', promoCode: '301530554-9', discount: 25,
},
{
  id: 581, name: 'Business-focused user-facing frame', promoCode: '456537586-9', discount: 95,
},
{
  id: 582, name: 'Virtual dynamic interface', promoCode: '403762070-7', discount: 15,
},
{
  id: 583, name: 'Streamlined didactic utilisation', promoCode: '635453680-5', discount: 73,
},
{
  id: 584, name: 'Triple-buffered dynamic extranet', promoCode: '661428127-5', discount: 4,
},
{
  id: 585, name: 'Distributed high-level algorithm', promoCode: '472212609-7', discount: 37,
},
{
  id: 586, name: 'User-centric background implementation', promoCode: '799861888-4', discount: 93,
},
{
  id: 587, name: 'Optimized uniform customer loyalty', promoCode: '020998103-2', discount: 64,
},
{
  id: 588, name: 'Multi-lateral local superstructure', promoCode: '383594312-X', discount: 56,
},
{
  id: 589, name: 'Operative encompassing task-force', promoCode: '693069259-X', discount: 63,
},
{
  id: 590, name: 'Re-engineered radical leverage', promoCode: '090210545-0', discount: 73,
},
{
  id: 591, name: 'Expanded executive database', promoCode: '288508430-8', discount: 19,
},
{
  id: 592, name: 'Multi-channelled multi-tasking alliance', promoCode: '641379560-3', discount: 24,
},
{
  id: 593, name: 'Integrated static success', promoCode: '743654052-1', discount: 97,
},
{
  id: 594, name: 'Organic homogeneous budgetary management', promoCode: '839410472-X', discount: 12,
},
{
  id: 595, name: 'Customer-focused bi-directional moratorium', promoCode: '781487354-1', discount: 36,
},
{
  id: 596, name: 'Public-key heuristic local area network', promoCode: '613946184-7', discount: 65,
},
{
  id: 597, name: 'Intuitive stable utilisation', promoCode: '286718166-6', discount: 34,
},
{
  id: 598, name: 'Universal needs-based internet solution', promoCode: '999473877-1', discount: 22,
},
{
  id: 599, name: 'Multi-layered asynchronous initiative', promoCode: '624681159-0', discount: 20,
},
{
  id: 600, name: 'Function-based context-sensitive encoding', promoCode: '438875246-0', discount: 56,
},
{
  id: 601, name: 'Optimized regional budgetary management', promoCode: '754691530-9', discount: 47,
},
{
  id: 602, name: 'Monitored exuding architecture', promoCode: '248809722-5', discount: 49,
},
{
  id: 603, name: 'Re-contextualized transitional forecast', promoCode: '662646172-9', discount: 58,
},
{
  id: 604, name: 'Total 5th generation superstructure', promoCode: '083203950-0', discount: 13,
},
{
  id: 605, name: 'Object-based value-added strategy', promoCode: '145826003-8', discount: 73,
},
{
  id: 606, name: 'Advanced bandwidth-monitored product', promoCode: '161206091-9', discount: 72,
},
{
  id: 607, name: 'Multi-lateral zero tolerance forecast', promoCode: '001748459-6', discount: 72,
},
{
  id: 608, name: 'Right-sized analyzing product', promoCode: '256709545-4', discount: 2,
},
{
  id: 609, name: 'Exclusive system-worthy intranet', promoCode: '212577594-8', discount: 10,
},
{
  id: 610, name: 'Reactive clear-thinking model', promoCode: '890047527-4', discount: 37,
},
{
  id: 611, name: 'Team-oriented leading edge open system', promoCode: '674612207-7', discount: 45,
},
{
  id: 612, name: 'Cloned bottom-line structure', promoCode: '304187460-1', discount: 84,
},
{
  id: 613, name: 'Expanded actuating synergy', promoCode: '473514367-X', discount: 100,
},
{
  id: 614, name: 'Automated hybrid matrix', promoCode: '931453378-6', discount: 58,
},
{
  id: 615, name: 'Ameliorated real-time solution', promoCode: '845652871-4', discount: 96,
},
{
  id: 616, name: 'Vision-oriented discrete superstructure', promoCode: '299862714-5', discount: 4,
},
{
  id: 617, name: 'Managed attitude-oriented moderator', promoCode: '848805420-3', discount: 3,
},
{
  id: 618, name: 'Universal object-oriented encryption', promoCode: '618314830-X', discount: 48,
},
{
  id: 619, name: 'Integrated modular customer loyalty', promoCode: '206658290-5', discount: 19,
},
{
  id: 620, name: 'Triple-buffered composite website', promoCode: '238291577-3', discount: 73,
},
{
  id: 621, name: 'Secured value-added emulation', promoCode: '437263269-X', discount: 5,
},
{
  id: 622, name: 'Automated zero defect application', promoCode: '010337561-9', discount: 10,
},
{
  id: 623, name: 'Re-engineered mission-critical matrix', promoCode: '339035189-2', discount: 28,
},
{
  id: 624, name: 'Public-key interactive intranet', promoCode: '563896134-8', discount: 64,
},
{
  id: 625, name: 'Realigned incremental infrastructure', promoCode: '119393384-6', discount: 98,
},
{
  id: 626, name: 'Ergonomic multimedia website', promoCode: '470236579-7', discount: 16,
},
{
  id: 627, name: 'Vision-oriented leading edge synergy', promoCode: '865807277-0', discount: 53,
},
{
  id: 628, name: 'Upgradable bottom-line structure', promoCode: '308686985-2', discount: 8,
},
{
  id: 629, name: 'Reverse-engineered static groupware', promoCode: '703573582-8', discount: 35,
},
{
  id: 630, name: 'Quality-focused radical portal', promoCode: '342975931-5', discount: 39,
},
{
  id: 631, name: 'Cloned upward-trending concept', promoCode: '764829179-7', discount: 28,
},
{
  id: 632, name: 'Fully-configurable empowering throughput', promoCode: '577809148-6', discount: 25,
},
{
  id: 633, name: 'Ameliorated interactive time-frame', promoCode: '109903120-6', discount: 42,
},
{
  id: 634, name: 'Multi-channelled multi-tasking definition', promoCode: '123644273-3', discount: 97,
},
{
  id: 635, name: 'Exclusive real-time functionalities', promoCode: '445297462-7', discount: 54,
},
{
  id: 636, name: 'Digitized fresh-thinking circuit', promoCode: '070666850-2', discount: 41,
},
{
  id: 637, name: 'Open-architected 5th generation firmware', promoCode: '932522921-8', discount: 76,
},
{
  id: 638, name: 'Organic attitude-oriented portal', promoCode: '464489438-9', discount: 97,
},
{
  id: 639, name: 'Digitized exuding approach', promoCode: '881365285-2', discount: 91,
},
{
  id: 640, name: 'Digitized regional moderator', promoCode: '994631127-5', discount: 13,
},
{
  id: 641, name: 'Seamless full-range leverage', promoCode: '369836085-3', discount: 73,
},
{
  id: 642, name: 'Synergized 4th generation emulation', promoCode: '155242939-3', discount: 73,
},
{
  id: 643, name: 'Adaptive upward-trending throughput', promoCode: '079637522-4', discount: 42,
},
{
  id: 644, name: 'Horizontal multi-tasking website', promoCode: '419663602-0', discount: 22,
},
{
  id: 645, name: 'Multi-tiered methodical knowledge user', promoCode: '850308271-3', discount: 91,
},
{
  id: 646, name: 'Business-focused methodical extranet', promoCode: '736556586-1', discount: 45,
},
{
  id: 647, name: 'Object-based multi-state intranet', promoCode: '937397949-3', discount: 92,
},
{
  id: 648, name: 'Cloned local definition', promoCode: '600560573-9', discount: 19,
},
{
  id: 649, name: 'Total incremental open system', promoCode: '586808970-7', discount: 47,
},
{
  id: 650, name: 'Progressive high-level budgetary management', promoCode: '226941606-6', discount: 15,
},
{
  id: 651, name: 'Horizontal 3rd generation matrix', promoCode: '839096673-5', discount: 95,
},
{
  id: 652, name: 'Team-oriented directional complexity', promoCode: '187412955-X', discount: 71,
},
{
  id: 653, name: 'Managed intermediate database', promoCode: '312888265-7', discount: 62,
},
{
  id: 654, name: 'Team-oriented needs-based support', promoCode: '182202672-5', discount: 30,
},
{
  id: 655, name: 'Profit-focused fault-tolerant firmware', promoCode: '584018813-1', discount: 70,
},
{
  id: 656, name: 'Team-oriented intermediate moderator', promoCode: '989585755-1', discount: 94,
},
{
  id: 657, name: 'Reduced object-oriented time-frame', promoCode: '887651349-3', discount: 55,
},
{
  id: 658, name: 'Up-sized scalable groupware', promoCode: '066789148-X', discount: 42,
},
{
  id: 659, name: 'Ameliorated clear-thinking algorithm', promoCode: '739721549-1', discount: 43,
},
{
  id: 660, name: 'Persevering 6th generation initiative', promoCode: '602662159-8', discount: 71,
},
{
  id: 661, name: 'Extended leading edge analyzer', promoCode: '830357856-1', discount: 51,
},
{
  id: 662, name: 'Customer-focused tertiary middleware', promoCode: '931660807-4', discount: 94,
},
{
  id: 663, name: 'Exclusive multimedia frame', promoCode: '172657821-6', discount: 100,
},
{
  id: 664, name: 'Reverse-engineered composite open system', promoCode: '266981246-5', discount: 14,
},
{
  id: 665, name: 'Cross-platform regional moderator', promoCode: '851745377-8', discount: 22,
},
{
  id: 666, name: 'Monitored secondary function', promoCode: '310835695-X', discount: 81,
},
{
  id: 667, name: 'User-centric tertiary instruction set', promoCode: '885087616-5', discount: 88,
},
{
  id: 668, name: 'Persistent disintermediate open system', promoCode: '573367987-5', discount: 85,
},
{
  id: 669, name: 'Devolved intangible algorithm', promoCode: '549576167-7', discount: 55,
},
{
  id: 670, name: 'Managed motivating paradigm', promoCode: '978030815-6', discount: 39,
},
{
  id: 671, name: 'Multi-lateral human-resource software', promoCode: '940920785-1', discount: 92,
},
{
  id: 672, name: 'Configurable logistical alliance', promoCode: '261170504-6', discount: 11,
},
{
  id: 673, name: 'Business-focused zero administration firmware', promoCode: '241672403-7', discount: 85,
},
{
  id: 674, name: 'Progressive motivating leverage', promoCode: '334248723-2', discount: 5,
},
{
  id: 675, name: 'Universal zero defect artificial intelligence', promoCode: '580002886-9', discount: 17,
},
{
  id: 676, name: 'Implemented transitional Graphic Interface', promoCode: '494460668-0', discount: 18,
},
{
  id: 677, name: 'Profit-focused well-modulated interface', promoCode: '513483700-7', discount: 26,
},
{
  id: 678, name: 'Cloned bottom-line protocol', promoCode: '019476043-X', discount: 51,
},
{
  id: 679, name: 'Exclusive 5th generation neural-net', promoCode: '481997041-0', discount: 21,
},
{
  id: 680, name: 'Vision-oriented intangible approach', promoCode: '737958097-3', discount: 2,
},
{
  id: 681, name: 'Open-source hybrid help-desk', promoCode: '596347733-6', discount: 2,
},
{
  id: 682, name: 'Intuitive asymmetric task-force', promoCode: '488589049-7', discount: 12,
},
{
  id: 683, name: 'Expanded 5th generation circuit', promoCode: '258746698-9', discount: 100,
},
{
  id: 684, name: 'De-engineered motivating firmware', promoCode: '505974471-X', discount: 21,
},
{
  id: 685, name: 'Self-enabling needs-based firmware', promoCode: '904274832-X', discount: 56,
},
{
  id: 686, name: 'Versatile attitude-oriented capacity', promoCode: '872537489-3', discount: 62,
},
{
  id: 687, name: 'Streamlined context-sensitive challenge', promoCode: '318849187-5', discount: 79,
},
{
  id: 688, name: 'Inverse next generation collaboration', promoCode: '310391775-9', discount: 59,
},
{
  id: 689, name: 'Switchable hybrid leverage', promoCode: '890342774-2', discount: 59,
},
{
  id: 690, name: 'Devolved clear-thinking function', promoCode: '371250416-0', discount: 18,
},
{
  id: 691, name: 'Grass-roots logistical firmware', promoCode: '131751021-6', discount: 9,
},
{
  id: 692, name: 'Adaptive upward-trending intranet', promoCode: '444948521-1', discount: 66,
},
{
  id: 693, name: 'Fully-configurable secondary definition', promoCode: '823064105-6', discount: 51,
},
{
  id: 694, name: 'De-engineered dedicated superstructure', promoCode: '364787751-4', discount: 11,
},
{
  id: 695, name: 'Progressive impactful conglomeration', promoCode: '787767901-7', discount: 36,
},
{
  id: 696, name: 'Programmable user-facing architecture', promoCode: '896113707-7', discount: 29,
},
{
  id: 697, name: 'Integrated national throughput', promoCode: '239601839-6', discount: 55,
},
{
  id: 698, name: 'Balanced full-range utilisation', promoCode: '781020599-4', discount: 11,
},
{
  id: 699, name: 'Universal asynchronous parallelism', promoCode: '326325918-0', discount: 58,
},
{
  id: 700, name: 'Secured coherent neural-net', promoCode: '131408659-6', discount: 7,
},
{
  id: 701, name: 'Visionary exuding product', promoCode: '685349296-X', discount: 5,
},
{
  id: 702, name: 'Vision-oriented bottom-line model', promoCode: '612343786-0', discount: 5,
},
{
  id: 703, name: 'Quality-focused transitional contingency', promoCode: '864519669-7', discount: 1,
},
{
  id: 704, name: 'Ameliorated high-level challenge', promoCode: '289082039-4', discount: 63,
},
{
  id: 705, name: 'Multi-lateral grid-enabled hub', promoCode: '434554046-1', discount: 12,
},
{
  id: 706, name: 'Configurable national monitoring', promoCode: '951564932-3', discount: 40,
},
{
  id: 707, name: 'Right-sized national portal', promoCode: '790792273-9', discount: 12,
},
{
  id: 708, name: 'Networked static strategy', promoCode: '763206838-4', discount: 49,
},
{
  id: 709, name: 'Virtual upward-trending groupware', promoCode: '274771192-7', discount: 59,
},
{
  id: 710, name: 'Progressive multi-state matrices', promoCode: '846683155-X', discount: 51,
},
{
  id: 711, name: 'Expanded systematic implementation', promoCode: '778539529-2', discount: 99,
},
{
  id: 712, name: 'Proactive dynamic project', promoCode: '239179291-3', discount: 13,
},
{
  id: 713, name: 'Profound methodical methodology', promoCode: '031385233-2', discount: 15,
},
{
  id: 714, name: 'Seamless composite algorithm', promoCode: '455673824-5', discount: 47,
},
{
  id: 715, name: 'Decentralized reciprocal process improvement', promoCode: '934834402-1', discount: 98,
},
{
  id: 716, name: 'Visionary disintermediate array', promoCode: '646454073-4', discount: 99,
},
{
  id: 717, name: 'Triple-buffered reciprocal application', promoCode: '819359640-4', discount: 91,
},
{
  id: 718, name: 'Inverse bandwidth-monitored adapter', promoCode: '478179181-6', discount: 51,
},
{
  id: 719, name: 'Compatible 4th generation success', promoCode: '653730810-0', discount: 23,
},
{
  id: 720, name: 'Versatile zero administration toolset', promoCode: '450771341-2', discount: 28,
},
{
  id: 721, name: 'De-engineered clear-thinking collaboration', promoCode: '232891408-X', discount: 78,
},
{
  id: 722, name: 'Multi-layered content-based core', promoCode: '290762420-2', discount: 21,
},
{
  id: 723, name: 'Programmable intermediate forecast', promoCode: '875196109-1', discount: 83,
},
{
  id: 724, name: 'Synergized heuristic capability', promoCode: '743888326-4', discount: 64,
},
{
  id: 725, name: 'Business-focused solution-oriented function', promoCode: '839706936-4', discount: 76,
},
{
  id: 726, name: 'Inverse secondary software', promoCode: '225412111-1', discount: 74,
},
{
  id: 727, name: 'Visionary systematic capacity', promoCode: '727182378-6', discount: 4,
},
{
  id: 728, name: 'Distributed value-added artificial intelligence', promoCode: '795077614-5', discount: 61,
},
{
  id: 729, name: 'Customizable optimizing productivity', promoCode: '212979544-7', discount: 33,
},
{
  id: 730, name: 'Stand-alone bi-directional algorithm', promoCode: '412175898-6', discount: 25,
},
{
  id: 731, name: 'Innovative tertiary installation', promoCode: '997187583-7', discount: 16,
},
{
  id: 732, name: 'Fundamental logistical help-desk', promoCode: '520586714-0', discount: 62,
},
{
  id: 733, name: 'Optimized human-resource utilisation', promoCode: '822553726-2', discount: 9,
},
{
  id: 734, name: 'Reverse-engineered user-facing initiative', promoCode: '742376434-5', discount: 47,
},
{
  id: 735, name: 'Secured bifurcated open system', promoCode: '826081613-X', discount: 53,
},
{
  id: 736, name: 'Re-contextualized stable ability', promoCode: '338491631-X', discount: 46,
},
{
  id: 737, name: 'Ergonomic scalable initiative', promoCode: '713113247-0', discount: 40,
},
{
  id: 738, name: 'Optimized logistical groupware', promoCode: '719999454-0', discount: 66,
},
{
  id: 739, name: 'Managed explicit interface', promoCode: '078011069-2', discount: 62,
},
{
  id: 740, name: 'Organic grid-enabled archive', promoCode: '761925495-1', discount: 45,
},
{
  id: 741, name: 'Focused solution-oriented standardization', promoCode: '440033572-0', discount: 35,
},
{
  id: 742, name: 'Intuitive clear-thinking product', promoCode: '154584716-9', discount: 81,
},
{
  id: 743, name: 'Multi-lateral disintermediate analyzer', promoCode: '405353993-5', discount: 30,
},
{
  id: 744, name: 'Switchable bandwidth-monitored analyzer', promoCode: '251064938-8', discount: 67,
},
{
  id: 745, name: 'Extended encompassing service-desk', promoCode: '675444865-2', discount: 32,
},
{
  id: 746, name: 'Quality-focused multi-state database', promoCode: '804779393-4', discount: 98,
},
{
  id: 747, name: 'Face to face multi-state model', promoCode: '407617395-3', discount: 6,
},
{
  id: 748, name: 'Distributed high-level moratorium', promoCode: '202363995-6', discount: 22,
},
{
  id: 749, name: 'Profit-focused heuristic moratorium', promoCode: '051686325-8', discount: 41,
},
{
  id: 750, name: 'Ergonomic heuristic firmware', promoCode: '489440607-1', discount: 48,
},
{
  id: 751, name: 'Robust composite project', promoCode: '518466116-6', discount: 60,
},
{
  id: 752, name: 'Triple-buffered intermediate projection', promoCode: '469745774-9', discount: 7,
},
{
  id: 753, name: 'Intuitive zero defect strategy', promoCode: '832522248-4', discount: 33,
},
{
  id: 754, name: 'Versatile full-range toolset', promoCode: '974189096-6', discount: 86,
},
{
  id: 755, name: 'Compatible executive knowledge base', promoCode: '182721613-1', discount: 74,
},
{
  id: 756, name: 'Expanded national strategy', promoCode: '536521504-4', discount: 50,
},
{
  id: 757, name: 'Phased scalable circuit', promoCode: '517292267-9', discount: 4,
},
{
  id: 758, name: 'Synchronised asynchronous time-frame', promoCode: '257343267-X', discount: 74,
},
{
  id: 759, name: 'Optional actuating implementation', promoCode: '834917650-4', discount: 73,
},
{
  id: 760, name: 'Focused needs-based paradigm', promoCode: '397218472-7', discount: 59,
},
{
  id: 761, name: 'Organic cohesive forecast', promoCode: '013902462-X', discount: 55,
},
{
  id: 762, name: 'Intuitive high-level database', promoCode: '169023130-0', discount: 73,
},
{
  id: 763, name: 'Persevering background data-warehouse', promoCode: '751245074-5', discount: 42,
},
{
  id: 764, name: 'Face to face clear-thinking adapter', promoCode: '470572878-5', discount: 48,
},
{
  id: 765, name: 'Operative clear-thinking task-force', promoCode: '323401405-1', discount: 76,
},
{
  id: 766, name: 'Configurable upward-trending local area network', promoCode: '400379740-X', discount: 84,
},
{
  id: 767, name: 'Decentralized zero defect conglomeration', promoCode: '260987449-9', discount: 19,
},
{
  id: 768, name: 'Team-oriented upward-trending groupware', promoCode: '814000372-7', discount: 83,
},
{
  id: 769, name: 'Multi-layered intangible open architecture', promoCode: '389904463-0', discount: 96,
},
{
  id: 770, name: 'Programmable clear-thinking collaboration', promoCode: '003110002-3', discount: 72,
},
{
  id: 771, name: 'Secured coherent portal', promoCode: '884560346-6', discount: 90,
},
{
  id: 772, name: 'Centralized hybrid core', promoCode: '797615262-9', discount: 80,
},
{
  id: 773, name: 'Reduced reciprocal data-warehouse', promoCode: '911921435-9', discount: 61,
},
{
  id: 774, name: 'Switchable content-based array', promoCode: '997695235-X', discount: 47,
},
{
  id: 775, name: 'Automated empowering capability', promoCode: '304674755-1', discount: 7,
},
{
  id: 776, name: 'Synchronised stable extranet', promoCode: '182850318-5', discount: 6,
},
{
  id: 777, name: 'Multi-lateral client-driven functionalities', promoCode: '569064496-X', discount: 54,
},
{
  id: 778, name: 'Open-source directional focus group', promoCode: '844061695-3', discount: 59,
},
{
  id: 779, name: 'Horizontal logistical synergy', promoCode: '886412068-8', discount: 69,
},
{
  id: 780, name: 'Down-sized exuding collaboration', promoCode: '808533840-8', discount: 12,
},
{
  id: 781, name: 'Multi-channelled logistical leverage', promoCode: '180731617-3', discount: 73,
},
{
  id: 782, name: 'Distributed motivating success', promoCode: '796247771-7', discount: 26,
},
{
  id: 783, name: 'Open-source heuristic moderator', promoCode: '033043612-0', discount: 15,
},
{
  id: 784, name: 'Switchable global knowledge base', promoCode: '381524669-5', discount: 39,
},
{
  id: 785, name: 'Up-sized system-worthy system engine', promoCode: '266129995-5', discount: 32,
},
{
  id: 786, name: 'Vision-oriented upward-trending intranet', promoCode: '819215283-9', discount: 87,
},
{
  id: 787, name: 'Focused background migration', promoCode: '592462209-6', discount: 61,
},
{
  id: 788, name: 'Enterprise-wide user-facing structure', promoCode: '648692118-8', discount: 93,
},
{
  id: 789, name: 'Integrated asynchronous local area network', promoCode: '885878618-1', discount: 37,
},
{
  id: 790, name: 'Proactive system-worthy Graphic Interface', promoCode: '395291053-8', discount: 48,
},
{
  id: 791, name: 'Versatile user-facing focus group', promoCode: '032630961-6', discount: 6,
},
{
  id: 792, name: 'Visionary bottom-line conglomeration', promoCode: '108773527-0', discount: 43,
},
{
  id: 793, name: 'Profound encompassing workforce', promoCode: '969247108-X', discount: 41,
},
{
  id: 794, name: 'Cloned maximized approach', promoCode: '929309358-8', discount: 53,
},
{
  id: 795, name: 'Operative context-sensitive policy', promoCode: '668695087-4', discount: 55,
},
{
  id: 796, name: 'Seamless interactive capacity', promoCode: '530079439-2', discount: 37,
},
{
  id: 797, name: 'Self-enabling explicit standardization', promoCode: '389932389-0', discount: 59,
},
{
  id: 798, name: 'Sharable contextually-based strategy', promoCode: '696527929-X', discount: 71,
},
{
  id: 799, name: 'Team-oriented tangible infrastructure', promoCode: '524492908-9', discount: 73,
},
{
  id: 800, name: 'Persistent contextually-based system engine', promoCode: '069410461-2', discount: 56,
},
{
  id: 801, name: 'Switchable needs-based support', promoCode: '547514849-X', discount: 49,
},
{
  id: 802, name: 'Horizontal responsive benchmark', promoCode: '610139215-5', discount: 81,
},
{
  id: 803, name: 'Compatible 4th generation initiative', promoCode: '939524028-8', discount: 38,
},
{
  id: 804, name: 'Configurable attitude-oriented budgetary management', promoCode: '323170158-9', discount: 77,
},
{
  id: 805, name: 'Object-based bifurcated protocol', promoCode: '561483562-8', discount: 96,
},
{
  id: 806, name: 'Fully-configurable background adapter', promoCode: '857142121-8', discount: 62,
},
{
  id: 807, name: 'Fully-configurable empowering parallelism', promoCode: '361441040-4', discount: 59,
},
{
  id: 808, name: 'Configurable client-server groupware', promoCode: '237350013-2', discount: 72,
},
{
  id: 809, name: 'Vision-oriented multimedia middleware', promoCode: '229391164-0', discount: 58,
},
{
  id: 810, name: 'Quality-focused modular throughput', promoCode: '558760004-1', discount: 40,
},
{
  id: 811, name: 'Cloned web-enabled challenge', promoCode: '576612372-8', discount: 24,
},
{
  id: 812, name: 'Enterprise-wide upward-trending emulation', promoCode: '546021621-4', discount: 19,
},
{
  id: 813, name: 'Optimized next generation help-desk', promoCode: '379621069-4', discount: 79,
},
{
  id: 814, name: 'Virtual solution-oriented workforce', promoCode: '423303422-X', discount: 42,
},
{
  id: 815, name: 'Ergonomic static capability', promoCode: '525059028-4', discount: 13,
},
{
  id: 816, name: 'Assimilated client-driven challenge', promoCode: '343341606-0', discount: 52,
},
{
  id: 817, name: 'Exclusive system-worthy functionalities', promoCode: '765620932-8', discount: 44,
},
{
  id: 818, name: 'Implemented local workforce', promoCode: '009994618-1', discount: 86,
},
{
  id: 819, name: 'Reactive global superstructure', promoCode: '802816570-2', discount: 38,
},
{
  id: 820, name: 'Open-architected systemic software', promoCode: '741353524-6', discount: 7,
},
{
  id: 821, name: 'Front-line logistical adapter', promoCode: '390620878-8', discount: 1,
},
{
  id: 822, name: 'Front-line asymmetric customer loyalty', promoCode: '092026924-9', discount: 84,
},
{
  id: 823, name: 'Compatible attitude-oriented instruction set', promoCode: '656387965-9', discount: 40,
},
{
  id: 824, name: 'Synergistic needs-based function', promoCode: '249479738-1', discount: 61,
},
{
  id: 825, name: 'Mandatory optimizing pricing structure', promoCode: '442013464-X', discount: 3,
},
{
  id: 826, name: 'Configurable secondary budgetary management', promoCode: '817463318-9', discount: 79,
},
{
  id: 827, name: 'Virtual motivating ability', promoCode: '476667549-5', discount: 21,
},
{
  id: 828, name: 'Profit-focused object-oriented implementation', promoCode: '129277901-2', discount: 82,
},
{
  id: 829, name: 'Operative bottom-line methodology', promoCode: '279919045-6', discount: 61,
},
{
  id: 830, name: 'Polarised solution-oriented circuit', promoCode: '021983597-7', discount: 70,
},
{
  id: 831, name: 'Open-source local circuit', promoCode: '574160334-3', discount: 100,
},
{
  id: 832, name: 'Programmable analyzing focus group', promoCode: '951678959-5', discount: 58,
},
{
  id: 833, name: 'Centralized bottom-line customer loyalty', promoCode: '243599602-0', discount: 14,
},
{
  id: 834, name: 'Devolved web-enabled policy', promoCode: '491287892-8', discount: 39,
},
{
  id: 835, name: 'Down-sized real-time service-desk', promoCode: '383936374-8', discount: 80,
},
{
  id: 836, name: 'Progressive attitude-oriented customer loyalty', promoCode: '485583122-0', discount: 37,
},
{
  id: 837, name: 'Reactive real-time hierarchy', promoCode: '393282482-2', discount: 49,
},
{
  id: 838, name: 'User-centric asymmetric open system', promoCode: '512158068-1', discount: 3,
},
{
  id: 839, name: 'Ergonomic needs-based attitude', promoCode: '281695409-9', discount: 51,
},
{
  id: 840, name: 'Devolved stable definition', promoCode: '474696850-0', discount: 47,
},
{
  id: 841, name: 'Distributed exuding migration', promoCode: '917024729-3', discount: 91,
},
{
  id: 842, name: 'Ergonomic incremental product', promoCode: '634658193-7', discount: 58,
},
{
  id: 843, name: 'Optional homogeneous capacity', promoCode: '400979657-X', discount: 57,
},
{
  id: 844, name: 'Ameliorated incremental groupware', promoCode: '648229869-9', discount: 85,
},
{
  id: 845, name: 'Realigned neutral circuit', promoCode: '537813772-1', discount: 36,
},
{
  id: 846, name: 'Persevering full-range budgetary management', promoCode: '988850547-5', discount: 71,
},
{
  id: 847, name: 'Cross-group real-time encryption', promoCode: '562834210-6', discount: 6,
},
{
  id: 848, name: 'Multi-lateral encompassing adapter', promoCode: '174774440-9', discount: 37,
},
{
  id: 849, name: 'Progressive empowering superstructure', promoCode: '181502550-6', discount: 43,
},
{
  id: 850, name: 'Operative directional emulation', promoCode: '334531204-2', discount: 88,
},
{
  id: 851, name: 'Advanced holistic productivity', promoCode: '451074875-2', discount: 54,
},
{
  id: 852, name: 'Vision-oriented exuding policy', promoCode: '070586732-3', discount: 77,
},
{
  id: 853, name: 'Front-line systematic complexity', promoCode: '363334185-4', discount: 4,
},
{
  id: 854, name: 'Vision-oriented solution-oriented customer loyalty', promoCode: '026844682-2', discount: 83,
},
{
  id: 855, name: 'Total zero defect functionalities', promoCode: '726055625-0', discount: 17,
},
{
  id: 856, name: 'Cloned optimal methodology', promoCode: '458898299-0', discount: 37,
},
{
  id: 857, name: 'Enterprise-wide clear-thinking hierarchy', promoCode: '655170536-7', discount: 50,
},
{
  id: 858, name: 'Multi-layered eco-centric extranet', promoCode: '245865264-6', discount: 67,
},
{
  id: 859, name: 'Reactive explicit service-desk', promoCode: '130104088-6', discount: 88,
},
{
  id: 860, name: 'Assimilated bottom-line knowledge user', promoCode: '556615021-7', discount: 96,
},
{
  id: 861, name: 'Managed didactic ability', promoCode: '747259106-8', discount: 25,
},
{
  id: 862, name: 'Centralized static moratorium', promoCode: '055086412-1', discount: 93,
},
{
  id: 863, name: 'Ergonomic zero defect help-desk', promoCode: '360111492-5', discount: 47,
},
{
  id: 864, name: 'Networked scalable complexity', promoCode: '867336291-1', discount: 70,
},
{
  id: 865, name: 'Synergistic even-keeled adapter', promoCode: '098070186-4', discount: 12,
},
{
  id: 866, name: 'Devolved bifurcated database', promoCode: '076401314-9', discount: 86,
},
{
  id: 867, name: 'Automated heuristic alliance', promoCode: '352459513-8', discount: 47,
},
{
  id: 868, name: 'Profit-focused clear-thinking concept', promoCode: '932564256-5', discount: 66,
},
{
  id: 869, name: 'Synchronised incremental strategy', promoCode: '107135366-7', discount: 93,
},
{
  id: 870, name: 'Optional foreground knowledge base', promoCode: '089669713-4', discount: 67,
},
{
  id: 871, name: 'Organic reciprocal project', promoCode: '125314085-5', discount: 68,
},
{
  id: 872, name: 'Total analyzing superstructure', promoCode: '088667293-7', discount: 13,
},
{
  id: 873, name: 'Future-proofed 24/7 budgetary management', promoCode: '949502404-8', discount: 66,
},
{
  id: 874, name: 'Universal discrete synergy', promoCode: '766301135-X', discount: 59,
},
{
  id: 875, name: 'Organic stable task-force', promoCode: '219297397-7', discount: 93,
},
{
  id: 876, name: 'Profit-focused hybrid orchestration', promoCode: '106282092-4', discount: 57,
},
{
  id: 877, name: 'Digitized fault-tolerant hierarchy', promoCode: '540583442-4', discount: 29,
},
{
  id: 878, name: 'Multi-layered real-time methodology', promoCode: '898258941-4', discount: 39,
},
{
  id: 879, name: 'Upgradable intangible process improvement', promoCode: '552073734-7', discount: 75,
},
{
  id: 880, name: 'Automated multimedia moderator', promoCode: '715899685-9', discount: 87,
},
{
  id: 881, name: 'Centralized didactic hardware', promoCode: '350881478-5', discount: 40,
},
{
  id: 882, name: 'Automated solution-oriented middleware', promoCode: '972176403-5', discount: 95,
},
{
  id: 883, name: 'Front-line bandwidth-monitored website', promoCode: '462628319-5', discount: 26,
},
{
  id: 884, name: 'Monitored optimizing emulation', promoCode: '755719880-8', discount: 80,
},
{
  id: 885, name: 'User-centric composite interface', promoCode: '557496950-5', discount: 6,
},
{
  id: 886, name: 'Implemented non-volatile productivity', promoCode: '732179475-X', discount: 13,
},
{
  id: 887, name: 'Polarised background help-desk', promoCode: '938114817-1', discount: 8,
},
{
  id: 888, name: 'Sharable client-server workforce', promoCode: '350302279-1', discount: 90,
},
{
  id: 889, name: 'Multi-channelled static project', promoCode: '739538859-3', discount: 47,
},
{
  id: 890, name: 'Programmable disintermediate budgetary management', promoCode: '109462212-5', discount: 19,
},
{
  id: 891, name: 'Re-contextualized system-worthy toolset', promoCode: '721612133-3', discount: 18,
},
{
  id: 892, name: 'Programmable bottom-line open system', promoCode: '529653509-X', discount: 28,
},
{
  id: 893, name: 'Centralized contextually-based function', promoCode: '699532086-7', discount: 77,
},
{
  id: 894, name: 'Polarised didactic database', promoCode: '239484092-7', discount: 88,
},
{
  id: 895, name: 'Fundamental bifurcated data-warehouse', promoCode: '953594804-0', discount: 58,
},
{
  id: 896, name: 'Streamlined leading edge strategy', promoCode: '280832083-3', discount: 16,
},
{
  id: 897, name: 'Programmable analyzing alliance', promoCode: '796353429-3', discount: 45,
},
{
  id: 898, name: 'Enterprise-wide 24 hour focus group', promoCode: '554483360-5', discount: 44,
},
{
  id: 899, name: 'Polarised human-resource project', promoCode: '297009685-4', discount: 51,
},
{
  id: 900, name: 'Persevering optimizing superstructure', promoCode: '575699849-7', discount: 46,
},
{
  id: 901, name: 'Right-sized bandwidth-monitored projection', promoCode: '350503901-2', discount: 33,
},
{
  id: 902, name: 'Cross-platform well-modulated initiative', promoCode: '857399885-7', discount: 90,
},
{
  id: 903, name: 'Balanced reciprocal middleware', promoCode: '522322897-9', discount: 87,
},
{
  id: 904, name: 'Triple-buffered 6th generation forecast', promoCode: '382646804-X', discount: 20,
},
{
  id: 905, name: 'Intuitive foreground conglomeration', promoCode: '869441330-2', discount: 72,
},
{
  id: 906, name: 'Team-oriented mission-critical concept', promoCode: '665112358-0', discount: 11,
},
{
  id: 907, name: 'Front-line zero administration algorithm', promoCode: '388310717-4', discount: 57,
},
{
  id: 908, name: 'Adaptive encompassing superstructure', promoCode: '101435683-0', discount: 22,
},
{
  id: 909, name: 'Integrated bifurcated extranet', promoCode: '819346443-5', discount: 90,
},
{
  id: 910, name: 'Compatible attitude-oriented projection', promoCode: '854154679-9', discount: 68,
},
{
  id: 911, name: 'Right-sized intangible flexibility', promoCode: '124246710-6', discount: 27,
},
{
  id: 912, name: 'Extended hybrid hardware', promoCode: '917333565-7', discount: 77,
},
{
  id: 913, name: 'Monitored system-worthy definition', promoCode: '815558239-6', discount: 67,
},
{
  id: 914, name: 'Seamless directional matrix', promoCode: '392368527-0', discount: 32,
},
{
  id: 915, name: 'Programmable multi-state hierarchy', promoCode: '864571638-0', discount: 87,
},
{
  id: 916, name: 'Devolved hybrid product', promoCode: '406247617-7', discount: 46,
},
{
  id: 917, name: 'Function-based coherent attitude', promoCode: '514895209-1', discount: 20,
},
{
  id: 918, name: 'Seamless didactic local area network', promoCode: '301118880-7', discount: 11,
},
{
  id: 919, name: 'Polarised needs-based collaboration', promoCode: '330589934-4', discount: 6,
},
{
  id: 920, name: 'Integrated non-volatile productivity', promoCode: '112591882-9', discount: 31,
},
{
  id: 921, name: 'Advanced bi-directional architecture', promoCode: '207176986-4', discount: 81,
},
{
  id: 922, name: 'Versatile motivating software', promoCode: '779655743-4', discount: 54,
},
{
  id: 923, name: 'Enterprise-wide local info-mediaries', promoCode: '776814629-8', discount: 86,
},
{
  id: 924, name: 'Versatile homogeneous matrices', promoCode: '301436276-X', discount: 80,
},
{
  id: 925, name: 'Customizable optimal throughput', promoCode: '514553564-3', discount: 32,
},
{
  id: 926, name: 'Virtual demand-driven conglomeration', promoCode: '513607260-1', discount: 40,
},
{
  id: 927, name: 'Visionary regional forecast', promoCode: '009960373-X', discount: 36,
},
{
  id: 928, name: 'Multi-lateral solution-oriented open architecture', promoCode: '462712075-3', discount: 40,
},
{
  id: 929, name: 'Cross-group contextually-based extranet', promoCode: '278664796-7', discount: 26,
},
{
  id: 930, name: 'Balanced non-volatile concept', promoCode: '855626068-3', discount: 17,
},
{
  id: 931, name: 'Distributed neutral challenge', promoCode: '604217644-7', discount: 54,
},
{
  id: 932, name: 'User-friendly stable Graphical User Interface', promoCode: '195538199-2', discount: 93,
},
{
  id: 933, name: 'Pre-emptive bandwidth-monitored contingency', promoCode: '514964916-3', discount: 79,
},
{
  id: 934, name: 'Multi-channelled dedicated toolset', promoCode: '385305982-1', discount: 5,
},
{
  id: 935, name: 'Phased content-based paradigm', promoCode: '280083820-5', discount: 78,
},
{
  id: 936, name: 'Centralized local concept', promoCode: '906267527-1', discount: 95,
},
{
  id: 937, name: 'Sharable bi-directional Graphical User Interface', promoCode: '054978426-8', discount: 12,
},
{
  id: 938, name: 'Organic scalable throughput', promoCode: '995001125-6', discount: 44,
},
{
  id: 939, name: 'Phased needs-based concept', promoCode: '282100776-0', discount: 28,
},
{
  id: 940, name: 'Switchable eco-centric model', promoCode: '224244246-5', discount: 72,
},
{
  id: 941, name: 'Fundamental executive capacity', promoCode: '306027846-6', discount: 8,
},
{
  id: 942, name: 'Profound tertiary implementation', promoCode: '639872499-2', discount: 79,
},
{
  id: 943, name: 'Front-line human-resource hub', promoCode: '232081967-3', discount: 1,
},
{
  id: 944, name: 'Object-based encompassing time-frame', promoCode: '423167831-6', discount: 22,
},
{
  id: 945, name: 'User-friendly actuating protocol', promoCode: '481667090-4', discount: 83,
},
{
  id: 946, name: 'Reactive fault-tolerant access', promoCode: '340340301-7', discount: 87,
},
{
  id: 947, name: 'Fundamental object-oriented data-warehouse', promoCode: '306092934-3', discount: 29,
},
{
  id: 948, name: 'Versatile tangible system engine', promoCode: '875947173-5', discount: 71,
},
{
  id: 949, name: 'Realigned upward-trending concept', promoCode: '807992685-9', discount: 57,
},
{
  id: 950, name: 'Versatile uniform Graphical User Interface', promoCode: '794761707-4', discount: 91,
},
{
  id: 951, name: 'Down-sized 24/7 hardware', promoCode: '501392602-5', discount: 94,
},
{
  id: 952, name: 'Organic methodical collaboration', promoCode: '275361579-9', discount: 64,
},
{
  id: 953, name: 'Cross-group bifurcated circuit', promoCode: '090642562-X', discount: 82,
},
{
  id: 954, name: 'Down-sized even-keeled implementation', promoCode: '668543857-6', discount: 83,
},
{
  id: 955, name: 'Profit-focused reciprocal focus group', promoCode: '399927410-7', discount: 40,
},
{
  id: 956, name: 'Switchable uniform collaboration', promoCode: '863818006-3', discount: 66,
},
{
  id: 957, name: 'Decentralized national implementation', promoCode: '862755333-5', discount: 27,
},
{
  id: 958, name: 'Balanced content-based monitoring', promoCode: '309878022-3', discount: 4,
},
{
  id: 959, name: 'Synchronised context-sensitive initiative', promoCode: '192439352-2', discount: 70,
},
{
  id: 960, name: 'Robust 4th generation implementation', promoCode: '275906133-7', discount: 57,
},
{
  id: 961, name: 'Exclusive 6th generation interface', promoCode: '075989104-4', discount: 55,
},
{
  id: 962, name: 'Multi-lateral content-based database', promoCode: '908710993-8', discount: 84,
},
{
  id: 963, name: 'Fundamental empowering project', promoCode: '172752781-X', discount: 49,
},
{
  id: 964, name: 'Organic optimizing hierarchy', promoCode: '864901145-4', discount: 71,
},
{
  id: 965, name: 'Ergonomic analyzing website', promoCode: '728321295-7', discount: 59,
},
{
  id: 966, name: 'User-friendly solution-oriented instruction set', promoCode: '166294716-X', discount: 27,
},
{
  id: 967, name: 'Re-contextualized 24 hour focus group', promoCode: '527642346-6', discount: 64,
},
{
  id: 968, name: 'Customizable high-level intranet', promoCode: '501058152-3', discount: 16,
},
{
  id: 969, name: 'Customizable clear-thinking paradigm', promoCode: '502009369-6', discount: 87,
},
{
  id: 970, name: 'User-friendly responsive adapter', promoCode: '367560557-4', discount: 83,
},
{
  id: 971, name: 'Enterprise-wide reciprocal conglomeration', promoCode: '494967466-8', discount: 43,
},
{
  id: 972, name: 'Face to face fault-tolerant focus group', promoCode: '075643433-5', discount: 40,
},
{
  id: 973, name: 'Digitized radical matrices', promoCode: '525263623-0', discount: 82,
},
{
  id: 974, name: 'Universal stable challenge', promoCode: '376750623-8', discount: 59,
},
{
  id: 975, name: 'Robust zero tolerance info-mediaries', promoCode: '401776524-6', discount: 90,
},
{
  id: 976, name: 'Innovative systematic utilisation', promoCode: '222391758-5', discount: 64,
},
{
  id: 977, name: 'Decentralized dedicated product', promoCode: '042804357-7', discount: 27,
},
{
  id: 978, name: 'Synergized encompassing solution', promoCode: '187730628-2', discount: 61,
},
{
  id: 979, name: 'Re-contextualized directional process improvement', promoCode: '538673785-6', discount: 94,
},
{
  id: 980, name: 'Programmable fresh-thinking projection', promoCode: '389771183-4', discount: 57,
},
{
  id: 981, name: 'Streamlined heuristic capacity', promoCode: '164323891-4', discount: 92,
},
{
  id: 982, name: 'Optional transitional conglomeration', promoCode: '560294028-6', discount: 35,
},
{
  id: 983, name: 'Synergistic discrete conglomeration', promoCode: '836076771-8', discount: 36,
},
{
  id: 984, name: 'Customizable web-enabled application', promoCode: '930276560-1', discount: 25,
},
{
  id: 985, name: 'Organic zero administration ability', promoCode: '787696597-0', discount: 85,
},
{
  id: 986, name: 'Future-proofed maximized matrix', promoCode: '853509808-9', discount: 64,
},
{
  id: 987, name: 'Open-architected contextually-based hardware', promoCode: '887186079-9', discount: 9,
},
{
  id: 988, name: 'Profit-focused 5th generation infrastructure', promoCode: '023809137-6', discount: 93,
},
{
  id: 989, name: 'Balanced zero tolerance conglomeration', promoCode: '088835607-2', discount: 37,
},
{
  id: 990, name: 'Organized 6th generation hierarchy', promoCode: '008659993-3', discount: 90,
},
{
  id: 991, name: 'Diverse dedicated benchmark', promoCode: '857703106-3', discount: 54,
},
{
  id: 992, name: 'Extended foreground interface', promoCode: '345440728-1', discount: 29,
},
{
  id: 993, name: 'Distributed impactful customer loyalty', promoCode: '555065098-3', discount: 49,
},
{
  id: 994, name: 'Universal interactive core', promoCode: '813560355-X', discount: 6,
},
{
  id: 995, name: 'Multi-tiered uniform focus group', promoCode: '545422648-3', discount: 40,
},
{
  id: 996, name: 'User-centric web-enabled projection', promoCode: '216897493-4', discount: 49,
},
{
  id: 997, name: 'Ameliorated human-resource intranet', promoCode: '494921208-7', discount: 72,
},
{
  id: 998, name: 'Digitized composite portal', promoCode: '600022740-X', discount: 22,
},
{
  id: 999, name: 'Persevering mobile structure', promoCode: '479709403-6', discount: 79,
},
{
  id: 1000, name: 'Synergized composite firmware', promoCode: '778087381-1', discount: 100,
}];
