export const headers = (token: string) => ({
  headers: {
    Authorization: 'Bearer ' + token,
  },
});

// headersの名前違う版
export const addBearer = (token: string) => ({
  headers: {
    Authorization: 'Bearer ' + token,
  },
});
