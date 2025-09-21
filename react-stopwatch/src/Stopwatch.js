import React, { useState, useEffect, useRef } from 'react';

function Stopwatch() {
  const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const tickAudioRef = useRef(null); // Audio ref

  useEffect(() => {
    // Initialize audio
    tickAudioRef.current = new Audio('/tick.mp3'); // path to your tick sound
    tickAudioRef.current.loop = true; // keep looping while running
  }, []);

  useEffect(() => {
    if (isRunning) {
      tickAudioRef.current.play(); // start tick sound
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          let { minutes, seconds, milliseconds } = prevTime;
          milliseconds += 1;
          if (milliseconds >= 100) {
            milliseconds = 0;
            seconds += 1;
          }
          if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
          }
          return { minutes, seconds, milliseconds };
        });
      }, 10);
    } else {
      clearInterval(intervalRef.current);
      tickAudioRef.current.pause(); // stop tick sound
      tickAudioRef.current.currentTime = 0; // reset to start
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = value => (value < 10 ? `0${value}` : value);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
    setLaps([]);
  };
  const handleLap = () => {
    const lapTime = `${formatTime(time.minutes)}:${formatTime(time.seconds)}:${formatTime(time.milliseconds)}`;
    setLaps(prev => [...prev, lapTime]);
  };

  return (
    <div className="stopwatch-container">
      <h1>Stopwatch</h1>
      <div className="display">
        {formatTime(time.minutes)}:{formatTime(time.seconds)}:{formatTime(time.milliseconds)}
      </div>
      <div className="buttons">
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleLap}>Lap</button>
      </div>
      <div className="laps">
        <h2>Lap Times</h2>
        <ul>
          {laps.map((lap, index) => (
            <li key={index}>{lap}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Stopwatch;
