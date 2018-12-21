[![Build status](https://build.appcenter.ms/v0.1/apps/90a3e0c0-9ccb-42c8-80b4-e39b5888200c/branches/develop/badge)](https://appcenter.ms)

#POS

## Installation

#### Using npm:

`$ npm install`

`$ cd  ios`

`$ pod install`

#### Run:

`$ react-native run-ios`

## Tests

#### Boilerplate

###### For component

```javascript
import * as React from 'react';
import { mount } from 'enzyme';
import ComponentName from '../index';

describe('<ComponentName />', () => {
  let defaultProps;
  let mountedComponent;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const mountComponent = (props = defaultProps) => {
    if (!mountedComponent) {
      mountedComponent = mount(<ComponentName {...props} />);
    }
    return mountedComponent;
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {};
    defaultProps = {
    // enter your default props here
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

  describe('describe your test group', () => {
    it('some test', () => {
      //your code
    });
  });
});
```


###### For api call "axios"

```javascript
import postTurnAway from '../postTurnAway';
import axios from 'axios';
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  userMessage: {
    test: 'test',
  },
}; // Mock response data

// Mock post request to '/TurnAway' endpoint
mock.onPost('TurnAway').reply(200, returnData); 

describe('postTurnAway', () => {
  test('Should return correct property', async () => {
    const res = await postTurnAway('test');
    expect(res).toEqual(returnData.userMessage);
  });
});
```
