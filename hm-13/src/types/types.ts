import { Request } from 'express';

export type RequestWithBody<T> = Request<unknown, unknown, T>;
export type RequestWithQuery<T> = Request<unknown, unknown, unknown, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndQuery<T, B> = Request<T, unknown, unknown, B>;
export type RequestWithParamsAndBodyAndUserId<
  P,
  B,
  U extends Record<string, any>,
> = Request<P, unknown, B, unknown, U>;
export type RequestWithParamsAndUserId<
  T,
  U extends Record<string, any>,
> = Request<T, unknown, unknown, unknown, U>;
export type RequestWithParamsAndBody<T, B> = Request<T, unknown, B>;
