const WorkerFactory = require("../dataWorkers/workerFactory").WorkerFactory;

exports.handler = async () => {
  const fetcher = WorkerFactory.getFetcher();

  // Sync global total stats first.
  const globalStats = await fetcher.fetchGlobalStats();
  console.log("Global Stats:", globalStats);

  // Sync country stats now.
  const countryStats = await fetcher.fetchCountryStats();
  console.log("Country Stats:", countryStats);
};

if (process.env.DEV === "true") {
  exports.handler();
}
