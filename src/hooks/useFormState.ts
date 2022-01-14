import * as React from 'react';
import type { UseFormStateParams } from '../types';
import type { FormState } from 'final-form';
import { all } from '../ReactFinalForm';
import useForm from './useForm';
import { addLazyFormState } from '../utils/getters';

function useFormState<FormValues = Record<string, any>>({
  onChange,
  subscription = all,
}: UseFormStateParams<FormValues>): FormState<FormValues> {
  const form = useForm('useFormState');
  const firstRender = React.useRef(true);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState(() => {
    let initialState = {} as any;
    form.subscribe((state) => {
      initialState = state;
    }, subscription)();
    if (onChange) {
      onChange(initialState);
    }
    return initialState;
  });

  React.useEffect(
    () => {
      return form.subscribe((newState) => {
        if (firstRender.current) {
          firstRender.current = false;
        } else {
          setState(newState as any);
          if (onChangeRef.current) {
            onChangeRef.current(newState as FormState<FormValues>);
          }
        }
      }, subscription);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const lazyState: any = {};
  addLazyFormState(lazyState, state);
  return lazyState;
}

export default useFormState;
