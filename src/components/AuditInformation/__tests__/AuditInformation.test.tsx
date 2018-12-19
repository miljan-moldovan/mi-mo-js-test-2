import * as React from 'react';
import { mount } from 'enzyme';
import { ActivityIndicator } from 'react-native';
import AuditInformation from '../index';

const auditMock = [
  {
    id: 1719035,
    auditType: 0,
    auditDateTime: '2018-12-18T10:07:21',
    auditEmployee: {
      middleName: null,
      lastName: 'Zona',
      fullName: 'Frank Zona',
      type: 1,
      isTerminated: false,
      inAppointmentBook: true,
      name: 'Frank',
      id: 6,
      updateStamp: 1544777306892251,
      isDeleted: false,
    },
    appointmentId: 762238,
    appointmentDate: '2018-12-18T00:00:00',
    appointmentStartTime: '12:15:00',
    appointmentEndTime: '14:00:00',
    provider: {
      name: 'Bridget',
      id: 389,
      updateStamp: 1545136458131326,
      isDeleted: false,
    },
    service: {
      name: '1 Formula Foil',
      id: 30,
      updateStamp: 1529495311771391,
      isDeleted: false,
    },
  },
  {
    id: 1719036,
    auditType: 1,
    auditDateTime: '2018-12-18T10:07:29',
    auditEmployee: {
      middleName: null,
      lastName: 'Mini',
      fullName: 'Bridget Mini',
      type: 1,
      isTerminated: false,
      inAppointmentBook: true,
      name: 'Bridget',
      id: 389,
      updateStamp: 1545136458131326,
      isDeleted: false,
    },
    appointmentId: 762238,
    appointmentDate: '2018-12-18T00:00:00',
    appointmentStartTime: '12:15:00',
    appointmentEndTime: '14:00:00',
    provider: {
      name: 'Bridget',
      id: 389,
      updateStamp: 1545136458131326,
      isDeleted: false,
    },
    service: {
      name: '1 Formula Foil',
      id: 30,
      updateStamp: 1529495311771391,
      isDeleted: false,
    },
  },
  {
    id: 1719037,
    auditType: 1,
    auditDateTime: '2018-12-18T10:15:42',
    auditEmployee: {
      middleName: null,
      lastName: 'Zona',
      fullName: 'Frank Zona',
      type: 1,
      isTerminated: false,
      inAppointmentBook: true,
      name: 'Frank',
      id: 6,
      updateStamp: 1544777306892251,
      isDeleted: false,
    },
    appointmentId: 762238,
    appointmentDate: '2018-12-18T00:00:00',
    appointmentStartTime: '12:15:00',
    appointmentEndTime: '13:15:00',
    provider: {
      name: 'Bridget',
      id: 389,
      updateStamp: 1545136458131326,
      isDeleted: false,
    },
    service: {
      name: '60 Minutes',
      id: 14,
      updateStamp: 1544024336731581,
      isDeleted: false,
    },
  },
];

describe('<AuditInformation />', () => {
  let props;
  let mountedComponent;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const mountComponent = () => {
    if (!mountedComponent) {
      mountedComponent = mount(<AuditInformation {...props} />);
    }
    return mountedComponent;
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {};
    props = {
      isLoading: false,
      audit: [],
    };
    mountedComponent = undefined;
  });
  afterEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = origConsole;
  });

  describe('Should render ActivityIndicator based on `isLoading` prop', () => {
    it('Should not render spinner when `isLoading` prop equals to `false`', () => {
      const spinner = mountComponent().contains(<ActivityIndicator />);
      expect(spinner).toBe(false);
    });
    it('Should render spinner when `isLoading` prop equals to `true`', () => {
      props.isLoading = true;
      const spinner = mountComponent().contains(<ActivityIndicator />);
      expect(spinner).toBe(true);
    });
  });

  describe('Should render a correct number of AuditInfoItem`s', () => {
    beforeEach(() => {
      props.audit = auditMock;
    });
    it('Should render a single item when `isOpen` is `false`', () => {
      const total = mountComponent()
        .find('AuditInfoItem')
        .reduce((amount, n) => (n ? amount + 1 : amount), 0);
      expect(total).toBe(1);
    });
    it('When `isOpen` is `true` number of AuditInfoItem`s should match audits.length', () => {
      const total = mountComponent()
        .setState({ isOpen: true })
        .find('AuditInfoItem')
        .reduce((amount, n) => (n ? amount + 1 : amount), 0);
      expect(total).toBe(auditMock.length);
    });
  });

  describe('Should correctly render `show more/less` button', () => {
    it('Should render the button when there`re several AuditItems', () => {
      props.audit = auditMock;
      const buttonIsRendered = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(buttonIsRendered).toBe(true);
    });
    it('Should NOT render the button when there`s a single AuditItem', () => {
      props.audit = auditMock.slice(0, 1);
      const buttonIsRendered = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(buttonIsRendered).toBe(false);
    });
  });
});
