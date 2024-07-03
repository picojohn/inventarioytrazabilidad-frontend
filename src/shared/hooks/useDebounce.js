import {useState, useEffect} from 'react';

export const useDebounce = (input, time) => {
  const [debouncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(input);
    }, time);
    return () => {
      clearTimeout(timeOut);
    };
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  return debouncedValue;
};
