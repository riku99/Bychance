export const getExtention = (uri?: string) => {
  if (!uri) {
    return;
  }

  const length = uri.lastIndexOf('.'); // 拡張子の有無。なければ-1が返される
  const ext = length !== -1 ? uri.slice(length + 1) : null; // あれば拡張子('.'以降)を取得

  return ext;
};

// urlとかの拡張子を除いた部分をとる
export const removeExtention = (str: string) => {
  return str.replace(/\.[^/.]+$/, '');
};

export const formatAddress = (addr: string) => {
  return addr
    .replace(/^日本、/, '')
    .replace(/〒\d+-\d+/, '')
    .trim();
};

export const formatMinutes = (n: number) => {
  const len = n.toString().length;
  if (len === 1) {
    if (n === 0) {
      return '00';
    } else {
      return `0${n}`;
    }
  } else {
    return n;
  }
};
