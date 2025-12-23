import type { LoaderFunction } from 'react-router';

declare global {
  export type Primitive = string | number | boolean;

  export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends
    | Response
    | infer D
    ? D
    : never;
}

export {};
