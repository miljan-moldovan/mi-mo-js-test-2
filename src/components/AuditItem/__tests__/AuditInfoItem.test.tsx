import * as React from 'react';
import { mount, shallow } from 'enzyme';
import AuditInfoItem from '../index';
import { getAuditType, formatDate, formatTime, formatTimeWithMinutes, formatEmployeeName } from '../helperFunctions';

const auditMock = {
  appointmentDate: '2018-12-19T00:00:00',
  appointmentEndTime: '15:15:00',
  appointmentStartTime: '14:45:00',
  auditDateTime: '2018-12-19T14:53:51',
  auditEmployee: 'Beth',
  auditType: 1,
  id: 1719095,
  provider: 'Beth',
  service: "Men's Cut",
};

describe('<AuditInfoItem />', () => {
  let defaultProps;
  let mountedComponent;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const mountComponent = (props = defaultProps) => {
    if (!mountedComponent) {
      mountedComponent = mount(<AuditInfoItem {...props} />);
    }
    return mountedComponent;
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {};
    defaultProps = {
      isBlockTime: false,
      singleAudit: auditMock,
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

  describe('Should render text in different formats depending on `isBlockTime`', () => {
    it('`isBlockTime` is `true`', () => {
      defaultProps.isBlockTime = true;
      const renderedName = mountComponent()
        .find('Text')
        .last()
        .text();
      expect(renderedName).toBe(formatEmployeeName(auditMock.auditEmployee));
    });
    it('`isBlockTime` is `false`', () => {
      defaultProps.isBlockTime = false;
      const renderedName = mountComponent()
        .find('Text')
        .last()
        .text();
      expect(renderedName).not.toBe(formatEmployeeName(auditMock.auditEmployee));
    });
  });
});
