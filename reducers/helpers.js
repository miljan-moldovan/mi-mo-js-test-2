import moment from 'moment';

export function getLabelColor(item) {
  let background = '#4a4a4a';
  const now = new Date().getTime();

  if (item.checked_in) {
    const enteredTime = new Date().setHours(0, 0, item.enteredTime);
    const elapsed = (now - enteredTime) / 1000;
    if (elapsed < 15*60) {
      background = '#00CF48';
    } else if (elapsed < 30*60) {
      background = '#FFA300';
    } else {
      background = '#D1242A';
    }
  } else if (item.status === 1) {
    background = '#00CF48';
  } else if (item.serviced) {
    const servicedTime = new Date().setHours(0, 0, item.servicedTime);
    const finishService = new Date().setHours(0, 0, item.finishService);
    const elapsed = item.status === 7 ? (finishService - servicedTime) / 1000 : (now - servicedTime) / 1000;

    if (elapsed >= +item.length + 15*60) {
      background = '#D1242A';
    } else if (elapsed >= +item.length) {
      background = '#FFA300';
    } else if (elapsed < item.length) {
      background = '#00CF48';
    }
  }

  return background;
}

export function getWorkingTime(item) {
  const time = new Date().setHours(0, 0, item.servicedTime);
  const workingTime = ((new Date().getTime() - time) / 60000);
  return Math.ceil(workingTime, 10);
}

export function getWaitTime(item) {
  if (item.checked_in) {
    const enteredTime = new Date().setHours(0, 0, item.enteredTime);
    const now = new Date().getTime();
    const elapsed = (now - enteredTime) / 60000;
    return parseInt(elapsed, 10);
  }
  return 0;
}

export function getEstimatedServiceTime(item) {
  return item.length / 60;
}

export function getEstimatedWaitTime(item) {
  const time = item.start_time.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
  let startTime = new Date();
  startTime.setHours(parseInt(time[1], 10) + (time[3] ? 12 : 0), parseInt(time[2], 10) || 0, 0);
  const estimatedTime = (startTime - new Date().setHours(0, 0, item.enteredTime)) / 60000;
  return parseInt(estimatedTime, 10);
}

export function getProcentCompleted(item) {
  if (item.completed === undefined) {
    return 0;
  }
  if (item.completed <= 100) {
    item.completed += 100 / item.estimatedTime;
  }
  return item.completed;
}

export function getExpectedStartTime(item) {
  return getEstimatedWaitTime(item) - getWaitTime(item);
}

export function formatServiceStartTime(seconds) {
  const time = new Date().setHours(0, 0, seconds);
  return moment(time).format('hh:mm A');
}

export function getSecondsPassedSinceMidnight() {
  const now = new Date().getTime();
  const midnight = new Date().setHours(0, 0, 0, 0);
  const time = (now - midnight) / 1000;
  return parseInt(time, 10);
}
