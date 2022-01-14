import React, { FC } from 'react';
import type { FormSubscription, FormApi, Decorator, Config, FormState } from 'final-form';
import { createForm, formSubscriptionItems } from 'final-form';
import useConstant from './hooks/useConstant';
import useLatest from './hooks/useLatest';

type SupportedInputs = 'input' | 'select' | 'textarea';

export type RenderableProps<T> = {
  component?: React.ComponentType | SupportedInputs;
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  render?: (props: T) => React.ReactNode;
};

export type FieldInputProps = {
  name: string;
  onBlur: (e: React.SyntheticEvent<any>) => void;
  onChange: (e: React.SyntheticEvent<any> | any) => void;
  onFocus: (e?: React.SyntheticEvent<any>) => void;
  value: any;
  type?: string;
  checked?: boolean;
  multiple?: boolean;
};

export type FormRenderProps<FormValues> = {
  handleSubmit: (e: any) => Promise<Object | undefined>;
  form: FormApi<FormValues>;
} & FormState<FormValues>;

export type FieldRenderProps = {
  input: FieldInputProps;
  meta: {
    active?: boolean;
    data?: Object;
    dirty?: boolean;
    dirtySinceLastSubmit?: boolean;
    error?: any;
    initial?: any;
    invalid?: boolean;
    length?: number;
    modified?: boolean;
    modifiedSinceLastSubmit?: boolean;
    pristine?: boolean;
    submitError?: any;
    submitFailed?: boolean;
    submitSucceeded?: boolean;
    submitting?: boolean;
    touched?: boolean;
    valid?: boolean;
    validating?: boolean;
    visited?: boolean;
  };
};

type FormProps<FormValues> = {
  //   children?: React.ReactChild;
  subscription?: FormSubscription;
  decorators?: Decorator<FormValues>[];
  form?: FormApi<FormValues>;
  initialValuesEqual?: (a: any, b: any) => boolean;
} & Config<FormValues> &
  RenderableProps<FormRenderProps<FormValues>>;

interface Pros<T> {
  sss: string;
}

export const all: FormSubscription = formSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {} as { [k: string]: boolean });

function ReactFinalForm<FormValues>({
  debug,
  decorators,
  destroyOnUnregister,
  form: alternateFormApi,
  initialValues,
  initialValuesEqual,
  keepDirtyOnReinitialize,
  mutators,
  onSubmit,
  subscription = all,
  validate,
  validateOnBlur,
  ...rest
}: FormProps<FormValues>) {
  const config: Config<FormValues> = {
    debug,
    destroyOnUnregister,
    initialValues,
    keepDirtyOnReinitialize,
    mutators,
    onSubmit,
    validate,
    validateOnBlur,
  };

  const form: FormApi<FormValues> = useConstant(() => {
    const f = alternateFormApi || createForm<FormValues>(config);
    // pause validation until children register all fields on first render (unpaused in useEffect() below)
    f.pauseValidation();
    return f;
  });

  // synchronously register and unregister to query form state for our subscription on first render
  const [state, setState] = React.useState<FormState<FormValues>>((): FormState<FormValues> => {
    let initialState: FormState<FormValues> = {} as any;
    form.subscribe((state) => {
      initialState = state;
    }, subscription)();
    return initialState;
  });

  // save a copy of state that can break through the closure
  // on the shallowEqual() line below.
  const stateRef = useLatest<FormState<FormValues>>(state);

  return <div></div>;
}

export default ReactFinalForm;
