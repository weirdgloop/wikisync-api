import { COLLECTION_LOG_ORDER } from "../constants";
import { base64ToUint8Array } from "../util/util";

class CollectionLogService {
  public static async getCollectionLogData(data) {
    if (data.collectionLog == null || data.collectionLog == "")
      return []

    // For each item in the manifest, check the bit
    const byteArray = base64ToUint8Array(data.collectionLog ?? "");
    const result = COLLECTION_LOG_ORDER.reduce((acc, itemId, idx) => {
      if ((byteArray[Math.floor(idx/8)] & 1 << (idx%8)) > 0)
        acc.push(itemId)
      return acc;
    }, [])

    return result;
  }
}

export { CollectionLogService };
