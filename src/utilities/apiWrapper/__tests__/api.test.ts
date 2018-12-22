import { getApiInstance, getEmployeePhoto, resetApiInstance, URLKEY, STOREKEY, JWTKEY } from '../api';
import MockAsyncStorage from 'mock-async-storage';

const mock = () => {
  const mockImpl = new MockAsyncStorage();
  jest.mock('AsyncStorage', () => mockImpl);
};

mock();

import { AsyncStorage as storage } from 'react-native';

const url = 'test.me';
const store = 'some.store.key';
const jwt = 'some.jwt.key';

const defaultURL = 'https://nw.qa.sg.salondev.net/api/v1';
const testedURL = `https://${url}/api/v1`;

describe('api', () => {

  describe('resetApiInstance', () => {
    test('resetApiInstance should correctly destroy ApiInstance when called', async () => {
      const instance = await getApiInstance();

      resetApiInstance();

      expect(await instance).toBeNull;
    });
  });

  describe('getApiInstance & getEmployeePhoto', () => {
    test('getApiInstance should not create duplicate instances', async () => {
      const instance = await getApiInstance();
      const instance2 = await getApiInstance();

      expect(instance).toBe(instance2);
    });
    test('getApiInstance should correctly work without any properties from AsyncStorage', async () => {
      await storage.setItem(URLKEY, null);
      await storage.setItem(STOREKEY, null);
      await storage.setItem(JWTKEY, null);

      const instance = await getApiInstance();

      expect(instance.defaults.baseURL).toEqual(defaultURL);
      expect(instance.defaults.headers['X-SU-store-key']).toEqual(undefined);
      expect(instance.defaults.headers['X-AuthToken']).toEqual(undefined);

      resetApiInstance();
    });
    test('getApiInstance should get properties from AsyncStorage if they exist', async () => {
      await storage.setItem(URLKEY, url);
      await storage.setItem(STOREKEY, store);
      await storage.setItem(JWTKEY, jwt);

      const instance = await getApiInstance();

      expect(instance.defaults.baseURL).toEqual(testedURL);
      expect(instance.defaults.headers['X-SU-store-key']).toEqual(store);
      expect(instance.defaults.headers['X-AuthToken']).toEqual(jwt);
    });

    test('getEmployeePhoto should return correct url route', async () => {
      const id = 101;
      const route = getEmployeePhoto(id);

      expect(route).toBe(`${testedURL}Employees/${id}/Photo`);
      resetApiInstance();
    });
  });
});
