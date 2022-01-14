import React from 'react';

export default function useLatest<T>(value: T, name = '') {
  const ref = React.useRef(value);

  React.useEffect(() => {
    if (name === 'Form') {
      console.log('Form.useEffect.useLatest', value);
    }
    ref.current = value;
  });

  return ref;
}
