export default class ApiError implements Error {
    name: 'ApiError';
    message: 'Default Message';
    systemErrorDetail: {};
    systemErrorStack: {};
    systemErrorType: {};
    stack : {};

    constructor(message, systemErrorDetail, systemErrorStack, systemErrorType) {
      this.name = 'ApiError';
      this.message = message || 'Default Message';
      this.stack = (new Error()).stack;
      this.systemErrorDetail = systemErrorDetail;
      this.systemErrorStack = systemErrorStack;
      this.systemErrorType = systemErrorType;
    }
}
