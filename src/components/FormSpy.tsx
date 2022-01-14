import type { FormSpyRenderProps, FormSpyProps } from '../types';
import renderComponent from '../utils/renderComponent';
import isSyntheticEvent from '../utils/isSyntheticEvent';
import useForm from '../hooks/useForm';
import useFormState from '../hooks/useFormState';

function FormSpy<FormValues = Record<string, any>>({ onChange, subscription, ...rest }: FormSpyProps<FormValues>) {
  const reactFinalForm = useForm('FormSpy');
  const state = useFormState({ onChange, subscription });
  if (onChange) {
    return null;
  }

  const renderProps = {
    form: {
      ...reactFinalForm,
      reset: (eventOrValues) => {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          reactFinalForm.reset();
        } else {
          reactFinalForm.reset(eventOrValues);
        }
      },
    },
  };

  const finalProps = { ...rest, ...renderProps } as FormSpyRenderProps<FormValues>;

  return renderComponent(finalProps, state, 'FormSpy');
}

export default FormSpy;
