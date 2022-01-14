import type { FormState, FieldState } from 'final-form';

const addLazyState = (dest: Object, state: any, keys: string[]): void => {
  keys.forEach((key) => {
    Object.defineProperty(dest, key, {
      get: () => state[key],
      enumerable: true,
    });
  });
};

export const addLazyFormState = <T>(dest: Object, state: FormState<T>): void =>
  addLazyState(dest, state, [
    'active',
    'dirty',
    'dirtyFields',
    'dirtySinceLastSubmit',
    'dirtyFieldsSinceLastSubmit',
    'error',
    'errors',
    'hasSubmitErrors',
    'hasValidationErrors',
    'initialValues',
    'invalid',
    'modified',
    'modifiedSinceLastSubmit',
    'pristine',
    'submitError',
    'submitErrors',
    'submitFailed',
    'submitSucceeded',
    'submitting',
    'touched',
    'valid',
    'validating',
    'values',
    'visited',
  ]);

export const addLazyFieldMetaState = <T>(dest: Object, state: FieldState<T>): void =>
  addLazyState(dest, state, [
    'active',
    'data',
    'dirty',
    'dirtySinceLastSubmit',
    'error',
    'initial',
    'invalid',
    'length',
    'modified',
    'modifiedSinceLastSubmit',
    'pristine',
    'submitError',
    'submitFailed',
    'submitSucceeded',
    'submitting',
    'touched',
    'valid',
    'validating',
    'visited',
  ]);
