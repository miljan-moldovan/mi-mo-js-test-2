export default class ApiError implements Error {
  name: 'ApiError';
  message: 'Default Message';
  systemErrorDetail: {};
  systemErrorStack: {};
  systemErrorType: {};
  responseCode: 0;
  stack: string;

  constructor(message, systemErrorDetail, systemErrorStack, systemErrorType, responseCode) {
    this.name = 'ApiError';
    this.message = message || 'Default Message';
    this.stack = (new Error()).stack;
    this.systemErrorDetail = systemErrorDetail;
    this.systemErrorStack = systemErrorStack;
    this.systemErrorType = systemErrorType;
    this.responseCode = responseCode;
  }
}
