export const headers = (token: string) => ({
  headers: {
    Authorization: 'Bearer ' + token,
  },
});
