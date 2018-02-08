import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  content: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottom: {
    borderTopWidth: 0.5,
    borderTopColor: '#95989A',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  subtitle: {
    fontSize: 17,
    color: '#4D90FE',
    textAlign: 'center',
    marginBottom: 15,
  },
  iconClose: {
    color: '#4D90FE',
    fontSize: 30,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    right: 10,
  },
  tailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 0,
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
});

const SalonModal = props => (
  <View style={{ }}>
    <Modal
      isVisible={props.isVisible}
      style={[props.style, styles.container]}
    >
      { props.showTail &&
        <View style={[styles.tailContainer, props.tailPosition]}>
          <View style={[styles.tail, props.tailStyle]} />
        </View>
      }

      <View style={[styles.content, props.contentStyle]}>
        { props.children }
      </View>
    </Modal>
  </View>
);

SalonModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  tailStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  tailPosition: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),

};

SalonModal.defaultProps = {
  style: { flex: 1 },
  contentStyle: { },
  tailStyle: { },
  tailPosition: { justifyContent: 'flex-start' },
};

export default SalonModal;
