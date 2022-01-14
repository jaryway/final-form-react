import { version as ffVersion } from 'final-form';
import { version as rffVersion } from 'react-final-form';
import type { FieldArrayProps } from '../types';
import renderComponent from '../utils/renderComponent';
import useFieldArray from '../hooks/useFieldArray';
import { version } from '../../package.json';

export { version };

const versions = {
  'final-form': ffVersion,
  'react-final-form': rffVersion,
  'react-final-form-arrays': version,
};

const ArrayField = ({
  name,
  subscription = {},
  defaultValue,
  initialValue,
  isEqual,
  validate,
  data = {},
  validateFields = [],
  ...rest
}: FieldArrayProps<any, any>) => {
  console.log('Form.useEffect.renderer.3333', data);
  const { fields, meta } = useFieldArray(name, {
    subscription,
    defaultValue,
    initialValue,
    isEqual,
    validate,
    data,
    validateFields,
  });

  return renderComponent<any>(
    {
      fields,
      meta: {
        ...meta,
        __versions: versions,
      },
      ...rest,
    },
    {},
    `ArrayField(${name})`
  );
};

export default ArrayField;
