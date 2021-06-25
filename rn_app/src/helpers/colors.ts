export const hsv2rgb = (h: number, s: number, v: number) => {
  // 引数処理
  h = (h < 0 ? 360 + (h % 360) : h % 360) / 60;
  s = s < 0 ? 0 : s > 1 ? 1 : s;
  v = v < 0 ? 0 : v > 1 ? 1 : v;

  // HSV to RGB 変換
  const c = [v, v, v],
    a = Math.floor(h),
    f = h - a;
  c[Math.floor(a / 2 + 2) % 3] *= 1 - s;
  c[(7 - a) % 3] *= 1 - s * (a % 2 ? f : 1 - f);
  for (let i in c) c[i] = Math.round(c[i] * 255);

  // 戻り値
  return {
    hex:
      '#' +
      ('00000' + ((c[0] << 16) | (c[1] << 8) | c[2]).toString(16)).slice(-6),
    rgb: c,
    r: c[0],
    g: c[1],
    b: c[2],
  };
};
