import * as React from 'react';
import { View, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: StyleSheet.hairlineWidth / 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: StyleSheet.hairlineWidth / 2,
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 7,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  header: {
    paddingVertical: 8.5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    borderBottomColor: '#F1F1F1',
    borderBottomWidth: 1,
    maxHeight: 45,
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  headerChildren: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  bodyChildren: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  footerChildren: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  backgroundColor: PropTypes.string,
  containerStyles: ViewPropTypes.style,
  styleHeader: ViewPropTypes.style,
  bodyStyles: ViewPropTypes.style,
};

salonCard.defaultProps = {
  backgroundColor: 'transparent',
  headerChildren: null,
  footerChildren: null,
  containerStyles: {},
  styleHeader: {},
  bodyStyles: {},
};

export default salonCard;
