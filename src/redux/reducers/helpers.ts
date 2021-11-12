// @flow
import moment from 'moment';
// import { QueueItem } from 'models';
// import event from 'material-ui/svg-icons/action/event';
export const COLORS = [
  '#00E480',
  '#F6A623',
  '#0095F5',
  '#F5E000',
  '#EB1D1D',
  '#E007D9',
  '#B07513',
  '#00FBFF',
  '#A07FCC',
  '#ACEF56',
  '#3C58D2',
  '#3A5674',
];

export function getLabelColor(item) {
  let background = '#4a4a4a';
  const now = new Date().getTime();

  if (item.status === 0) {
    const enteredTime = new Date().setHours(0, 0, item.enteredTime);
    const elapsed = (now - enteredTime) / 1000;
    if (elapsed < 15 * 60) {
      background = '#00CF48';
    } else if (elapsed < 30 * 60) {
      background = '#FFA300';
    } else {
      background = '#D1242A';
    }
  } else if (item.status === 1) {
    background = '#00CF48';
  } else if (item.serviced) {
    const servicedTime = new Date().setHours(0, 0, +item.servicedTime);
    const finishService = new Date().setHours(0, 0, item.finishService);
    const elapsed = item.status === 7
      ? (finishService - servicedTime) / 1000
      : (now - servicedTime) / 1000;

    if (elapsed >= +item.length + 15 * 60) {
      background = '#D1242A';
    } else if (elapsed >= +item.length) {
      background = '#FFA300';
    } else if (elapsed < +item.length) {
      background = '#00CF48';
    }
  }

  return background;
}

export function getWorkingTime(item) {
  //   const time = new Date().setHours(0, 0, +item.servicedTimeAt);
  //   const workingTime = ((new Date().getTime() - time) / 60000);

  // let minutes = moment(item.servicedTimeAt).minutes();
  //   return Math.ceil(minutes);
  let time = moment(item.processTime, 'hh:mm:ss');

  return time.add(1, 'minutes').format('hh:mm:ss');
}

export function getWaitTime(item) {
  if (item.status === 0) {
    let time = moment(item.processTime, 'hh:mm:ss');

    return time.add(1, 'minutes').format('hh:mm:ss');

    // const enteredTime = new Date().setHours(0, 0, +item.enteredTimeAt);
    // const now = new Date().getTime();
    // const elapsed = (now - enteredTime) / 60000;
    // return Math.round(elapsed);
  }
  return 0;
}

export function getEstimatedServiceTime(item) {
  return +item.length / 60;
}

export function getEstimatedWaitTime(item) {
  const time = item.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
  const startTime = new Date().setHours(
    parseInt(time[1], 10) + (time[3] ? 12 : 0),
    parseInt(time[2], 10) || 0,
    0,
  );
  const tmpTime = new Date().setHours(0, 0, item.enteredTime);
  const estimatedTime = (startTime - tmpTime) / 60000;
  return Math.round(estimatedTime);
}

export function getProcentCompleted(item) {
  if (item.completed === 100) {
    return item.completed;
  }

  let progressMaxTime =
    moment(item.progressMaxTime, 'hh:mm:ss').minutes() +
    moment(item.progressMaxTime, 'hh:mm:ss').hours() * 60;
  let processTime =
    moment(item.processTime, 'hh:mm:ss').minutes() +
    moment(item.processTime, 'hh:mm:ss').hours() * 60;
  let time = processTime / progressMaxTime * 100;

  if (time < 0 || time >= 100) {
    return (item.completed = 100);
  } else {
    return (item.completed = time);
  }

  //   if (item.completed <= 100) {
  // let progressMaxTime =  moment(item.progressMaxTime, 'hh:mm:ss').minutes();
  // let processTime =  moment(item.processTime, 'hh:mm:ss').minutes();
  // let time = ( (progressMaxTime - processTime) / progressMaxTime ) * 100;
  //
  //
  //
  //     item.completed += 100 / item.estimatedTime;
  //   }
  //   return item.completed;
}

// export function getExpectedStartTime(item) {
//   return getEstimatedWaitTime(item) - getWaitTime(item);
// }

export function formatServiceStartTime(seconds: string) {
  //   const time = new Date().setHours(0, 0, +seconds);
  return moment(seconds).format('hh:mm A');
}

export function getSecondsPassedSinceMidnight() {
  const now = new Date().getTime();
  const midnight = new Date().setHours(0, 0, 0, 0);
  const time = (now - midnight) / 1000;
  return time;
}

export function getCoords(elem: any) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    width: box.width,
    height: box.height,
  };
}

export function getWidthHeightDocs() {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
  };
}

const colors = [
  {
    id: 1,
    backgroundColor: '#EDFCEF',
    border: '1px solid',
    borderColor: '#0CE586',
  },
  {
    id: 2,
    backgroundColor: '#FDF7EC',
    border: '1px solid',
    borderColor: '#F6A623',
  },
];

export function getBadgeColor(colorsId: number[]) {
  const unusedColors = colors.filter(
    _color => colorsId.indexOf(_color.id) === -1,
  );

  if (unusedColors.length) {
    return colors.find(_color => _color.id === unusedColors[0].id);
  }

  let color = '#';
  const letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  let opacity = '';
  for (let i = 0; i < 2; i++) {
    opacity += letters[Math.round(Math.random() * 15)];
  }

  const newColor = {
    id: colors[colors.length - 1].id + 1,
    backgroundColor: color + opacity,
    border: '1px solid',
    borderColor: color,
  };

  colors.push(newColor);

  return newColor;
}

export function generateColorsForGroups(groups: any) {
  const groupIds = Object.keys(groups);

  for (let i = 0; i < groupIds.length; i++) {
    const color = COLORS[i] || '#ddd';

    groups[groupIds[i]].color = {
      backgroundColor: color + '4d',
      border: '1px solid',
      borderColor: color,
    };
  }
}

export function generateColorForNewGroup(colorNum: number) {
  const color = COLORS[colorNum] || '#ddd';

  return {
    backgroundColor: color + '4d',
    border: '1px solid',
    borderColor: color,
  };
}
