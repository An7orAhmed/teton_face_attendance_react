import { useState, useEffect } from 'react';

export function useCurrentTime(interval = 1000) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);

    return () => clearInterval(timerId); 
  }, [interval]);

  return currentTime;
}