import React from 'react';
import { ScrollView, View, Image, Text, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import SalonModal from './../SalonModal';

const styles = StyleSheet.create({
  modal: {
    padding: 10,
    margin: 0,
    left: 0,
    width: '100%',
    height: 439,
  },
  modalContent: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalList: {
    left: 0,
    borderRadius: 4,
    width: '100%',
    height: 439,
  },
  modalHeader: {
    height: 40,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalHeaderText: {
    color: '#333B3E',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  modalLine: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalLineText: {
    color: '#333B3E',
    fontSize: 13,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
    flex: 3,
  },
  modalLineImage: {
    width: 18,
    height: 18,
    marginRight: 30,
  },

});


export default class SalonSectionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      isVisible: props.isVisible,
    };
  }

  state:{
    selected:[],
    isVisible: false,
  }

  static renderModalHeader(section) {
    return (
      <View key={`${section.id}`} style={styles.modalHeader}>


        <Text style={styles.modalHeaderText}>
          {section.title.toUpperCase()}
        </Text>
      </View>);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isVisible: nextProps.isVisible,
    });
  }

  selectItem(item) {
    const selected = this.state.selected;

    for (let i = 0; i < this.state.selected.length; i += 1) {
      const selectedItem = this.state.selected[i];

      if (selectedItem.type === item.type) {
        const index = selected.indexOf(selectedItem);
        if (index !== -1) {
          selected.splice(index, 1);
        }
      }
    }

    if (selected.indexOf(item) === -1) {
      selected.push(item);
    }

    this.setState({ selected, isVisible: false });

    this.props.onPressItem(item);
  }

  renderModalLine(item) {
    let isSelected = false;
    for (let i = 0; i < this.state.selected.length; i += 1) {
      const selected = this.state.selected[i];

      if (selected.id === item.id && selected.type === item.type) {
        isSelected = true;
        break;
      }
    }


    return (
      <TouchableOpacity
        key={`${item.type}_${item.id}`}
        style={styles.modalLine}
        onPress={() => this.selectItem(item)}
      >
        <Text style={styles.modalLineText}>{item.name.toUpperCase()}</Text>

        {isSelected &&
          <Image
            style={styles.modalLineImage}
            source={require('../../assets/images/clients/icon_check_2.png')}
          />
        }
      </TouchableOpacity>);
  }

  hideModal() {
    this.setState({ isVisible: false });
  }

  render() {
    return (


      <SalonModal
        showTail
        tailStyle={styles.tailStyle}
        tailPosition={{ justifyContent: 'flex-end' }}
        style={styles.modal}
        contentStyle={styles.modalContent}
        isVisible={this.state.isVisible}
        closeModal={this.hideModal}
      >
        {[<SectionList
          key="sectionList1"
          scrollEnabled
          style={styles.modalList}
          renderItem={({ item }) => this.renderModalLine(item)}
          renderSectionHeader={({ section }) => SalonSectionsModal.renderModalHeader(section)}
          sections={this.props.sections}
        />]}


      </SalonModal>
    );
  }
}
