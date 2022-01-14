import { Form as AntForm, Input, Button, Card, Space, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import arrayMutators from 'final-form-arrays';
import Form from './components/Form';
import Field from './components/Field';
import FormSpy from './components/FormSpy';
import ArrayField from './components/ArrayField';
import { FieldMetaState } from './types';

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

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
const getValidateStatus = (meta: FieldMetaState<any>) => {
  if (meta.validating) return 'validating';
  if (meta.touched) return meta.error ? 'error' : 'success';
  return undefined;
};

const getValidateMessage = (meta: FieldMetaState<any>) => {
  return meta.touched && meta.error ? meta.error : undefined;
};

const onSubmit = async (values: any) => {
  await sleep(300);
  window.alert(JSON.stringify(values, null, 2));
};

function App() {
  //
  return (
    <>
      <Form
        mutators={arrayMutators as any}
        onSubmit={onSubmit}
        subscription={
          {
            // active: true,
            // dirty: true,
            // dirtyFields: true,
            // dirtyFieldsSinceLastSubmit: true,
            // dirtySinceLastSubmit: true,
            // modifiedSinceLastSubmit: true,
            // error: true,
            // errors: true,
            // hasSubmitErrors: true,
            // hasValidationErrors: true,
            // initialValues: true,
            // invalid: true,
            // modified: true,
            // pristine: true,
            // submitError: true,
            // submitErrors: true,
            // submitFailed: true,
            // submitting: true,
            // submitSucceeded: true,
            // touched: true,
            // valid: true,
            // validating: true,
            // values: true,
            // visited: true,
          }
        }
      >
        {({ form }) => {
          console.log('Form.useEffect.renderer');
          return (
            <AntForm>
              <Field
                name='firstName'
                data-ss={'da'}
                validate={usernameAvailable}
                data={{ type: 'string' }}
                validateFields={[]}
                subscription={{ value: true, validating: true, error: true, touched: true }}
              >
                {({ input, meta }) => {
                  console.log('firstNamefirstNamefirstNamefirstName', meta.validating, meta.error);
                  return (
                    <AntForm.Item
                      hasFeedback
                      label={'FirstName'}
                      help={getValidateMessage(meta)}
                      validateStatus={getValidateStatus(meta)}
                    >
                      <Input {...input} />
                    </AntForm.Item>
                  );
                }}
              </Field>
              {/* <Field name='lastName'>
                {({ input, meta }) => {
                  console.log('lastName', meta.validating);
                  return (
                    <AntForm.Item label={'LastName'}>
                      <Input {...input} />
                    </AntForm.Item>
                  );
                }}
              </Field> */}

              {/* <ArrayField name='array' validateFields={[]} subscription={{}} data={{ type: 'array' }}>
                {({ fields }) => {
                  return (
                    <Card title='Array' size='small' style={{ marginBottom: 16 }}>
                      {fields.map(({ key, name }, index) => {
                        return (
                          <Card
                            size='small'
                            title={`Array. #${index + 1}`}
                            style={{ marginBottom: 16 }}
                            key={key}
                            extra={
                              <Space>
                                <Button
                                  size='small'
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    fields.remove(index);
                                  }}
                                />
                                <Button
                                  size='small'
                                  icon={<ArrowUpOutlined />}
                                  onClick={() => {
                                    fields.move(index, index - 1 < 0 ? fields.length - 1 : index - 1);
                                  }}
                                />
                                <Button
                                  size='small'
                                  icon={<ArrowDownOutlined />}
                                  onClick={() => {
                                    fields.move(index, index + 1 >= fields.length ? 0 : index + 1);
                                  }}
                                />
                              </Space>
                            }
                          >
                            <ArrayField name={name} validateFields={[]} data={{ type: 'array' }}>
                              {({ fields }) => {
                                return (
                                  <Card title={`Array-${name}`} size='small' style={{ marginBottom: 16 }}>
                                    {fields.map(({ key, name }, index) => {
                                      return (
                                        <Card
                                          size='small'
                                          title={`Array-${name}. #${index + 1}`}
                                          style={{ marginBottom: 16 }}
                                          key={key}
                                          extra={
                                            <Space>
                                              <Button
                                                size='small'
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                  fields.remove(index);
                                                }}
                                              />
                                              <Button
                                                size='small'
                                                icon={<ArrowUpOutlined />}
                                                onClick={() => {
                                                  fields.move(index, index - 1 < 0 ? fields.length - 1 : index - 1);
                                                }}
                                              />
                                              <Button
                                                size='small'
                                                icon={<ArrowDownOutlined />}
                                                onClick={() => {
                                                  fields.move(index, index + 1 >= fields.length ? 0 : index + 1);
                                                }}
                                              />
                                            </Space>
                                          }
                                        >
                                          <ArrayField name={name} validateFields={[]} data={{ type: 'array' }}>
                                            {({ fields }) => {
                                              return (
                                                <Card title='Array' size='small' style={{ marginBottom: 16 }}>
                                                  {fields.map(({ key, name }, index) => {
                                                    return (
                                                      <Card
                                                        size='small'
                                                        title={`Array-${name}. #${index + 1}`}
                                                        style={{ marginBottom: 16 }}
                                                        key={key}
                                                        extra={
                                                          <Space>
                                                            <Button
                                                              size='small'
                                                              icon={<DeleteOutlined />}
                                                              onClick={() => {
                                                                fields.remove(index);
                                                              }}
                                                            />
                                                            <Button
                                                              size='small'
                                                              icon={<ArrowUpOutlined />}
                                                              onClick={() => {
                                                                fields.move(
                                                                  index,
                                                                  index - 1 < 0 ? fields.length - 1 : index - 1
                                                                );
                                                              }}
                                                            />
                                                            <Button
                                                              size='small'
                                                              icon={<ArrowDownOutlined />}
                                                              onClick={() => {
                                                                fields.move(
                                                                  index,
                                                                  index + 1 >= fields.length ? 0 : index + 1
                                                                );
                                                              }}
                                                            />
                                                          </Space>
                                                        }
                                                      >
                                                        <Field
                                                          name={`${name}`}
                                                          validateFields={[]}
                                                          subscription={{
                                                            value: true,
                                                            validating: true,
                                                            error: true,
                                                            touched: true,
                                                          }}
                                                        >
                                                          {({ input, meta }) => {
                                                            // console.log('change-firstName', input);
                                                            return (
                                                              <AntForm.Item
                                                              // label='First Name'
                                                              // help={getValidateMessage(meta)}
                                                              // validateStatus={getValidateStatus(meta)}
                                                              >
                                                                <Input {...input} placeholder='First Name' />
                                                              </AntForm.Item>
                                                            );
                                                          }}
                                                        </Field>
                                                      </Card>
                                                    );
                                                  })}
                                                  <Button
                                                    type='dashed'
                                                    style={{ width: '100%' }}
                                                    icon={<PlusOutlined />}
                                                    onClick={() => fields.push('')}
                                                  />
                                                </Card>
                                              );
                                            }}
                                          
                                          </ArrayField>
                                        </Card>
                                      );
                                    })}
                                    <Button
                                      type='dashed'
                                      style={{ width: '100%' }}
                                      icon={<PlusOutlined />}
                                      onClick={() => fields.push([])}
                                    />
                                  </Card>
                                );
                              }}
                            </ArrayField>
                          </Card>
                        );
                      })}
                      <Button
                        type='dashed'
                        style={{ width: '100%' }}
                        icon={<PlusOutlined />}
                        onClick={() => fields.push([])}
                      />
                    </Card>
                  );
                }}
              </ArrayField> */}

              <Card title='Customers' size='small' style={{ marginBottom: 16 }}>
                <ArrayField
                  name='customers'
                  validateFields={[]}
                  subscription={{ value: true }}
                  data={{ type: 'array' }}
                >
                  {({ fields }) => {
                    console.log('Form.useEffect.useField.ArrayField.render');
                    return (
                      <>
                        {fields.map(({ key, name }, index) => {
                          return (
                            <Card
                              size='small'
                              title={`Cust. #${index + 1}`}
                              style={{ marginBottom: 16 }}
                              key={key}
                              extra={
                                <Space>
                                  <Button size='small' icon={<DeleteOutlined />} onClick={() => fields.remove(index)} />
                                  <Button
                                    size='small'
                                    icon={<ArrowUpOutlined />}
                                    onClick={() => {
                                      fields.move(index, index - 1 < 0 ? fields.length - 1 : index - 1);
                                    }}
                                  />
                                  <Button
                                    size='small'
                                    icon={<ArrowDownOutlined />}
                                    onClick={() => {
                                      fields.move(index, index + 1 >= fields.length ? 0 : index + 1);
                                    }}
                                  />
                                </Space>
                              }
                            >
                              <Row>
                                <Col span={8}>
                                  <Field
                                    name={`${name}.name1`}
                                    validateFields={[]}
                                    validate={usernameAvailable}
                                    silent={true}
                                    subscription={{ value: true, validating: true, error: true, touched: true }}
                                  >
                                    {({ input, meta }) => {
                                      // console.log('change-firstName', input);
                                      return (
                                        <AntForm.Item
                                          label='First Name'
                                          help={getValidateMessage(meta)}
                                          validateStatus={getValidateStatus(meta)}
                                        >
                                          <Input {...input} placeholder='First Name' />
                                        </AntForm.Item>
                                      );
                                    }}
                                  </Field>
                                </Col>
                                <Col span={8}>
                                  <Field
                                    name={`${name}.name2`}
                                    validate={usernameAvailable}
                                    silent={true}
                                    validateFields={[]}
                                    subscription={{ value: true, validating: true, error: true, touched: true }}
                                  >
                                    {({ input, meta }) => {
                                      // console.log('change-lastName', input);
                                      return (
                                        <AntForm.Item
                                          label='Last Name'
                                          hasFeedback
                                          // help={getValidateMessage(meta)}
                                          // validateStatus={getValidateStatus(meta)}
                                        >
                                          <Input {...input} placeholder='Last Name' />
                                        </AntForm.Item>
                                      );
                                    }}
                                  </Field>
                                </Col>
                              </Row>
                            </Card>
                          );
                        })}
                        <Button
                          type='dashed'
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                          onClick={() => fields.push({ firstName: '', lastName: '' })}
                        />
                      </>
                    );
                  }}
                </ArrayField>
              </Card>

              <FormSpy subscription={{ values: true, submitting: true, pristine: true }}>
                {({ values, submitting, pristine }) => {
                  // console.log('FormSpy', submitting, pristine);
                  return (
                    <>
                      <AntForm.Item label={'　'} colon={false}>
                        <Space>
                          <Button
                            type='primary'
                            htmlType='submit'
                            onClick={(e) => {
                              e.preventDefault();
                              form.submit();
                              console.log('FormSpy', submitting, pristine);
                              console.log('getFieldState', form.getFieldState('user.username'));
                            }}
                            loading={submitting}
                            disabled={pristine}
                          >
                            Submit
                          </Button>
                          <Button onClick={form.reset} disabled={submitting || pristine}>
                            Reset
                          </Button>
                        </Space>
                      </AntForm.Item>
                      <pre>{JSON.stringify(values, undefined, 2)}</pre>
                    </>
                  );
                }}
              </FormSpy>
            </AntForm>
          );
        }}
      </Form>
      <div className='App'>
        <button
          onClick={() => {
            // formRef.current?.change('array.0.phone', Math.random());
            // console.log(formRef.current?.getState());
          }}
        >
          change array.0.phone
        </button>
        <button
          onClick={() => {
            // formRef.current?.change('array.0.address', Math.random());
            // console.log(formRef.current?.getState());
          }}
        >
          change array.0.address
        </button>
      </div>
    </>
  );
}

export default App;
