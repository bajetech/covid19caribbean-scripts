const caribbeanCountries = require("../fetchers/NovelCovidAPI/countries")
  .caribbeanCountries;

exports.DataUpdater = class DataUpdater {
  constructor() {
    this.collections = {
      totalStats: "total_stats",
      countryStats: "country_stats",
    };
  }

  async updateGlobalStats(totals, db) {
    if (totals) {
      const collection = db.collection(this.collections.totalStats);
      const todayStats = totals.today;
      const yesterdayStats = totals.yesterday;

      try {
        await collection.findOneAndUpdate(
          { type: "world", status: "today" },
          { $set: { ...todayStats } },
          { upsert: true }
        );

        await collection.findOneAndUpdate(
          { type: "world", status: "yesterday" },
          { $set: { ...yesterdayStats } },
          { upsert: true }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async updateCountryStats(stats, db) {
    if (stats) {
      try {
        const todayStats = stats.today;
        const yesterdayStats = stats.yesterday;
        const csCollection = db.collection(this.collections.countryStats);
        const tsCollection = db.collection(this.collections.totalStats);

        let todayCaribbeanTotalStats = {
          updated: 0,
          cases: 0,
          todayCases: 0,
          deaths: 0,
          todayDeaths: 0,
          recovered: 0,
          active: 0,
          critical: 0,
          tests: 0,
        };
        let yesterdayCaribbeanTotalStats = {
          updated: 0,
          cases: 0,
          todayCases: 0,
          deaths: 0,
          todayDeaths: 0,
          recovered: 0,
          active: 0,
          critical: 0,
          tests: 0,
        };

        for (let [key, value] of Object.entries(todayStats)) {
          this._tallyCaribbeanTotals(todayCaribbeanTotalStats, value);
          await csCollection.findOneAndUpdate(
            { countryCode: key, status: "today" },
            { $set: { ...value } },
            { upsert: true }
          );
        }

        for (let [key, value] of Object.entries(yesterdayStats)) {
          this._tallyCaribbeanTotals(yesterdayCaribbeanTotalStats, value);
          await csCollection.findOneAndUpdate(
            { countryCode: key, status: "yesterday" },
            { $set: { ...value } },
            { upsert: true }
          );
        }

        let isoCodes = [];
        caribbeanCountries.forEach((element) => {
          isoCodes.push(element.isoCode);
        });

        const countriesTracked = isoCodes.join(",");

        await tsCollection.findOneAndUpdate(
          { type: "caribbean", status: "today" },
          { $set: { ...todayCaribbeanTotalStats, countriesTracked } },
          { upsert: true }
        );

        await tsCollection.findOneAndUpdate(
          { type: "caribbean", status: "yesterday" },
          { $set: { ...yesterdayCaribbeanTotalStats, countriesTracked } },
          { upsert: true }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  _tallyCaribbeanTotals(t, current) {
    if (current.updated && current.updated > t.updated) {
      t.updated = current.updated;
    }

    t.cases += current.cases;
    t.todayCases += current.todayCases;
    t.deaths += current.deaths;
    t.todayDeaths += current.todayDeaths;

    if (current.recovered) {
      t.recovered += current.recovered;
    } else {
      t.recovered += current.cases - current.active - current.deaths;
    }

    t.active += current.active;
    if (current.critical) {
      t.critical += current.critical;
    }

    t.tests += current.tests;
  }
};
