import { createForm, FormApi, fieldSubscriptionItems, FieldState, MutableState } from 'final-form';
import { Form, Field } from 'react-final-form';
import React, { useEffect, useRef } from 'react';
import arrayMutators, { Mutators } from 'final-form-arrays';
import { Form as AntForm, Input, Button, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ReactFinalFormContext } from './context';
import useConstant from './hooks/useConstant';
import shallowEqual from './utils/shallowEqual';
import useLatest from './hooks/useLatest';

const all: any = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {} as any);
const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

const required = (value: any) => (value ? undefined : 'Required');
const mustBeNumber = (value: any) => (isNaN(value) ? 'Must be a number' : undefined);
const minValue = (min: any) => (value: any) =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
const composeValidators = (...validators: any) => {
  return (value: any) => validators.reduce((error: any, validator: any) => error || validator(value), undefined);
};

const usernameAvailable = async (value: any) => {
  console.log('usernameAvailable');
  if (!value) {
    return 'Required';
  }
  await sleep(400);
  if (~['john', 'paul', 'george', 'ringo'].indexOf(value && value.toLowerCase())) {
    return 'Username taken!';
  }
};

const onSubmit = async (values: any) => {
  await sleep(300);
  window.alert(JSON.stringify(values, null, 2));
};

function AppDemo2() {
  return (
    <Form onSubmit={() => {}}>
      {({ form }) => {
        return (
          <AntForm>
            <Field
              name='firstName'
              render={({ input }) => {
                return (
                  <AntForm.Item label='FirstName'>
                    <Input {...input} />
                  </AntForm.Item>
                );
              }}
            />
          </AntForm>
        );
      }}
    </Form>
  );
}

export default AppDemo2;
