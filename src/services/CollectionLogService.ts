class CollectionLogService {
  public static async getCollectionLogData(data) {
    return data.collectionLog ?? "";
  }
}

export { CollectionLogService };
