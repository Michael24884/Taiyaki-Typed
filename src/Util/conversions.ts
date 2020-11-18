import {AnilistDates} from '../Models/Anilist';

export const timeUntil = (seconds: number): string => {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  // var s = Math.floor(seconds % 60);

  if (d > 0) return `${d} ${d === 1 ? 'day' : 'days'}`;
  if (h > 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`;
  else return `${m} ${m === 1 ? 'minute' : 'minutes'}`;

  //   var dDisplay = d > 0 ? d + (d == 1 ? ' day ' : ' days ') : '';
  //   var hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
  //   var mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';

  //   return dDisplay + hDisplay + mDisplay;
};

export const dateNumToString = (aniDate: AnilistDates): string => {
  const {day, year, month} = aniDate;
  if (!day || !year || !month) return '??-?-????';
  try {
    const date = new Date(month + '/' + day + '/' + year).toLocaleDateString(
      [],
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      },
    );
    return date;
  } catch (e) {
    return '?? -?-????';
  }
};

export function simklThumbnails(
  img?: string,
  format: 'poster' | 'episode' = 'poster',
): string | undefined {
  if (img === 'null') return undefined;
  if (format === 'poster')
    return 'https://simkl.net/posters/' + img + '_ca.jpg';
  else return 'https://simkl.net/episodes/' + img + '_w.jpg';
}

export function splitRatios(
  stringRatio: string,
): {width: number; height: number} {
  const box = stringRatio.split('x');
  if (!Number(box[0]) || !Number(box[1])) {
    throw 'Items must be a number';
  }
  const width = Number(box[0]),
    height = Number(box[1]);
  return {width, height};
}

export function MALtoSimkl(_: number): number {
  return 1;
}

export function cleanString(item: string) {
  return item.replace(/<\w+>|<\/\w+>/g, '');
}

export function breakLine(_: string, _1: string[]): string {
  return '\n';
}
export function italics(_: string, matches: string[]): string {
  return matches[1];
}
export function paragraph(_: string, matches: string[]): string {
  return `\n ${matches[1]}`;
}

export function cleanUnderlines(item: string) {
  return item.replace(/_/, ' ');
}

export function getMinutesFromSeconds(seconds: number) {
  const minutes = seconds >= 60 ? Math.floor(seconds / 60) : 0;
  const second = Math.floor(seconds - minutes * 60);
  return `${minutes >= 10 ? minutes : '0' + minutes}:${
    second >= 10 ? second : '0' + second
  }`;
}
