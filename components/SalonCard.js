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
    [styles.container, { backgroundColor: props.backgroundColor }]}
  >
    <View style={styles.header}>
      {props.headerChildren}
    </View>
    <View style={styles.body}>
      {props.bodyChildren}
    </View>
    {props.footerChildren.length > 0 && (
      <View style={styles.footer}>
        {props.footerChildren}
      </View>
    )}
  </View>
);

salonCard.propTypes = {
  headerChildren: PropTypes.arrayOf(PropTypes.element).isRequired,
  bodyChildren: PropTypes.arrayOf(PropTypes.element).isRequired,
  footerChildren: PropTypes.arrayOf(PropTypes.element),
  backgroundColor: PropTypes.string,
};

salonCard.defaultProps = {
  backgroundColor: 'transparent',
  footerChildren: [],
};

export default salonCard;
