import React from 'react';
import {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldState,
  FieldSubscription,
  FieldValidator,
} from 'final-form';

export type SupportedInputs = 'input' | 'select' | 'textarea';

export interface ReactContext<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>> {
  reactFinalForm: FormApi<FormValues, InitialFormValues>;
}

export type FieldMetaState<FieldValue> = Pick<
  FieldState<FieldValue>,
  Exclude<keyof FieldState<FieldValue>, 'blur' | 'change' | 'focus' | 'name' | 'value'>
>;

export interface FieldInputProps<FieldValue, T extends HTMLElement = HTMLElement> extends AnyObject {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: FieldValue;
  checked?: boolean;
  multiple?: boolean;
}

interface AnyObject {
  [key: string]: any;
}

export interface FieldRenderProps<FieldValue, T extends HTMLElement = HTMLElement, InputValue = FieldValue> {
  input: FieldInputProps<InputValue, T>;
  meta: FieldMetaState<FieldValue>;
  [otherProp: string]: any;
}

export interface FormRenderProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
  extends FormState<FormValues, InitialFormValues>,
    RenderableProps<FormRenderProps<FormValues>> {
  form: FormApi<FormValues>;
  handleSubmit: (
    event?: Partial<Pick<React.SyntheticEvent, 'preventDefault' | 'stopPropagation'>>
  ) => Promise<AnyObject | undefined> | undefined;
}

export interface FormSpyRenderProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
  extends FormState<FormValues, InitialFormValues> {
  form: FormApi;
}

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  component?: React.ComponentType<T> | SupportedInputs;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
  extends Config<FormValues, InitialFormValues>,
    RenderableProps<FormRenderProps<FormValues, InitialFormValues>> {
  subscription?: FormSubscription;
  decorators?: Array<Decorator<FormValues, InitialFormValues>>;
  form?: FormApi<FormValues, InitialFormValues>;
  initialValuesEqual?: (a?: AnyObject, b?: AnyObject) => boolean;
  [otherProp: string]: any;
}

export interface UseFieldConfig<FieldValue, InputValue = any> {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | boolean;
  data?: AnyObject;
  defaultValue?: FieldValue;
  format?: (value: FieldValue, name: string) => InputValue;
  formatOnBlur?: boolean;
  initialValue?: FieldValue;
  isEqual?: (a: any, b: any) => boolean;
  multiple?: boolean;
  parse?: (value: InputValue, name: string) => FieldValue;
  subscription?: FieldSubscription;
  type?: string;
  validate?: FieldValidator<FieldValue>;
  validateFields?: string[];
  value?: FieldValue;
  silent?: boolean;
}

export interface FieldProps<
  FieldValue = any,
  RP extends FieldRenderProps<FieldValue, T> = FieldRenderProps<FieldValue>,
  T extends HTMLElement = HTMLElement
> extends UseFieldConfig<FieldValue>,
    RenderableProps<RP> {
  name: string;
  [otherProp: string]: any;
}

export interface UseFormStateParams<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>> {
  onChange?: (formState: FormState<FormValues, InitialFormValues>) => void;
  subscription?: FormSubscription;
}

export interface FormSpyProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
  extends UseFormStateParams<FormValues, InitialFormValues>,
    RenderableProps<FormSpyRenderProps<FormValues, InitialFormValues>> {}

export type FormSpyPropsWithForm<FormValues = Record<string, any>> = {
  reactFinalForm: FormApi<FormValues>;
} & FormSpyProps<FormValues>;

export interface UseFieldArrayConfig<FieldValue> extends UseFieldConfig<FieldValue[]> {
  isEqual?: (a: any[], b: any[]) => boolean;
}

export interface FieldArrayRenderProps<FieldValue, T extends HTMLElement> {
  fields: {
    forEach: (iterator: (name: string, index: number) => void) => void;
    insert: (index: number, value: FieldValue) => void;
    map: <R>(iterator: ({ key, name }: { key: React.Key; name: string }, index: number) => R) => R[];
    move: (from: number, to: number) => void;
    update: (index: number, value: FieldValue) => void;
    name: string;
    pop: () => FieldValue;
    push: (value: FieldValue) => void;
    remove: (index: number) => FieldValue;
    shift: () => FieldValue;
    swap: (indexA: number, indexB: number) => void;
    unshift: (value: FieldValue) => void;
    value: FieldValue[];
    length: number;
  } & Omit<FieldState<FieldValue[]>, 'blur' | 'focus' | 'change'>;
  meta: Partial<{
    // TODO: Make a diff of `FieldState` without all the functions
    active: boolean;
    dirty: boolean;
    dirtySinceLastSubmit: boolean;
    error: any;
    initial: any;
    invalid: boolean;
    pristine: boolean;
    submitError: any;
    submitFailed: boolean;
    submitSucceeded: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
  }>;
}

export interface FieldArrayProps<FieldValue, T extends HTMLElement>
  extends UseFieldArrayConfig<FieldValue>,
    RenderableProps<FieldArrayRenderProps<FieldValue, T>> {
  name: string;
  [otherProp: string]: any;
}
