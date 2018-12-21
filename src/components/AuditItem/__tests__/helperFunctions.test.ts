import { getAuditType, formatDate, formatTime, formatTimeWithMinutes, formatEmployeeName } from '../helperFunctions';

describe('AuditInfo: helperFunctions', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('formatEmployeeName()', () => {
    it('Should return empty string if the argument is falsy', () => {
      expect(formatEmployeeName(null)).toBe('');
      expect(formatEmployeeName(undefined)).toBe('');
      expect(formatEmployeeName()).toBe('');

      expect(formatEmployeeName('test me')).not.toBe('');
      expect(formatEmployeeName('hello')).not.toBe('');
      expect(formatEmployeeName('somebody once told me the world is gonna roll me')).not.toBe('');
    });
    it('Should return `firstname` if the argument is a single word (e.g. firstname)', () => {
      expect(formatEmployeeName('Eugene')).toBe('Eugene');
      expect(formatEmployeeName('somerandomname')).toBe('somerandomname');
      expect(formatEmployeeName('Denis')).toBe('Denis');

      expect(formatEmployeeName('test me')).not.toBe('test');
      expect(formatEmployeeName('Kil`jaeden the Deceiver')).not.toBe('Kil`jaeden');
      expect(formatEmployeeName('somebody once told me the world is gonna roll me')).not.toBe('somebody');
    });
    it('Should return `firstname l` if the argument is two words (e.g. firstname + lastname)', () => {
      expect(formatEmployeeName('Eugene Stoner')).toBe('Eugene S');
      expect(formatEmployeeName('some randomname')).toBe('some r');
      expect(formatEmployeeName('Denis V')).toBe('Denis V');

      expect(formatEmployeeName('testme')).not.toBe('test m');
      expect(formatEmployeeName('Kil`jaeden the Deceiver')).not.toBe('Kil`jaeden T');
      expect(formatEmployeeName('somebody once told me the world is gonna roll me')).not.toBe('Somebody O');
    });
    it('Should return `firstname l` if the argument is three words (e.g. firstname + middlename + lastname)', () => {
      expect(formatEmployeeName('Eugene Morrison Stoner')).toBe('Eugene S');
      expect(formatEmployeeName('Kil`jaeden the Deceiver')).toBe('Kil`jaeden D');
      expect(formatEmployeeName('Denis V isVendetta')).toBe('Denis i');

      expect(formatEmployeeName('test me please')).not.toBe('test m');
      expect(formatEmployeeName('some random name')).not.toBe('some r');
      expect(formatEmployeeName('Eugene Morrison Stoner')).not.toBe('Eugene M');
    });
    it('', () => {
      expect(formatEmployeeName('Eugene Morrison Stoner')).toBe('Eugene S');
      expect(formatEmployeeName('Kil`jaeden the Deceiver')).toBe('Kil`jaeden D');
      expect(formatEmployeeName('Denis V isVendetta')).toBe('Denis i');

      expect(formatEmployeeName('test me please')).not.toBe('test m');
      expect(formatEmployeeName('some random name')).not.toBe('some r');
      expect(formatEmployeeName('Eugene Morrison Stoner')).not.toBe('Eugene M');
    });
  });

  describe('getAuditType()', () => {
    it('Should return `--` if the argument doesn`t match AuditType or no argument present', () => {
      expect(getAuditType(42)).toBe('--');
      expect(getAuditType()).toBe('--');
      expect(getAuditType(144)).toBe('--');
      expect(getAuditType(35)).toBe('--');

      expect(getAuditType(0)).not.toBe('--');
      expect(getAuditType(1)).not.toBe('--');
      expect(getAuditType(2)).not.toBe('--');
      expect(getAuditType(10)).not.toBe('--');
    });
  });

  describe('formatDate()', () => {
    it('Should return date in format MM/DD/YYYY', () => {
      const dateTime = '2018-12-19T14:53:51';
      expect(formatDate(dateTime)).toBe('12/19/2018');
    });
  });

  describe('formatTime()', () => {
    it('Should return time in format hh:mm A', () => {
      const dateTime = '14:45:00';
      expect(formatTime(dateTime)).toBe('02:45 PM');
    });
  });

  describe('formatTimeWithMinutes()', () => {
    it('Should return time in format hh:mm A', () => {
      const dateTime = '2018-12-19T14:53:51';
      expect(formatTimeWithMinutes(dateTime)).toBe('02:53 PM');
    });
  });
});
