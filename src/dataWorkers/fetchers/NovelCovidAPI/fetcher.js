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
      const url = this.endpoints.countryStats.replace("{countries}", isoCodes.join(","));

      // Today's stats first.
      let response = await fetch(url);
      let data = await response.json();

      if (data) {
        countryStats.today = {};
        data.forEach((element) => {
          countryStats.today[element.countryInfo.iso2.toLowerCase()] = {
            updated: element.updated,
            country: element.country,
            countryInfo: {
              iso2: element.countryInfo.iso2,
              iso3: element.countryInfo.iso3,
              lat: element.countryInfo.lat,
              long: element.countryInfo.long,
            },
            cases: element.cases,
            todayCases: element.todayCases,
            deaths: element.deaths,
            todayDeaths: element.todayDeaths,
            recovered: element.recovered,
            active: element.active,
            critical: element.critical,
            casesPerOneMillion: element.casesPerOneMillion,
            deathsPerOneMillion: element.deathsPerOneMillion,
            tests: element.tests,
            testsPerOneMillion: element.testsPerOneMillion,
          };
        });
      }

      // Now for yesterday's stats.
      response = await fetch(`${url}?yesterday=true`);
      data = await response.json();

      if (data) {
        countryStats.yesterday = {};
        data.forEach((element) => {
          countryStats.yesterday[element.countryInfo.iso2.toLowerCase()] = {
            updated: element.updated,
            country: element.country,
            countryInfo: {
              iso2: element.countryInfo.iso2,
              iso3: element.countryInfo.iso3,
              lat: element.countryInfo.lat,
              long: element.countryInfo.long,
            },
            cases: element.cases,
            todayCases: element.todayCases,
            deaths: element.deaths,
            todayDeaths: element.todayDeaths,
            recovered: element.recovered,
            active: element.active,
            critical: element.critical,
            casesPerOneMillion: element.casesPerOneMillion,
            deathsPerOneMillion: element.deathsPerOneMillion,
            tests: element.tests,
            testsPerOneMillion: element.testsPerOneMillion,
          };
        });
      }

      // Let's handle Puerto Rico and USVI now.
      const url2 = `${this.endpoints.statesStats}/Puerto%20Rico,United%20States%20Virgin%20Islands`;
      response = await fetch(url2);
      data = await response.json();

      if (data) {
        countryStats.today.pr = {
          country: data[0].state,
          countryInfo: {
            iso2: "PR",
            iso3: "PRI",
          },
          cases: data[0].cases,
          todayCases: data[0].todayCases,
          deaths: data[0].deaths,
          todayDeaths: data[0].todayDeaths,
          active: data[0].active,
          tests: data[0].tests,
          testsPerOneMillion: data[0].testsPerOneMillion,
        };
        countryStats.today.vi = {
          country: data[1].state,
          countryInfo: {
            iso2: "VI",
            iso3: "VIR",
          },
          cases: data[1].cases,
          todayCases: data[1].todayCases,
          deaths: data[1].deaths,
          todayDeaths: data[1].todayDeaths,
          active: data[1].active,
          tests: data[1].tests,
          testsPerOneMillion: data[1].testsPerOneMillion,
        };
      }

      response = await fetch(`${url2}?yesterday=true`);
      data = await response.json();

      if (data) {
        countryStats.yesterday.pr = {
          country: data[0].state,
          countryInfo: {
            iso2: "PR",
            iso3: "PRI",
          },
          cases: data[0].cases,
          todayCases: data[0].todayCases,
          deaths: data[0].deaths,
          todayDeaths: data[0].todayDeaths,
          active: data[0].active,
          tests: data[0].tests,
          testsPerOneMillion: data[0].testsPerOneMillion,
        };
        countryStats.yesterday.vi = {
          country: data[1].state,
          countryInfo: {
            iso2: "VI",
            iso3: "VIR",
          },
          cases: data[1].cases,
          todayCases: data[1].todayCases,
          deaths: data[1].deaths,
          todayDeaths: data[1].todayDeaths,
          active: data[1].active,
          tests: data[1].tests,
          testsPerOneMillion: data[1].testsPerOneMillion,
        };
      }
    } catch (error) {
      console.error(error);
    }

    return countryStats;
  }
};
