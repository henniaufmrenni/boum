/* eslint-disable no-bitwise */

const getMinSec = (time: number) => {
  let mins = ~~((time % 3600) / 60);
  let secs = ~~time % 60;

  let res = '';

  res += '' + mins + ':' + (secs < 10 ? '0' : '');
  res += '' + secs;
  return res;
};

const getHourMinutesSeconds = (microseconds: number) => {
  const milliseconds = microseconds / 10000;
  const minutes = ~~((milliseconds / (1000 * 60)) % 60);
  const hours = ~~((milliseconds / (1000 * 60 * 60)) % 24);

  return (
    (hours > 0 ? hours + 'h ' : '') +
    (minutes < 10 ? '0' : '') +
    minutes +
    ' min '
  );
};

const getHourMinutes = (microseconds: number) => {
  const milliseconds = microseconds / 10000;
  const minutes = ~~((milliseconds / (1000 * 60)) % 60);
  const hours = ~~((milliseconds / (1000 * 60 * 60)) % 24);

  return (
    (hours > 0 ? hours + 'h ' : '') +
    (minutes < 10 ? '0' : '') +
    minutes +
    'min '
  );
};

//
const shuffleArray = (array: Array<any>) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const getTimeInHourMinutes = (milliseconds: number): string => {
  const timeNow = Date.now();
  var date = new Date(timeNow + milliseconds);

  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
};

const getTimeInHourMinutesSeconds = (milliseconds: number): string => {
  const timeNow = Date.now();
  var date = new Date(timeNow + milliseconds);

  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = '0' + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime =
    hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export {
  capitalizeFirstLetter,
  getHourMinutes,
  getHourMinutesSeconds,
  getMinSec,
  getTimeInHourMinutes,
  getTimeInHourMinutesSeconds,
  shuffleArray,
};
