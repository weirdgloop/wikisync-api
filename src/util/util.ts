export const isBitSet = (bitmap, index) => {
  if (bitmap === undefined) {
    return null;
  }
  return !!(bitmap & (1 << index));
};

export const isEqual = (varp, val) => {
  if (varp === undefined) {
    return null;
  }
  return varp === val;
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = Buffer.from(base64, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

/**
 * Returns a base64 encoded version of the union of the underlying binary data of str1 and str2
 * @param str1 - base64 encoded string containing binary data
 * @param str2 - base64 encoded string containing binary data
 * @returns Union of the binary data, encoded in base64
 */
export const base64Union = (str1: string, str2: string) => {
  const bytes1 = base64ToUint8Array(str1);
  const bytes2 = base64ToUint8Array(str2);

  const maxLength = Math.max(bytes1.length, bytes2.length);
  const resultBytes = new Uint8Array(maxLength).map((_, i) => (bytes1[i] || 0) | (bytes2[i] || 0));

  const result = Buffer.from(resultBytes).toString('base64');
  return result;
};
