import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { fieldSubscriptionItems, FieldSubscription } from 'final-form';
import { FieldProps } from '../types';
import renderComponent from '../utils/renderComponent';
import useField from '../hooks/useField';

// const defaultFormat = (value: any, name: string) => (value === undefined ? '' : value);
// const defaultParse = (value: any | undefined, name: string) => (value === '' ? undefined : value);
const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {});

const Field = React.forwardRef<any, FieldProps>(function (
  {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    data,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    name,
    parse,
    subscription = all,
    type,
    validate,
    validateFields,
    value,
    silent,
    ...rest
  },
  ref
) {
  const field = useField(name, {
    afterSubmit,
    allowNull,
    beforeSubmit,
    // children,
    // component,
    data,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
    silent,
  });

  if (typeof children === 'function') {
    return (children as (props) => React.ReactElement)({ ...field, ...rest });
  }

  if (typeof component === 'string') {
    // ignore meta, combine input with any other props
    return React.createElement(component, { ...field.input, children, ref, ...rest });
  }

  if (!name) {
    throw new Error('prop name cannot be undefined in <Field> component');
  }

  return renderComponent({ children, component, ref, ...rest } as any, field, `Field(${name})`);
});

export default Field as ForwardRefExoticComponent<FieldProps & RefAttributes<any>>;
