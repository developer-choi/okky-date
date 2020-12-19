export interface DateDetail {
  year: number;
  month: number; // 0이 1월
  date: number;
  day: number; // 0이 일요일
  hour: number;
  minute: number;
  second: number;
}

export function dateToDetail(targetDate = new Date()): DateDetail {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0이 1월
  const date = targetDate.getDate();
  const day = targetDate.getDay(); // 0이 일요일
  const hour = targetDate.getHours();
  const minute = targetDate.getMinutes();
  const second = targetDate.getSeconds();

  return {
    year, month, date, day, hour, minute, second
  };
}

/**
 * @return from, to 사이의 자연수를 배열로 만들어 반환. from, to의 경계도 포함.
 * @example (-1, 4) => [-1, 0, 1, 2, 3, 4]
 * @example (4, -1) => [4, 3, 2, 1, 0, -1]
 */
export function getNumberArray(from :number, to: number): number[] {

  const max = Math.max(from, to);
  const min = Math.min(from, to);
  const length = max - min + 1;

  if(from > to)
    return [...new Array(length).keys()].map(num => num + min).reverse();

  else
    return [...new Array(length).keys()].map(num => num + min);
}

export type Frequency = 'minute' | 'hour' | 'date' | 'month' | 'year';

/**
 * 1. start가 end보다 나중인경우 : []
 * 2. start가 end랑 같은경우 : start 하나 (= end하나)
 * 3. 그 외 : [start, (사이), end]
 */

export function getBetweenDates(startDate: Date, endDate: Date, frequency: Frequency): Date[] {

  const diffDateLength = getDiffDateLength(startDate, endDate, frequency);

  if (diffDateLength < 0) {
    return [];
  }

  if (diffDateLength === 0) {
    return [startDate];
  }

  if (diffDateLength === 1) {
    return [startDate, endDate];
  }

  const {date, month, year, minute, hour} = dateToDetail(startDate);

  const betweenDates = getNumberArray(1, diffDateLength - 1).map(value => {

    switch (frequency) {
      case 'year':
        return new Date(year + value, 0);

      case 'month':
        return new Date(year, month + value);

      case 'date':
        return new Date(year, month, date + value);

      case 'hour':
        return new Date(year, month, date, hour + value);

      case 'minute':
        return new Date(year, month, date, hour, minute + value);

      default:
        throw Error(`invalid frequency ${frequency}`);
    }
  });

  return [startDate, ...betweenDates, endDate];
}

const MILLISECOND = 1000;
const SECOND = 60;
const MINUTE = 60;
const HOUR = 24;

export function timestampToMinute(timestamp: number): number {
  return timestamp / SECOND / MILLISECOND;
}

export function timestampToHour(timestamp: number): number {
  return timestampToMinute(timestamp) / MINUTE;
}

export function timestampToDate(timestamp: number): number {
  return timestampToHour(timestamp) / HOUR;
}

export function getDiffYear(startDate: Date, endDate: Date): number {
  return endDate.getFullYear() - startDate.getFullYear();
}

function getTotalMonth(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

export function getDiffMonth(startDate: Date, endDate: Date): number {
  return getTotalMonth(endDate) - getTotalMonth(startDate);
}

export function getDiffDate(startDate: Date, endDate: Date): number {
  const _startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const _endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return timestampToDate(_endDate.getTime() - _startDate.getTime());
}

export function getDiffHour(startDate: Date, endDate: Date): number {
  const _startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours());
  const _endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours());
  return timestampToHour(_endDate.getTime() - _startDate.getTime());
}

export function getDiffMinute(startDate: Date, endDate: Date): number {
  const _startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes());
  const _endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes());
  return timestampToMinute(_endDate.getTime() - _startDate.getTime());
}

export function getDiffDateLength(startDate: Date, endDate: Date, frequency: Frequency): number {

  switch (frequency) {
    case 'year':
      return getDiffYear(startDate, endDate);

    case 'month':
      return getDiffMonth(startDate, endDate);

    case 'date':
      return getDiffDate(startDate, endDate);

    case 'hour':
      return getDiffHour(startDate, endDate);

    case 'minute':
      return getDiffMinute(startDate, endDate);
  }
}
