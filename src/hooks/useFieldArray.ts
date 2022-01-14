import React, { useRef } from 'react';
import { fieldSubscriptionItems, ARRAY_ERROR } from 'final-form';
// import type { Mutators } from 'final-form-arrays';
import type { FieldValidator, FieldSubscription } from 'final-form';
import type { FieldArrayRenderProps, UseFieldArrayConfig } from '../types';
import defaultIsEqual from '../utils/defaultIsEqual';
import useConstant from './useConstant';
import useForm from './useForm';
import useField from './useField';

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {});

const __move = (array: any[], from: number, to: number) => {
  if (from === to) return array || [];
  const copy = [...(array || [])];
  const value = copy[from];
  copy.splice(from, 1);
  copy.splice(to, 0, value);
  return copy;
};

const useFieldArray = <FieldValue, T extends HTMLElement = HTMLElement>(
  name: string,
  {
    subscription = all,
    defaultValue,
    initialValue,
    isEqual = defaultIsEqual,
    validate: validateProp,
    data,
    validateFields,
  }: UseFieldArrayConfig<FieldValue> = {}
): FieldArrayRenderProps<FieldValue, T> => {
  const form = useForm('useFieldArray');
  const keyRef = useRef<{ keys: number[]; id: number }>({ keys: [], id: 0 });
  const keyManager = keyRef.current;

  const formMutators = form.mutators;
  const hasMutators = !!(formMutators && formMutators.push && formMutators.pop);
  if (!hasMutators) {
    throw new Error('Array mutators not found. You need to provide the mutators from final-form-arrays to your form');
  }
  const mutators = useConstant(() => {
    return {
      insert: (index: number, value: FieldValue) => {
        keyManager.keys = [...keyManager.keys.slice(0, index), keyManager.id, ...keyManager.keys.slice(index)];
        keyManager.id += 1;
        return formMutators['insert'](name, index, value);
      },
      move: (from: number, to: number) => {
        // console.log('movemovemovemove1', from, to, keyManager.keys);
        keyManager.keys = __move(keyManager.keys, from, to);
        // console.log('movemovemovemove2', from, to, keyManager.keys);
        return formMutators['move'](name, from, to);
      },
      update: (index: number, value: FieldValue) => {
        return formMutators['update'](name, index, value);
      },
      // 移除最后一个
      pop: () => {
        keyManager.keys = keyManager.keys.slice(0, keyManager.keys.length - 1);
        return formMutators['pop'](name);
      },
      push: (value: FieldValue) => {
        keyManager.keys = [...keyManager.keys, keyManager.id];
        keyManager.id += 1;
        // form.pauseValidation();
        const result = formMutators['push'](name, value);
        // form.resumeValidation();
        return result;
      },
      remove: (index: number) => {
        console.log('removeremoveremoveremove1',index,keyManager.keys)
        keyManager.keys = keyManager.keys.filter((_, keyIndex) => keyIndex !== index);
        console.log('removeremoveremoveremove2',index,keyManager.keys)
        return formMutators['remove'](name, index);
      },
      // 移除第一个
      shift: () => {
        keyManager.keys = keyManager.keys.slice(1);
        return formMutators['shift'](name);
      },
      // 交换
      swap: (indexA: number, indexB: number) => {
        const copy = [...(keyManager.keys || [])];
        const a = copy[indexA];
        copy[indexA] = copy[indexB];
        copy[indexB] = a;
        keyManager.keys = copy;

        return formMutators['swap'](name, indexA, indexB);
      },
      // insert to start
      unshift: (value: FieldValue) => {
        keyManager.keys = [keyManager.id, ...keyManager.keys];
        keyManager.id += 1;

        return formMutators['unshift'](name, value);
      },
    };

    // // curry the field name onto all mutator calls
    // return Object.keys(formMutators).reduce(
    //   (result, key) => {
    //     result[key] = (...args) => formMutators[key](name, ...args);
    //     return result;
    //   },
    //   {} as {
    //     insert: (index: number, value: FieldValue) => void;
    //     move: (from: number, to: number) => void;
    //     update: (index: number, value: FieldValue) => void;
    //     pop: () => FieldValue;
    //     push: (value: FieldValue) => void;
    //     remove: (index: number) => FieldValue;
    //     shift: () => FieldValue;
    //     swap: (indexA: number, indexB: number) => void;
    //     unshift: (value: FieldValue) => void;
    //   }
    // );
  });

  const validate: FieldValidator<FieldValue[]> = useConstant(() => (value, allValues, meta) => {
    if (!validateProp) return undefined;
    const error = validateProp(value as any, allValues, meta);
    if (!error || Array.isArray(error)) {
      return error;
    } else {
      const arrayError = [];
      // gross, but we have to set a string key on the array
      (arrayError as any)[ARRAY_ERROR] = error;
      return arrayError;
    }
  });

  const {
    meta: { length, ...meta },
    input,
    ...fieldState
  } = useField(name, {
    subscription: { ...subscription, length: true },
    defaultValue,
    initialValue,
    isEqual,
    validate,
    data,
    format: (v) => v,
    validateFields,
  });

  const forEach = (iterator: (name: string, index: number) => void): void => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0;
    for (let i = 0; i < len; i++) {
      iterator(`${name}[${i}]`, i);
    }
  };

  const map = (iterator: ({ key, name }: { key: React.Key; name: string }, index: number) => any): any[] => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0;
    const results: any[] = [];
    for (let i = 0; i < len; i++) {
      results.push(iterator({ name: `${name}[${i}]`, key: keyManager.keys[i] }, i));
    }
    return results;
  };

  return {
    fields: {
      name,
      forEach,
      length: length || 0,
      map,
      ...mutators,
      ...fieldState,
      value: input.value,
    },
    meta,
  };
};

export default useFieldArray;
