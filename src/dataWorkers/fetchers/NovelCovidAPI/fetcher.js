const fetch = require("node-fetch");
const caribbeanCountries = require("./countries").caribbeanCountries;

exports.Covid19DataFetcher = class Covid19DataFetcher {
  constructor() {
    this.endpoints = {
      globalStats: "https://corona.lmao.ninja/v2/all",
      countryStats: "https://corona.lmao.ninja/v2/countries/{countries}",
      statesStats: "https://corona.lmao.ninja/v2/states",
    };
  }

  async fetchGlobalStats() {
    let globalStats = { today: null, yesterday: null };
    try {
      // Get today's stats first.
      let response = await fetch(this.endpoints.globalStats);
      globalStats.today = await response.json();

      // Now for yesterday's stats.
      response = await fetch(`${this.endpoints.globalStats}?yesterday=true`);
      globalStats.yesterday = await response.json();
    } catch (error) {
      console.error(error);
    }

    return globalStats;
  }

  async fetchCountryStats() {
    let isoCodes = [];
    caribbeanCountries.forEach((element) => {
      // NOTE: Puerto Rico and USVI stats are not provided by the countries endpoint.
      // So we'll treat those specially later.
      if (element.isoCode !== "PR" && element.isoCode !== "VI") {
        isoCodes.push(element.isoCode);
      }
    });

    let countryStats = { today: null, yesterday: null };
    try {
      const url = this.endpoints.countryStats.replace(
        "{countries}",
        isoCodes.join(",")
      );

      // Today's stats first.
      let response = await fetch(url);
      let data = await response.json();

      if (data) {
        countryStats.today = {};
        data.forEach((element) => {
          countryStats.today[element.countryInfo.iso2.toLowerCase()] = element;
        });
      }

      // Now for yesterday's stats.
      response = await fetch(`${url}?yesterday=true`);
      data = await response.json();

      if (data) {
        countryStats.yesterday = {};
        data.forEach((element) => {
          countryStats.yesterday[
            element.countryInfo.iso2.toLowerCase()
          ] = element;
        });
      }

      // Let's handle Puerto Rico and USVI now.
      const url2 = `${this.endpoints.statesStats}/Puerto%20Rico,United%20States%20Virgin%20Islands`;
      response = await fetch(url2);
      data = await response.json();

      if (data) {
        countryStats.today.pr = data[0];
        countryStats.today.vi = data[1];
      }

      response = await fetch(`${url2}?yesterday=true`);
      data = await response.json();

      if (data) {
        countryStats.yesterday.pr = data[0];
        countryStats.yesterday.vi = data[1];
      }
    } catch (error) {
      console.error(error);
    }

    return countryStats;
  }
};
