import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 5,
    // minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 15,
    justifyContent: 'flex-start',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    borderBottomColor: '#F1F1F1',
    borderBottomWidth: 1,
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
});

const salonCard = props => (
  <View
    key={Math.random().toString()}
    style={
    [styles.container, { backgroundColor: props.backgroundColor }, props.containerStyles]}
  >
    {props.headerChildren && props.headerChildren.length > 0 && (
      <View style={styles.header}>
        {props.headerChildren}
      </View>
    )}
    <View style={[styles.body, props.bodyStyles]}>
      {props.bodyChildren}
    </View>
    {props.footerChildren && props.footerChildren.length > 0 && (
      <View style={styles.footer}>
        {props.footerChildren}
      </View>
    )}
  </View>
);

salonCard.propTypes = {
  headerChildren: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.element), null]),
  bodyChildren: PropTypes.arrayOf(PropTypes.element).isRequired,
  footerChildren: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.element), null]),
  backgroundColor: PropTypes.string,
  containerStyles: PropTypes.shape,
  bodyStyles: PropTypes.shape,
};

salonCard.defaultProps = {
  backgroundColor: 'transparent',
  headerChildren: null,
  footerChildren: null,
  containerStyles: {},
  bodyStyles: {},
};

export default salonCard;
