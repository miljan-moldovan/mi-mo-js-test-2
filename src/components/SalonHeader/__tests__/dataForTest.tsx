import * as React from 'react';
import { Text } from 'react-native';

export const propsForHeaderRight = {
  title: 'Title is work',
  headerRight: (<Text>Render header right</Text>),
};

export const propsForHeaderLeft = {
  title: 'Title is work',
  headerLeft: (<Text>Render left right</Text>),
};

export const propsForHeaderTitleAsStringWithoutSubtitle = {
  title: 'Render title as string',
};

export const propsForHeaderTitleAsComponentWithoutSubtitle = {
  title: (<Text>Render Title</Text>),
};

export const propsForHeaderTitleAsComponentWithSubtitleAsString = {
  title: (<Text>Render title as component</Text>),
  subTitle: 'Render subTitle as string',
};

export const propsForHeaderTitleAsComponentWithSubtitleAsComponent = {
  title: (<Text>Render title as component</Text>),
  subTitle: (<Text>Render subTitle as component</Text>),
};

export const propsForHeaderTitleAsStringWithSubtitleAsComponent = {
  title: 'Render title as component',
  subTitle: (<Text>Render subTitle as component</Text>),
};

export const propsForHeaderTitleAsStringWithSubtitleAsString = {
  title: 'Render title as component',
  subTitle: 'Render subTitle as string',
};
