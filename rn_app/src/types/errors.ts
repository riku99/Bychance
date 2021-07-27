export type ApiError =
  | {errorType: 'invalidError'; message: string}
  | {errorType: 'loginError'}
  | {errorType: 'someError'};
