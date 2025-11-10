import * as json from '../../translation/english.json';

export type JsonKeys = keyof typeof json;

export interface IGeneralResponsePromise {
  data: any;
  message: string;
  toast: boolean;
}

export interface IReturnData {
  data: any;
  message: string;
  toast: boolean;
  values: IGeneralResponsePromise;
}
