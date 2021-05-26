export const getExtention = (uri: string) => {
  const length = uri.lastIndexOf('.'); // 拡張子の有無。なければ-1が返される
  const ext = length !== -1 ? uri.slice(length + 1) : null; // あれば拡張子('.'以降)を取得

  return ext;
};
