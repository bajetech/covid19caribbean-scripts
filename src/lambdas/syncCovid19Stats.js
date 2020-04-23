const parse = require("mongodb-core").parseConnectionString;
const WorkerFactory = require("../dataWorkers/workerFactory").WorkerFactory;
const dbConnect = require("../utils/fns").dbConnect;

exports.handler = async () => {
  let client = null;
  let db;

  try {
    client = await dbConnect();
    const dbName = parse(process.env.DB_CONN_STR, () => {});
    db = client.db(dbName);
  } catch (error) {
    console.error(error);
    return;
  }

  const fetcher = WorkerFactory.getFetcher();
  const updater = WorkerFactory.getUpdater();

  // Sync global total stats first.
  const globalStats = await fetcher.fetchGlobalStats();
  await updater.updateGlobalStats(globalStats, db);

  // Sync country stats now.
  const countryStats = await fetcher.fetchCountryStats();
  await updater.updateCountryStats(countryStats, db);

  client.close();
};

if (process.env.DEV === "true") {
  exports.handler();
}
