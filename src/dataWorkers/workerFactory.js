const DataFetcher = require("./fetchers/NovelCovidAPI/fetcher")
  .Covid19DataFetcher;

exports.WorkerFactory = class WorkerFactory {
  static getFetcher() {
    return new DataFetcher();
  }
};
