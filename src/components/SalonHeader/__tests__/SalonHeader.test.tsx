import * as React from 'react';
import { shallow } from 'enzyme';
import SalonHeader from '../index';
import { Text } from 'react-native';
import {
  propsForHeaderRight,
  propsForHeaderLeft,
  propsForHeaderTitleAsStringWithoutSubtitle,
  propsForHeaderTitleAsComponentWithoutSubtitle,
  propsForHeaderTitleAsComponentWithSubtitleAsString,
  propsForHeaderTitleAsComponentWithSubtitleAsComponent,
  propsForHeaderTitleAsStringWithSubtitleAsComponent,
  propsForHeaderTitleAsStringWithSubtitleAsString,
} from './dataForTest';

describe('<SalonHeader />', () => {

  const mountComponent = props =>
    shallow(
      <SalonHeader {...props} />,
    );

  describe('Render right', () => {
    it('Render headerLeft', () => {
      const component = mountComponent(propsForHeaderRight)
        .containsMatchingElement(propsForHeaderRight.headerRight);
      expect(component).toBe(true);
    });

    it('Render headerRight', () => {
      const component = mountComponent(propsForHeaderLeft)
        .containsMatchingElement(propsForHeaderLeft.headerLeft);
      expect(component).toBe(true);
    });

    it('Render headerTitle as string, without subtitle', () => {
      const component = mountComponent(propsForHeaderTitleAsStringWithoutSubtitle)
        .containsMatchingElement(<Text>{propsForHeaderTitleAsStringWithoutSubtitle.title}</Text>);
      expect(component).toBe(true);
    });

    it('Render headerTitle as string with subtitle as string', () => {
      const component = mountComponent(propsForHeaderTitleAsStringWithSubtitleAsString);
      expect(component
        .containsMatchingElement(<Text>{propsForHeaderTitleAsStringWithSubtitleAsString.title}</Text>))
        .toBe(true);
      expect(component
        .containsMatchingElement(<Text>{propsForHeaderTitleAsStringWithSubtitleAsString.subTitle}</Text>))
        .toBe(true);
    });

    it('Render headerTitle as component without subtitle', () => {
      const component = mountComponent(propsForHeaderTitleAsComponentWithoutSubtitle)
        .containsMatchingElement(propsForHeaderTitleAsComponentWithoutSubtitle.title);
      expect(component).toBe(true);
    });

    it('Render headerTitle as component with subtitle as string', () => {
      const component = mountComponent(propsForHeaderTitleAsComponentWithSubtitleAsString);
      expect(component
        .containsMatchingElement(propsForHeaderTitleAsComponentWithSubtitleAsString.title))
        .toBe(true);
      expect(component
        .containsMatchingElement(<Text>{propsForHeaderTitleAsComponentWithSubtitleAsString.subTitle}</Text>))
        .toBe(false);
    });

    it('Render headerTitle as string with subtitle as component', () => {
      const component = mountComponent(propsForHeaderTitleAsStringWithSubtitleAsComponent);
      expect(component
        .containsMatchingElement(<Text>{propsForHeaderTitleAsStringWithSubtitleAsComponent.title}</Text>))
        .toBe(true);
      expect(component
        .containsMatchingElement(propsForHeaderTitleAsStringWithSubtitleAsComponent.subTitle))
        .toBe(true);
    });

    it('Render headerTitle as component with subtitle as component', () => {
      const component = mountComponent(propsForHeaderTitleAsComponentWithSubtitleAsComponent);
      expect(component
        .containsMatchingElement(propsForHeaderTitleAsComponentWithSubtitleAsComponent.title))
        .toBe(true);
      expect(component
        .containsMatchingElement(propsForHeaderTitleAsComponentWithSubtitleAsComponent.subTitle))
        .toBe(false);
    });

  });
});
