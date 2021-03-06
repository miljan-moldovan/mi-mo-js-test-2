import * as React from 'react';
import { View, Text } from 'react-native';
import { isString } from 'lodash';
import PropTypes from 'prop-types';
import styles from './style';

const SalonHeader = (props) => {
  const {
    title,
    subTitle,
    headerLeft,
    headerRight,
  } = props;

  const headerTitle = createHeaderTitle(title, subTitle);

  return (
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
  );
};

const createHeaderTitle = (title, subTitle) => {
  if (!isString(title)) {
    return title;
  }

  return (
    <React.Fragment>
      <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
      {
        subTitle && createSubstring(subTitle)
      }
    </React.Fragment>
  );
};

const createSubstring = (subTitle) => {
  if (!isString(subTitle)) {
    return subTitle;
  }
  return (
    <Text style={styles.subTitleText} numberOfLines={1}>{subTitle}</Text>
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
