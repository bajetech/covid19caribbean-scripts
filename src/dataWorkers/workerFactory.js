const DataFetcher = require("./fetchers/NovelCovidAPI/fetcher").Covid19DataFetcher;
const DataUpdater = require("./updaters/dataUpdater").DataUpdater;

exports.WorkerFactory = class WorkerFactory {
  static getFetcher() {
    return new DataFetcher();
  }

  static getUpdater() {
    return new DataUpdater();
  }
};
