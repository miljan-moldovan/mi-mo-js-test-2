export default function toPeriodFormat(time) {
  const timeArray = time.split(':');
  let hours = parseInt(timeArray[0], 10);
  let minutes = parseInt(timeArray[1], 10);

  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;

  return strTime;
}
