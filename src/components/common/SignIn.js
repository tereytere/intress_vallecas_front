import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/css/main.css'
function SignIn() {
  const [isWorking, setIsWorking] = useState(false);
  const [entryTime, setEntryTime] = useState(null);
  const [exitTime, setExitTime] = useState(null);
  const [isHoliday, setIsHoliday] = useState(false);
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    // Check if today is a holiday
    const checkHoliday = async () => {
      const response = await axios.get('/api/is-holiday');
      setIsHoliday(response.data.isHoliday);
    };
    checkHoliday();

    // Check if the user has a workshop scheduled
    const checkWorkshop = async () => {
      const response = await axios.get('/api/workshop-today');
      setWorkshop(response.data.workshop);
    };
    checkWorkshop();
  }, []);

  const handleEntry = async () => {
    setIsWorking(true);
    setEntryTime(new Date());
    const response = await axios.post('/api/sign-in', {
      type: 'entry',
      time: new Date(),
    });
    console.log(response.data); // handle response data from Symfony API
  };

  const handleExit = async () => {
    setIsWorking(false);
    setExitTime(new Date());
    const response = await axios.post('/api/sign-in', {
      type: 'exit',
      time: new Date(),
    });
    console.log(response.data); // handle response data from Symfony API
  };

  if (isHoliday) {
    return <p>Today is a holiday. You cannot sign in or out.</p>;
  }

  if (workshop) {
    return (
      <div>
        <p>You have a workshop scheduled today from {workshop.startTime} to {workshop.endTime}.</p>
        <p>You cannot sign in or out during this time.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign In</h2>
      {isWorking ? (
        <button onClick={handleExit}>Exit</button>
      ) : (
        <button onClick={handleEntry}>Entry</button>
      )}
      {entryTime && <p>Entry time: {entryTime.toLocaleString()}</p>}
      {exitTime && <p>Exit time: {exitTime.toLocaleString()}</p>}
    </div>
  );
}

export default SignIn;
