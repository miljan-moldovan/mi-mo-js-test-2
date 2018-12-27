import e from '../../constants/ErrorTypes';
import processError from '@/utilities/processError';

const errorMessage = 'this is just a test';

const createSimpleError = (errorMessage?: string, type = 'response') => ({
  [type]: {
    data: {
      message: errorMessage,
    },
  },
});

describe('processError', () => {
  describe('should correctly populate response data if any', () => {
    test('server returned an error', () => {
      const error = createSimpleError(errorMessage);
      const message = `The server has returned an error. ${
        (error.response.data && error.response.data.message)
        }`;
      expect(processError(error)).toHaveProperty('message', message);
      expect(processError(error).type).toBe(e.SERVER);
    });
    test('server returned request error', () => {
      const error = createSimpleError(errorMessage, 'request');
      const message = 'Error sending information. Please verify your Internet connection.';
      expect(processError(error)).toHaveProperty('message', message);
      expect(processError(error).type).toBe(e.NETWORK);
    });
    test('server returned internal error', () => {
      const message = 'Internal error sending information. Please try again or contact support.';
      expect(processError({})).toHaveProperty('message', message);
      expect(processError({}).type).toBe(e.INTERNAL);
    });
  });
});
