type StringValuesType<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
}[keyof T];

type NumberValuesType<T> = {
  [K in keyof T]: T[K] extends number ? T[K] : never;
}[keyof T];

export type StringEnumsType<T> = `${StringValuesType<T>}`;

export type NumberEnumsType<T> = NumberValuesType<T>;

export type RequiredKeyType<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
