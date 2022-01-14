import * as React from 'react';
import type { FormApi } from 'final-form';
// import { FormValuesShape } from './types';
// export type FormValues = Record<string, any>;
// export type InitialFormValues = Partial<FormValues>;

export const ReactFinalFormContext = React.createContext<FormApi>({} as any);
