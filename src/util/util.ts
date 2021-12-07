// Taken from SO
export const createBinaryString = (nMask) => {
  // nMask must be between -2147483648 and 2147483647
  let nFlag = 0;
  let nShifted = nMask;
  let sMask = '';
  for (nFlag; nFlag < 32; nFlag++) {
    sMask += String(nShifted >>> 31);
    nShifted <<= 1;
  }
  return sMask;
};
