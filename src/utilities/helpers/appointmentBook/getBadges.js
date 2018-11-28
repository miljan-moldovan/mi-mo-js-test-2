import React from 'react';
import { View } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import Icon from '@/components/common/Icon';
import Badge from '../../../components/SalonBadge/index';
import GroupBadge from '../../../components/SalonGroupBadge/index';
import multiProviderUri from '../../../assets/svg/multi-provider-icon.svg';

const styles = {
  multiProviderFix: {
    marginTop: 4,
  },
  badge: {
    marginLeft: 2,
  }
};

export const getBadges = (appointment, hiddenAddonsLength, shortVersion = false) => {
  const { badgeData, client: { name, lastName } } = appointment;
  const initials = `${name[0]}${lastName[0]}`;
  const users = appointment.isMultipleProviders ? (
    <View style={[styles.multiProviderFix, styles.badge]}>
      <SvgUri
        width="16"
        height="8"
        source={multiProviderUri}
        fill="#082E66"
      />
    </View>) : null;
  const star = badgeData.clientHasMembership ? <Icon color="#082E66" size={16} name="star" type="solid" style={styles.badge}/> : null;
  const birthdayCake = badgeData.clientBirthday ? <Icon color="#082E66" size={16} name="birthdayCake" type="regular" style={styles.badge}/> : null;
  const checkCircle = appointment.confirmationStatus ? <Icon color="#082E66" size={16} name="checkCircle" type="solid" style={styles.badge}/> : null;
  const repeat = badgeData.isRecurring ? <Icon color="#082E66" size={16} name="repeatAlt" type="solid" style={styles.badge}/> : null;
  const badgeNL = !badgeData.clientIsNew && badgeData.clientIsNewLocally ? <Badge text="NL" /> : null;
  const badgeN = badgeData.clientIsNew ? <Badge text="N" /> : null;
  const badgeO = badgeData.isOnlineBooking ? <Badge text="O" /> : null;
  const badgeW = badgeData.isWaiting ? <Badge text="W" /> : null;
  const badgeS = badgeData.isInService ? <Badge text="S" /> : null;
  const badgeF = badgeData.isFinished ? <Badge text="F" /> : null;
  const badgeR = badgeData.isReturning ? <Badge text="R" /> : null;
  const badgeAddons = hiddenAddonsLength > 0 ? <Badge text={`+${hiddenAddonsLength}`} /> : null;
  const badgeParty = badgeData.isParty ? <GroupBadge text={shortVersion ? '' : initials} /> : null;
  const priority = [
    badgeNL,
    badgeN,
    badgeO,
    star,
    birthdayCake,
    repeat,
    badgeParty,
    badgeR,
    badgeW,
    badgeS,
    badgeF,
    badgeAddons,
    users,
    checkCircle,
  ];
  
  const badges = priority.filter(function (el) {
    return el != null;
  });
  return badges;
};

export default getBadges;
