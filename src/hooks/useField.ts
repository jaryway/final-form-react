// @flow
import * as React from 'react';
import { FieldSubscriber, fieldSubscriptionItems } from 'final-form';
import type { FieldSubscription, FieldState } from 'final-form';
import type { UseFieldConfig, FieldInputProps, FieldRenderProps } from '../types';
import isReactNative from '../utils/isReactNative';
import getValue from '../utils/getValue';
import { addLazyFieldMetaState } from '../utils/getters';
import useForm from './useForm';
import useLatest from './useLatest';

import useConstantCallback from './useConstantCallback';

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {} as Record<string, boolean>);

const defaultFormat = (value: any | undefined, name: string) => (value === undefined ? '' : value);
const defaultParse = (value: any | undefined, name: string) => (value === '' ? undefined : value);
const defaultIsEqual = (a: any, b: any): boolean => a === b;

function useField<FieldValue = any, T extends HTMLElement = HTMLElement, InputValue = FieldValue>(
  name: string,
  config?: UseFieldConfig<FieldValue, InputValue>
): FieldRenderProps<FieldValue, T> {
  const {
    afterSubmit,
    allowNull,
    component,
    data,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    multiple,
    parse = defaultParse,
    subscription = all,
    type,
    validateFields,
    value: _value,
    silent,
  } = config as any;
  const form = useForm('useField');

  const configRef = useLatest(config);

  const register = <FormValues, K extends keyof FormValues>(
    callback: FieldSubscriber<FormValues[K]>,
    silent: boolean
  ) => {
    console.log('form.registerField');
    // avoid using `state` const in any closures created inside `register`
    // because they would refer `state` from current execution context
    // whereas actual `state` would defined in the subsequent `useField` hook
    // execution
    // (that would be caused by `setState` call performed in `register` callback)
    return form.registerField(name as any, callback as any, subscription, {
      afterSubmit,
      beforeSubmit: () => {
        const { beforeSubmit, formatOnBlur, format = defaultFormat } = configRef.current || {};

        if (formatOnBlur) {
          const { value } = form.getFieldState(name as any) as FieldState<any>;
          const formatted = format(value as any, name);

          if (formatted !== value) {
            form.change(name as any, formatted);
          }
        }

        if (beforeSubmit) return beforeSubmit() as false | void;
        return beforeSubmit as undefined;
      },
      data,
      defaultValue,
      getValidator: () => configRef.current?.validate as any,
      initialValue,
      isEqual: (a, b) => (configRef.current?.isEqual || defaultIsEqual)(a, b),
      silent,
      validateFields,
    });
  };

  const firstRender = React.useRef(true);
  const firstRender1 = React.useRef(true);

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FieldState<any>>((): FieldState<any> => {
    let initialState: FieldState<FieldValue> = {} as any;

    // temporarily disable destroyOnUnregister
    const destroyOnUnregister = form.destroyOnUnregister;
    form.destroyOnUnregister = false;

    register<any, any>((state) => {
      initialState = state;
    }, true)();

    // return destroyOnUnregister to its original value
    form.destroyOnUnregister = destroyOnUnregister;

    return initialState;
  });
  // console.log('Form.useEffect.useField.render', name);
  React.useEffect(
    () => {
      console.log('notifyFieldListeners6.register1', name, silent);
      return register<any, any>((state) => {
        // console.log('firstNamefirstNamefirstNamefirstName.register', name, firstRender.current);
        if (firstRender.current) {
          firstRender.current = false;
        } else {
          setState(state);
        }
      }, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      // data,
      // defaultValue,
      // // If we want to allow inline fat-arrow field-level validation functions, we
      // // cannot reregister field every time validate function !==.
      // // validate,
      // initialValue,
      // // The validateFields array is often passed as validateFields={[]}, creating
      // // a !== new array every time. If it needs to be changed, a rerender/reregister
      // // can be forced by changing the key prop
      // // validateFields
    ]
  );
  React.useEffect(() => {
    console.log('notifyFieldListeners6.change.data', data);
  }, [data]);
  React.useEffect(() => {
    console.log('notifyFieldListeners6.change.defaultValue', defaultValue);
  }, [defaultValue]);
  React.useEffect(() => {
    console.log('notifyFieldListeners6.change.initialValue', initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    console.log('notifyFieldListeners6.change.name', name);
    // if (firstRender1.current) return;
    // return register<any, any>((state) => {
    //   firstRender1.current = false;
    //   // console.log('firstNamefirstNamefirstNamefirstName.register', name, firstRender.current);
    //   // if (firstRender1.current) {
    //   //   firstRender1.current = false;
    //   // } else {
    //     setState(state);
    //   // }
    // }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const meta = {};
  addLazyFieldMetaState(meta, state);
  const input: FieldInputProps<FieldValue, T> = {
    name,
    get value() {
      let value = state.value;
      if (formatOnBlur) {
        if (component === 'input') {
          value = defaultFormat(value, name);
        }
      } else {
        value = format(value, name);
      }
      if (value === null && !allowNull) {
        value = '' as any;
      }
      if (type === 'checkbox' || type === 'radio') {
        return _value;
      } else if (component === 'select' && multiple) {
        return value || [];
      }
      return value;
    },
    get checked() {
      let value = state.value;
      if (type === 'checkbox') {
        value = format(value, name);
        if (_value === undefined) {
          return !!value;
        } else {
          return !!(Array.isArray(value) && ~value.indexOf(_value));
        }
      } else if (type === 'radio') {
        return format(value, name) === _value;
      }
      return undefined;
    },
    onBlur: useConstantCallback((event?: React.SyntheticEvent<any>) => {
      state.blur();
      if (formatOnBlur) {
        /**
         * Here we must fetch the value directly from Final Form because we cannot
         * trust that our `state` closure has the most recent value. This is a problem
         * if-and-only-if the library consumer has called `onChange()` immediately
         * before calling `onBlur()`, but before the field has had a chance to receive
         * the value update from Final Form.
         */
        const fieldState: any = form.getFieldState(state.name as any);
        state.change(format(fieldState.value, state.name));
      }
    }),
    onChange: useConstantCallback((event: React.SyntheticEvent<any> | any) => {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production' && event && event.target) {
        const targetType = event.target.type;
        const unknown =
          ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) && !type && component !== 'select';

        const value: any = targetType === 'select-multiple' ? state.value : _value;

        if (unknown) {
          console.error(
            `You must pass \`type="${
              targetType === 'select-multiple' ? 'select' : targetType
            }"\` prop to your Field(${name}) component.\n` +
              `Without it we don't know how to unpack your \`value\` prop - ${
                Array.isArray(value) ? `[${value}]` : `"${value}"`
              }.`
          );
        }
      }

      const value: any = event && event.target ? getValue(event, state.value, _value, isReactNative || false) : event;
      state.change(parse(value, name));
    }),
    onFocus: useConstantCallback((event: React.SyntheticEvent<any> | undefined) => state.focus()),
  };

  if (multiple) {
    input.multiple = multiple;
  }
  if (type !== undefined) {
    input.type = type;
  }

  const renderProps: FieldRenderProps<FieldValue, T> = { input, meta }; // assign to force Flow check
  return renderProps;
}

export default useField;
