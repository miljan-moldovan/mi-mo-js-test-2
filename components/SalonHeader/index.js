import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { isString } from 'lodash';
import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.defaultBlue,
  },
  container: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    color: Colors.white,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  headerLeft: {
  },
  headerRight: {
  },
  headerTitle: {},
});
const SalonHeader = (props) => {
  const {
    title,
    subTitle,
    headerLeft,
    headerRight,
  } = props;
  const headerTitle = isString(title) ? (
    <React.Fragment>
      <Text style={styles.titleText}>{title}</Text>
      {
        subTitle && (
          isString(subTitle) ? (
            <Text style={styles.subTitleText}>{subTitle}</Text>
          ) : subTitle
        )
      }
    </React.Fragment>
  ) : title;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          {headerLeft}
        </View>
        <View style={styles.headerTitle}>
          {headerTitle}
        </View>
        <View style={styles.headerRight}>
          {headerRight}
        </View>
      </View>
    </SafeAreaView>
  );
};
SalonHeader.propTypes = {
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
SalonHeader.defaultProps = {
  headerLeft: null,
  headerRight: null,
  subTitle: null,
};
export default SalonHeader;
