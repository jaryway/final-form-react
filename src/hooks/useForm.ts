import * as React from 'react';
// import type { FormApi } from 'final-form';
import { ReactFinalFormContext } from '../context';

function useForm(componentName?: string) {
  const form = React.useContext(ReactFinalFormContext);
  if (!form) {
    throw new Error(`${componentName || 'useForm'} must be used inside of a <Form> component`);
  }
  return form;
}

export default useForm;
