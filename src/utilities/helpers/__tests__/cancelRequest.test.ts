import cancelRequest from '../cancelRequest';

let mockCallback;

describe('cancelRequest function', () => {
  beforeEach(() => {
    mockCallback = jest.fn();
  });

  test('function should return true', () => {
    expect(cancelRequest(mockCallback)).toBe(true);
  });

  test('Call function without callback', () => {
    cancelRequest(null);
    expect(mockCallback.mock.calls.length).toBe(0);
  });

  test('Call function with callback', () => {
    cancelRequest(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
