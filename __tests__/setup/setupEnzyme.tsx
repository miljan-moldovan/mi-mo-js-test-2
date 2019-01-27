import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-img-cache', () => {
  const mockComponent = require('react-native/jest/mockComponent');
  return {
    CustomCachedImage: mockComponent('Image'),
    CachedImage: mockComponent('Image'),
  };
});

jest.mock('@/redux/store', () => {
  return {};
});
