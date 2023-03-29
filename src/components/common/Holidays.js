import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/css/main.css'

function Calendar() {
    const [selectedDays, setSelectedDays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
  
    useEffect(() => {
      // Fetch holidays from API
      const fetchHolidays = async () => {
        const response = await axios.get('/api/holidays');
        setHolidays(response.data);
      };
      fetchHolidays();
    }, []);
  
    const handleDayClick = (day) => {
      const selectedDay = new Date(day);
      selectedDay.setHours(0, 0, 0, 0);
  
      // If the day is already selected, deselect it
      if (selectedDays.some((d) => isSameDay(d, selectedDay))) {
        setSelectedDays(selectedDays.filter((d) => !isSameDay(d, selectedDay)));
      } else {
    // Add holiday to selected days
        setSelectedDays([...selectedDays, selectedDay]);
  }
    };
  
    const isHoliday = (day) => {
      return holidays.some((holiday) => isSameDay(new Date(holiday.date), day));
    };
  
    const isSameDay = (day1, day2) => {
      return (
        day1.getFullYear() === day2.getFullYear() &&
        day1.getMonth() === day2.getMonth() &&
        day1.getDate() === day2.getDate()
      );
    };
  
    const handleSubmit = async () => {
      setIsLoading(true);
  
      try {
        // Send selected days to API
        const response = await axios.post('/api/holidays', {
          days: selectedDays.map((day) => day.toISOString().substr(0, 10)),
        });
  
        setIsSent(true);
      } catch (error) {
        console.error(error);
      }
  
      setIsLoading(false);
    };
  
    const renderDay = (day) => {
      const classNames = ['day'];
  
      if (isHoliday(day)) {
        classNames.push('holiday');
      }
  
      if (selectedDays.some((d) => isSameDay(d, day))) {
        classNames.push('selected');
      }
  
      return (
        <div className={classNames.join(' ')} onClick={() => handleDayClick(day)}>
          {day.getDate()}
        </div>
      );
    };
  
    const renderWeek = (start) => {
      const days = [];
  
      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(renderDay(day));
      }
  
      return (
        <div className="week" key={start}>
          {days}
        </div>
      );
    };
  
    const renderCalendar = () => {
      const weeks = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month, daysInMonth);
      const prevMonthDays = firstDay.getDay();
      const nextMonthDays = 6 - lastDay.getDay();
  
      let day = new Date(year, month, 1 - prevMonthDays);
  
      while (day <= lastDay) {
    weeks.push(renderWeek(day));
    day.setDate(day.getDate() + 7);
  }
  
  // Add days from the next month
  day = new Date(year, month, daysInMonth + 1);
  for (let i = 0; i < nextMonthDays; i++) {
    weeks.push(renderWeek(day));
    day.setDate(day.getDate() + 7);
  }
  
  return weeks;
  
  };
  
  const handleMonthChange = (e) => {
  const [newYear, newMonth] = e.target.value.split('-').map(Number);
  setYear(newYear);
  setMonth(newMonth);
  };
  
  return (
   <div className="calendar">
     <div className="header">
        <select className="month-select" value={`${year}-${month}`} onChange={handleMonthChange}>
            {Array.from(Array(12).keys()).map((monthIndex) => (
                <option value={`${year}-${monthIndex}`}>{new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long' })}</option>
  ))}

 

  </select>
  <div className="weekday">Sunday</div>
  <div className="weekday">Monday</div>
  <div className="weekday">Tuesday</div>
  <div className="weekday">Wednesday</div>
  <div className="weekday">Thursday</div>
  <div className="weekday">Friday</div>
  <div className="weekday">Saturday</div>
  </div>
  <div className="days">{renderCalendar()}</div>
  <div className="footer">
  {!isSent ? (
  <>
  <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Send'}
  </button>
  {selectedDays.length > 0 && (
  <div className="selected-days">
  <span>You have selected:</span>
  <ul>
  {selectedDays.map((day) => (
  <li key={day.toISOString()}>{day.toLocaleDateString()}</li>
  ))}
  </ul>
  </div>
  )}
  </>
  ) : (
  <div className="sent-message">Your request has been sent!</div>
  )}
  </div>
  </div>
  );
  }
  
  export default Calendar;
