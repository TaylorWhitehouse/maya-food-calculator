// Background for a range slider: the part left of the thumb is filled, the rest is plain track
export function sliderFill(value, min, max, fill = 'var(--ink)', track = 'var(--white)') {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, ${fill} ${pct}%, ${track} ${pct}%)`;
}
