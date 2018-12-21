import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Text, ActivityIndicator } from 'react-native';
import SalonAvatar from '../index';

describe('<SalonAvatar />', () => {
  const mountComponent = props =>
    shallow(
      <SalonAvatar {...props}/>,
    );

  const propsForRenderActivityIndicator = {
    width: 100,
    image: null,
  };

  const propsForRenderDefaultComponentWithoutImage = {
    image: null,
    width: 100,
    defaultComponent: <Text>It is defaultComponent</Text>,
  };

  const propsForRenderDefaultComponentWithImage = {
    image: {},
    width: 100,
    defaultComponent: <Text>It is defaultComponent</Text>,
  };

  const propsForRenderDefaultComponentWithImageUrl = {
    image: {
      uri: 'http://blog.cibuu.com/wp-content/uploads/Test-1.png',
    },
    width: 100,
    defaultComponent: <Text>It is defaultComponent</Text>,
  };

  const propsForRenderImage = {
    width: 100,
    image: {
      uri: 'http://blog.cibuu.com/wp-content/uploads/Test-1.png',
    },
  };

  const propsForRenderBadgeComponent = {
    image: null,
    width: 100,
    hasBadge: true,
    badgeComponent: <Text>It is hasBadge</Text>,
  };

  describe('Render right', () => {

    it('Render activity indicator correctly', () => {
      const wrappedComponent = mountComponent(propsForRenderActivityIndicator);

      wrappedComponent.setState({ isLoading: true });
      expect(wrappedComponent.find('View')).toHaveLength(2);
      expect(wrappedComponent.containsMatchingElement(<ActivityIndicator />)).toBe(true);

      wrappedComponent.setState({ isLoading: false });
      expect(wrappedComponent.containsMatchingElement(<ActivityIndicator />)).toBe(false);
      expect(wrappedComponent.find('View')).toHaveLength(2);
    });

    it('Render default component without image', () => {
      const componentWithoutImage = mountComponent(propsForRenderDefaultComponentWithoutImage);
      expect(componentWithoutImage
        .containsMatchingElement(propsForRenderDefaultComponentWithoutImage.defaultComponent)).toBe(true);
    });

    it('Render default component without url', () => {
      const componentWithImage = mountComponent(propsForRenderDefaultComponentWithImage);
      expect(componentWithImage
        .containsMatchingElement(propsForRenderDefaultComponentWithImage.defaultComponent)).toBe(true);
    });

    it('Render default component with image uri', () => {
      const componentWithImageUri = mountComponent(propsForRenderDefaultComponentWithImageUrl);
      componentWithImageUri.setState({ isError: true });
      expect(componentWithImageUri
        .containsMatchingElement(propsForRenderDefaultComponentWithImageUrl)).toBe(true);
    });

    it('Render image', () => {
      const componentWithImage = mountComponent(propsForRenderImage);
      expect(componentWithImage.find('Image')).toHaveLength(1);
      componentWithImage.setState({ isError: true });
      expect(componentWithImage.find('Image')).toHaveLength(0);

      const componentWithoutImage = mountComponent(propsForRenderActivityIndicator);
      expect(componentWithoutImage.find('Image')).toHaveLength(0);
    });

    it('Render badge component', () => {
      const componentWithHasBadge = mountComponent(propsForRenderBadgeComponent);

      expect(componentWithHasBadge.find('View')).toHaveLength(3);
      expect(componentWithHasBadge
        .containsMatchingElement(propsForRenderBadgeComponent.badgeComponent)).toBe(true);
    });
  });
});
