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

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export {
  getMinSec,
  getHourMinutes,
  getHourMinutesSeconds,
  shuffleArray,
  capitalizeFirstLetter,
};
