import { createForm, FormApi, fieldSubscriptionItems, FieldState, MutableState } from 'final-form';
import React, { useEffect, useRef } from 'react';
import arrayMutators, { Mutators } from 'final-form-arrays';
import { Form, Input, Button, Card, Space } from 'antd';
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
  await sleep(200);
  if (~['john', 'paul', 'george', 'ringo'].indexOf(value && value.toLowerCase())) {
    return 'Username taken!';
  }
};

const onSubmit = async (values: any) => {
  await sleep(300);
  window.alert(JSON.stringify(values, null, 2));
};

const form = createForm<any>({
  onSubmit: () => {},
});
form.registerField(
  'firstName',
  (fieldState) => {
    // firstNameState.current = fieldState;
    // fieldState.change('hi');
    console.log('subscriber-firstName', fieldState);
  },
  { value: true, validating: true, error: true, touched: true, data: true },
  {
    data: { type: 'string' },
    validateFields: [],
    getValidator: () => async (value, allErrors) => {
      const error = value === 'erikras' ? 'Username taken' : undefined;
      await sleep(200);
      return error;
    },
  }
);

function AppDemo() {
  const firstNameState = useRef<FieldState<any>>();
  const customersState = useRef<FieldState<any>>();
  const countRef = useRef(0);

  // const [state, setState] = React.useState<any>(() => {
  //   console.log('Form.initialState');
  //   let initialState = {} as any;
  //   form.subscribe((state) => {
  //     initialState = state;
  //   }, all)();
  //   return initialState;
  // });

  // save a copy of state that can break through the closure
  // on the shallowEqual() line below.
  const stateRef = useLatest<any>(null);

  // const form: FormApi<Record<string, any>, any> = useConstant(() => {
  //   console.log('subscriber-firstName.init');
  //   const f = createForm<Record<string, any>>({
  //     onSubmit: () => {},
  //     // mutators: {
  //     //   ...arrayMutators,
  //     //   test: (args: any[], state: MutableState<any>) => {
  //     //     //   console.log('test-mutator', args, state);
  //     //   },
  //     // } as any,
  //     // validate: (values) => {
  //     //   console.log('init.validate', values);
  //     //   const errors: any = {};
  //     //   if (!values.firstName || values.firstName.length < 3) {
  //     //     errors.firstName = 'Too short';
  //     //   }
  //     //   return errors;
  //     // },
  //   });

  //   // f.subscribe(
  //   //   (state) => {
  //   //     console.log('form.subscribe', state);
  //   //   },
  //   //   {
  //   //     active: true,
  //   //     dirty: true,
  //   //     dirtyFields: true,
  //   //     dirtyFieldsSinceLastSubmit: true,
  //   //     dirtySinceLastSubmit: true,
  //   //     modifiedSinceLastSubmit: true,
  //   //     error: true,
  //   //     errors: true,
  //   //     hasSubmitErrors: true,
  //   //     hasValidationErrors: true,
  //   //     initialValues: true,
  //   //     invalid: true,
  //   //     modified: true,
  //   //     pristine: true,
  //   //     submitError: true,
  //   //     submitErrors: true,
  //   //     submitFailed: true,
  //   //     submitting: true,
  //   //     submitSucceeded: true,
  //   //     touched: true,
  //   //     valid: true,
  //   //     validating: true,
  //   //     values: true,
  //   //     visited: true,
  //   //   }
  //   // );

  //   // pause validation until children register all fields on first render (unpaused in useEffect() below)
  //   // f.pauseValidation();

  //   f.registerField(
  //     'firstName',
  //     (fieldState) => {
  //       firstNameState.current = fieldState;
  //       // fieldState.change('hi');
  //       console.log('subscriber-firstName', fieldState);
  //     },
  //     { value: true, validating: true, error: true, touched: true, data: true },
  //     {
  //       data: { type: 'string' },
  //       validateFields: [],
  //       getValidator: () => async (value, allErrors) => {
  //         const error = value === 'erikras' ? 'Username taken' : undefined;
  //         await sleep(100);
  //         return error;
  //       },
  //     }
  //   );

  //   // f.registerField(
  //   //   'lastName',
  //   //   (fieldState) => {
  //   //     console.log('subscriber-lastName', fieldState);
  //   //   },
  //   //   { value: true, validating: true, error: true, touched: true, data: true },
  //   //   {
  //   //     data: { type: 'string' },
  //   //     validateFields: [],
  //   //     getValidator: () => (value, allValues, meta) => {
  //   //       // console.log('ssssssssss', value);
  //   //       return 'Required';
  //   //     },
  //   //   }
  //   // );

  //   // f.registerField(
  //   //   'customers',
  //   //   (fieldState) => {
  //   //     customersState.current = fieldState;
  //   //     console.log('subscriber-customers', fieldState);
  //   //   },
  //   //   { value: true, validating: true, error: true, touched: true, data: true },
  //   //   { data: { type: 'array' }, validateFields: [] }
  //   // );

  //   // f.registerField(
  //   //   'customers.0.phone',
  //   //   (fieldState) => {
  //   //     console.log('subscriber-customers.0.phone', fieldState);
  //   //   },
  //   //   { value: true, validating: true, error: true, touched: true, data: true },
  //   //   { data: { type: 'string' }, validateFields: [] }
  //   // );

  //   return f;
  // });

  // const mutators = useConstant<Mutators>(() => {
  //   const formMutators = form.mutators as any;
  //   // curry the field name onto all mutator calls
  //   // console.log('formMutators', formMutators);
  //   return Object.keys(formMutators).reduce((result, key) => {
  //     result[key] = (...args: any[]) => formMutators[key]('name', ...args);
  //   //   console.log('formMutators.result', result);
  //     return result;
  //   }, {} as any);
  // });

  return (
    <ReactFinalFormContext.Provider value={form}>
      <Form>
        {/* <Form.Item label={'FirstName'}>
          <Input
            onChange={(e) => {
              // console.log('firstNameState.current', firstNameState.current);
              firstNameState.current?.change(e.target.value);
              // form.change('firstName', e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label={'LastName'}>
          <Input
            onChange={(e) => {
              form.change('lastName', e.target.value);
            }}
          />
        </Form.Item> */}
        <Card
          size='small'
          extra={
            <Space>
              <Button
                size='small'
                icon={<PlusOutlined />}
                onClick={() => {
                  // console.log('form.mutators', form.mutators.test('customers', {}));
                  // form.mutators.push('customers', {});
                  // const length = form.getFieldState('customers')?.length || 0;
                  // console.log('xxxx', length);
                  const length = countRef.current;

                  form.registerField(
                    `customers${length}`,
                    (fieldState) => {
                      // fieldState.change("xxx0")
                      console.log(`subscriber-customers.${length}.name`, fieldState);
                    },
                    { value: true, validating: true, error: true, touched: true, data: true },
                    {
                      silent:true,
                      validateFields: [],
                      getValidator: () => async (value, allErrors) => {
                        const error = value === 'erikras' ? 'Username taken' : undefined;
                        await sleep(300);
                        return error;
                      },
                    }
                  );
                  countRef.current += 1;
                  // form.change('customers', [{}]);
                }}
              />
              <Button size='small' icon={<DeleteOutlined />} />
            </Space>
          }
        ></Card>
      </Form>
    </ReactFinalFormContext.Provider>
  );
}

export default AppDemo;
