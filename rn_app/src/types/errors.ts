export type ApiError =
  | {errorType: 'invalidError'; message: string; alertDialog: boolean}
  | {errorType: 'loginError'}
  | {errorType: 'someError'};
