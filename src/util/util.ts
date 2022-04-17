export const isBitSet = (bitmap, index) => {
  if (bitmap === undefined) {
    return null;
  }
  return !!(bitmap & (1 << index))
};

export const isEqual = (varp, val) => {
  if (varp === undefined) {
    return null;
  }
  return varp === val
};
