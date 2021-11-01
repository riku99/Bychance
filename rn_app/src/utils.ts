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

export const getTimeDiff = (timestamp: string) => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diff = now.getTime() - createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};

export const getResizeMode = ({
  width,
  height,
}: {
  width?: number | null;
  height?: number | null;
}) => {
  if (width && height && width >= height) {
    return 'contain';
  } else {
    return 'cover';
  }
};
