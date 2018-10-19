import React from 'react';
import { View } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import Icon from '../../../components/UI/Icon';
import Badge from '../../../components/SalonBadge/index';
import GroupBadge from '../../../components/SalonGroupBadge/index';
import multiProviderUri from '../../../assets/svg/multi-provider-icon.svg';

const styles = {
  multiProviderFix: {
    marginTop: 4,
  },
};

export const getBadges = (appointment, hiddenAddonsLength) => {
  const { badgeData, client: { name, lastName } } = appointment;
  const initials = `${name[0]}${lastName[0]}`;
  const users = appointment.isMultipleProviders ? (
    <View style={styles.multiProviderFix}>
      <SvgUri
        width="16"
        height="8"
        source={multiProviderUri}
        fill="#082E66"
      />
    </View>) : null;
  const star = badgeData.clientHasMembership ? <Icon color="#082E66" size={16} name="star" type="solid" /> : null;
  const birthdayCake = badgeData.clientBirthday ? <Icon color="#082E66" size={16} name="birthdayCake" type="regular" /> : null;
  const checkCircle = appointment.confirmationStatus ? <Icon color="#082E66" size={16} name="checkCircle" type="solid" /> : null;
  const repeat = badgeData.isRecurring ? <Icon color="#082E66" size={16} name="repeatAlt" type="solid" /> : null;
  const badgeNL = !badgeData.clientIsNew && badgeData.clientIsNewLocally ? <Badge text="NL" /> : null;
  const badgeN = badgeData.clientIsNew ? <Badge text="N" /> : null;
  const badgeO = badgeData.isOnlineBooking ? <Badge text="O" /> : null;
  const badgeW = badgeData.isWaiting ? <Badge text="W" /> : null;
  const badgeS = badgeData.isInService ? <Badge text="S" /> : null;
  const badgeF = badgeData.isFinished ? <Badge text="F" /> : null;
  const badgeR = badgeData.isReturning ? <Badge text="R" /> : null;
  const badgeAddons = hiddenAddonsLength > 0 ? <Badge text={`+${hiddenAddonsLength}`} /> : null;
  const badgeParty = badgeData.isParty ? <GroupBadge text={initials} /> : null;
  return [
    badgeAddons,
    badgeParty,
    users,
    star,
    birthdayCake,
    checkCircle,
    repeat,
    badgeNL,
    badgeN,
    badgeO,
    badgeW,
    badgeS,
    badgeF,
    badgeR,
  ];
};

export default getBadges;
