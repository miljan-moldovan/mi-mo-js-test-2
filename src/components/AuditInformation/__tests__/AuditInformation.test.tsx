import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { ActivityIndicator } from 'react-native';
import AuditInformation from '../index';
import sinon from 'sinon';

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
  let defaultProps;
  let mountedComponent;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const mountComponent = (props = defaultProps) => {
    if (!mountedComponent) {
      mountedComponent = mount(<AuditInformation {...props} />);
    }
    return mountedComponent;
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {};
    defaultProps = {
      isLoading: false,
      audit: [],
    };
    mountedComponent = undefined;
  });
  afterEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = origConsole;
  });

  it('renders correctly', () => {
    expect(mountComponent()).toMatchSnapshot();
  });

  describe('Should render ActivityIndicator based on `isLoading` prop', () => {
    it('Should not render spinner when `isLoading` prop equals to `false`', () => {
      const spinner = mountComponent().contains(<ActivityIndicator />);
      expect(spinner).toBe(false);
    });
    it('Should render spinner when `isLoading` prop equals to `true`', () => {
      defaultProps.isLoading = true;
      const spinner = mountComponent().contains(<ActivityIndicator />);
      expect(spinner).toBe(true);
    });
  });

  describe('Should render a correct number of AuditInfoItem`s', () => {
    beforeEach(() => {
      defaultProps.audit = auditMock;
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
      defaultProps.audit = auditMock;
      const buttonIsRendered = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(buttonIsRendered).toBe(true);
    });
    it('Should NOT render the button when there`s a single AuditItem', () => {
      defaultProps.audit = auditMock.slice(0, 1);
      const buttonIsRendered = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(buttonIsRendered).toBe(false);
    });
  });

  describe('The `show more/less` button should properly change state', () => {
    beforeEach(() => {
      defaultProps.audit = auditMock;
    });

    it('Click on the button should change `isOpen`', () => {
      const component = mountComponent();
      expect(component.state().isOpen).toBe(false);

      component
        .find('SalonTouchableOpacity(TouchableOpacity)')
        .props()
        .onPress();
      expect(component.state().isOpen).toBe(true);
    });
  });

  describe('Should properly prepare audit data for render', () => {
    let spy;
    beforeEach(() => {
      defaultProps.audit = auditMock;
      spy = sinon.spy(AuditInformation.prototype, 'componentWillReceiveProps');
    });
    afterEach(() => {
      spy.restore();
    });

    it('Should run `prepareAudit` function and change state when received new audit props', () => {
      const component = mountComponent();

      expect(spy).toHaveProperty('callCount', 0);
      expect(component.state().isBlockTime).toBe(false);

      component.setProps({ audit: [{}, {}, {}] });

      expect(spy).toHaveProperty('callCount', 1);
      expect(component.state().isBlockTime).toBe(true);
    });
    it('Should NOT change state when received same audit props', () => {
      const component = mountComponent();

      expect(spy).toHaveProperty('callCount', 0);
      expect(component.state().isBlockTime).toBe(false);
      const firstState = component.state();

      component.setProps({ audit: auditMock });

      expect(spy).toHaveProperty('callCount', 1);
      expect(component.state().isBlockTime).toBe(false);
      expect(component.state()).toEqual(firstState);
    });
    it('Should NOT change state when DID NOT receive audit props', () => {
      const component = mountComponent();
      const firstAuditState = component.state('audit');

      component.setProps({ audit: null });

      expect(component.state('audit')).toBe(firstAuditState);
    });
  });

  describe('`prepareAudit` function should properly parse props', () => {
    beforeEach(() => {
      defaultProps.audit = auditMock;
    });

    it('Should properly parse audit with a lot of undefined values', () => {
      const emptyAuditParsed = {
        appointmentDate: '',
        appointmentStartTime: '',
        appointmentEndTime: '',
        provider: '',
        service: 'someMockService',
        auditType: 'someMockType',
        auditDateTime: '',
        auditEmployee: '',
      };

      const emptyAudit = {
        service: {
          name: 'someMockService',
        },
        auditType: 'someMockType',
      };

      const component = mountComponent({ audit: [emptyAudit] });

      expect(component.state('audit')).toEqual([emptyAuditParsed]);
      expect(component.state('isBlockTime')).toBe(false);
    });
    it('Should properly parse a completely empty object', () => {
      const undefinedAuditParsed = {
        appointmentDate: '',
        appointmentStartTime: '',
        appointmentEndTime: '',
        auditType: undefined,
        auditDateTime: '',
        auditEmployee: '',
        id: undefined,
      };

      const component = mountComponent({ audit: [{}] });

      expect(component.state('audit')).toEqual([undefinedAuditParsed]);
      expect(component.state('isBlockTime')).toBe(true);
    });
  });
});
