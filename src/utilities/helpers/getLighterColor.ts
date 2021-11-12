function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLighterColor(color: string, percent: number = 0.4): string {
  const rgb = hexToRgb(color);
  return rgb && `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${percent})`;
  // percent = Math.round(percent * 5) / 5;
  // return color + HEX_OPACITY[percent];
}
