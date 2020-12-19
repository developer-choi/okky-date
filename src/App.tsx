import moment from 'moment';
import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import './App.css';
import {Frequency, getBetweenDates} from './array';

export default function App() {

  const [startDate, setStartDate] = useState('2020-12-01');
  const [endDate, setEndDate] = useState('2020-12-10');
  const [frequency, setFrequency] = useState<Frequency>('date');

  const onChangeStartDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  }, []);

  const onChangeEndDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  }, []);

  const onChangeFrequency = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFrequency(event.target.value as Frequency);
  }, []);

  const dates = getBetweenDates(new Date(startDate), new Date(endDate), frequency);
  const format = useMemo(() => {

    switch (frequency) {
      case 'year':
      case 'month':
      case 'date':
        return 'YYYY년 MM월 DD일';

      case 'hour':
        return 'YYYY년 MM월 DD일 HH시';

      case 'minute':
        return 'YYYY년 MM월 DD일 HH시 mm분'
    }

  }, [frequency]);

  return (
    <div className="wrap">
      <form>
        <label className="radio-wrap">
          <input type="radio" name="frequency" value="year" onChange={onChangeFrequency} checked={frequency === 'year'}/>
          연간
        </label>
        <label className="radio-wrap">
          <input type="radio" name="frequency" value="month" onChange={onChangeFrequency} checked={frequency === 'month'}/>
          월간
        </label>
        <label className="radio-wrap">
          <input type="radio" name="frequency" value="date" onChange={onChangeFrequency} checked={frequency === 'date'}/>
          일간
        </label>
        <label className="radio-wrap">
          <input type="radio" name="frequency" value="hour" onChange={onChangeFrequency} checked={frequency === 'hour'}/>
          시간별
        </label>
        <label className="radio-wrap">
          <input type="radio" name="frequency" value="minute" onChange={onChangeFrequency} checked={frequency === 'minute'}/>
          분별
        </label>
        <input className="date-picker" type="date" value={startDate} onChange={onChangeStartDate}/>
        <input className="date-picker" type="date" value={endDate} onChange={onChangeEndDate}/>
      </form>
      <span className="total">총 갯수 = {dates.length}개</span>
      <ul className="container">
        {dates.map((date, index) => (
            <li key={index}>{moment(date).format(format)}</li>
        ))}
      </ul>
    </div>
  );
}
