import { useState } from 'react';

// Mudamos para export default aqui
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  
  return [value, toggle];
};

export default useToggle;