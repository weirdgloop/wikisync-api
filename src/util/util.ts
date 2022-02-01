// Taken from SO
export const isBitSet = (bitmap, index) => {
  return !!(bitmap & (1 << index))
};
