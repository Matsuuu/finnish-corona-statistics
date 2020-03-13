import { LitElement, html, css } from 'lit-element';
import { CountryDataService } from '../services/country-data-service';
import dayjs from 'dayjs';
import ChartDataBuilder from '../services/chart-data-builder';
import Chart from 'chart.js';
import coronaData from 'corona-data';
import ChartDataParser from '../services/chart-data-parser';
import styles from 'assets/styles/main-styles.js';

class CoronaMonitor extends LitElement {
    static get properties() {
        return {
            apiUrl: { type: String },
            globalApiUrl: { type: String },
            apiData: { type: Object },
            globalApiData: { type: Object },
            mortalityData: { type: Object },

            showAllCountriesInList: { type: Boolean },
        };
    }

    static get styles() {
        return [styles];
    }

    constructor() {
        super();
        this.apiUrl = '/corona-data.json';
        this.globalApiUrl = '/global-corona-data.json';
        this.apiData = null;
        this.globalApiData = null;
        this.showAllCountriesInList = false;
        this.finlandInfectedCount = 0;
    }

    firstUpdated(_changedProperties) {
        this.getApiData();
    }

    async getApiData() {
        this.apiData = await fetch(this.apiUrl).then(res => res.json());
        this.globalApiData = await fetch(this.globalApiUrl).then(res => res.json());
        console.log(this.globalApiData);
        this.renderElements();
    }

    renderElements() {
        let infectionsByRegion = ChartDataParser.getInfectionsByRegion(this.apiData);
        let infectionsBySourceCountry = ChartDataParser.getInfectionsBySourceCountry(this.apiData);
        let infectionsByDay = ChartDataParser.getInfectionsByDay(this.apiData);
        let recoveredByDay = ChartDataParser.getRecoveriesByDay(this.apiData);
        let deathsByDay = ChartDataParser.getDeathsByDay(this.apiData);
        let mortalityData = ChartDataParser.getMortalityRate(this.apiData);
        this.mortalityData = mortalityData;
        this.createRegionalInfectionChart(infectionsByRegion);
        this.createSourceCountryChart(infectionsBySourceCountry);
        this.createInfectionsCumulativeChart(infectionsByDay, recoveredByDay);
        this.createInfectionsByDayChart(infectionsByDay, deathsByDay);
        this.createMortalityRateNumber(mortalityData);
        this.createInfectionsSourcePercentageChart(infectionsBySourceCountry);
        this.createGlobalNumbers();
    }

    createRegionalInfectionChart(infectionsByRegion) {
        let chartConfig = ChartDataBuilder.getInfectionByRegionConfig(infectionsByRegion);
        let ctx = this.shadowRoot.querySelector('#infections-by-region-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
    }

    createSourceCountryChart(sourceCountries) {
        let chartConfig = ChartDataBuilder.getInfectionSourceCountryChart(sourceCountries);
        let ctx = this.shadowRoot.querySelector('#infection-source-countries-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
    }

    createInfectionsByDayChart(infectionByDay, deathsByDay) {
        let chartConfig = ChartDataBuilder.getInfectionsByDayChart(infectionByDay, deathsByDay);
        let ctx = this.shadowRoot.querySelector('#infections-by-day-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
    }

    createInfectionsCumulativeChart(infectionsByDay, recoveredByDay) {
        let chartConfig = ChartDataBuilder.getInfectionsByDayChartCumulative(infectionsByDay, recoveredByDay);
        let ctx = this.shadowRoot.querySelector('#infections-total-cumulative-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
    }

    createMortalityRateNumber(mortalityData) {
        let infectionCountDiv = this.shadowRoot.querySelector('#infection-count');
        let infectionPercentageDiv = this.shadowRoot.querySelector('#infection-percentage');
        let mortalityRateDiv = this.shadowRoot.querySelector('#mortality-rate');
        let recoveredCountDiv = this.shadowRoot.querySelector('#recovered-count');

        infectionCountDiv.querySelector('h2').innerText = mortalityData.confirmedCount;
        recoveredCountDiv.querySelector('h2').innerText = mortalityData.recoveredCount;
        infectionPercentageDiv.querySelector('h2').innerText = `${(
            (mortalityData.confirmedCount / CountryDataService.getFinlandsPopulation()) *
            100
        ).toFixed(5)}%`;
        mortalityRateDiv.querySelector('h2').innerText = `${mortalityData.mortalityRate}%`;
    }

    createInfectionsSourcePercentageChart(infectionsBySourceCountry) {
        let chartConfig = ChartDataBuilder.getInfectionsSourcePercentage(infectionsBySourceCountry);
        let ctx = this.shadowRoot.querySelector('#infections-source-country-percentages-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
    }

    createGlobalNumbers() {
        let globalConfirmed = 0;
        let globalRecovered = 0;
        let globalDeaths = 0;
        for (let countryKey of Object.keys(this.globalApiData)) {
            let country = this.globalApiData[countryKey];
            globalConfirmed += Number(country.totalConfirmed);
            globalRecovered += Number(country.totalRecovered);
            globalDeaths += Number(country.totalDeaths);
        }
        console.log({ globalConfirmed, globalRecovered, globalDeaths });

        let globalConfirmedDiv = this.shadowRoot.querySelector('#total-global-infections');
        let globalRecoveredDiv = this.shadowRoot.querySelector('#total-global-recovered');
        let globalDeathsDiv = this.shadowRoot.querySelector('#total-global-deaths');
        let globalActiveCasesDiv = this.shadowRoot.querySelector('#total-global-active');
        let globalClosedCasesDiv = this.shadowRoot.querySelector('#total-global-closed');
        let globalMortalityRateDiv = this.shadowRoot.querySelector('#global-mortality-rate');

        globalConfirmedDiv.querySelector('h2').innerText = globalConfirmed;
        globalRecoveredDiv.querySelector('h2').innerText = globalRecovered;
        globalDeathsDiv.querySelector('h2').innerText = globalDeaths;
        globalActiveCasesDiv.querySelector('h2').innerText = globalConfirmed - globalRecovered - globalDeaths;
        globalClosedCasesDiv.querySelector('h2').innerText = globalRecovered + globalDeaths;
        globalMortalityRateDiv.querySelector('h2').innerText =
            100 - ((globalDeaths / (globalRecovered + globalDeaths)) * 100).toFixed(2) + '%';
    }

    render() {
        return html`
            <div class="about-section">
                <h1>Korona-info</h1>
                <p>Korona-Info on luotu tarjoamaan ihmisille reaaliaikaista tietoa Korona-viruksen tilasta Suomessa</p>
            </div>
            <div class="data-wrapper">
                <h3>Koronavirus numeroina</h3>
                <div class="numbers" id="infection-count">
                    <p>Tartuntojen määrä</p>
                    <h2 class="confirmed-numbers"></h2>
                </div>
                <div class="numbers" id="recovered-count">
                    <p>Parantuneiden määrä</p>
                    <h2 class="recovered-numbers"></h2>
                </div>
                <div class="numbers" id="infection-percentage">
                    <p>Tartunnan saaneiden %</p>
                    <h2 class="deaths-numbers"></h2>
                </div>
                <div class="numbers" id="mortality-rate">
                    <p>Sairastuneista kuolleita %</p>
                    <h2></h2>
                </div>
                <h3>Tartuntojen määrä</h3>
                <div id="infections-by-region">
                    <canvas id="infections-by-region-chart-area"></canvas>
                </div>
                <div id="infections-by-day">
                    <canvas id="infections-by-day-chart-area"></canvas>
                </div>
                <div id="infections-total-cumulative">
                    <canvas id="infections-total-cumulative-chart-area"></canvas>
                </div>
                <h3>Tartuntojen lähde</h3>
                <div id="infection-source-countries">
                    <canvas id="infection-source-countries-chart-area"></canvas>
                </div>
                <div id="infections-source-country-percentages">
                    <canvas id="infections-source-country-percentages-chart-area"></canvas>
                </div>
                <h3>Globaaleja tilastoja</h3>
                <p>Data ei välttämättä ole samassa tahdissa Helsingin Sanomien datan kanssa</p>
                <div class="numbers global-numbers" id="total-global-infections">
                    <p>Tartuntojen määrä <br />(globaali)</p>
                    <h2 class="confirmed-numbers"></h2>
                </div>
                <div class="numbers global-numbers" id="total-global-recovered">
                    <p>Parantuneiden määrä <br />(globaali)</p>
                    <h2 class="recovered-numbers"></h2>
                </div>
                <div class="numbers global-numbers" id="total-global-deaths">
                    <p>Sairastuneista kuolleita <br />(globaali)</p>
                    <h2 class="deaths-numbers"></h2>
                </div>
                <div class="numbers global-numbers" id="total-global-active">
                    <p>Aktiivisia tapauksia <br />(globaali)</p>
                    <h2></h2>
                </div>
                <div class="numbers global-numbers" id="total-global-closed">
                    <p>Suljetut tapaukset <br />(globaali)</p>
                    <h2></h2>
                </div>
                <div class="numbers global-numbers" id="global-mortality-rate">
                    <p>Sairastuneiden eloonjäämisprosentti <br />(globaali)</p>
                    <h2 class="recovered-numbers"></h2>
                </div>
                <h3>Maat listattuna</h3>
                <p>
                    Vihreät nuolet kuvastavat maita, joissa arvo on Suomea suurempi, punainen maita joissa pienempi.
                </p>
                <div class="country-infection-numbers-list">
                    <div class="country-infection-statistics">
                        ${this.globalApiData
                            ? Object.keys(this.globalApiData).map((country, i) => {
                                  if (!this.showAllCountriesInList && i > 10) {
                                      return;
                                  }
                                  return html`
                                      <div class="country-infection-number-row">
                                          <p>${country}</p>
                                          <p class="confirmed-numbers">
                                              Sairastumiset: ${this.globalApiData[country].totalConfirmed}
                                              ${this.mortalityData.confirmedCount <
                                              this.globalApiData[country].totalConfirmed
                                                  ? html`
                                                        <i class="material-icons recovered-numbers"
                                                            >keyboard_arrow_up</i
                                                        >
                                                    `
                                                  : html`
                                                        ${this.mortalityData.confirmedCount ===
                                                        this.globalApiData[country].totalConfirmed
                                                            ? html`
                                                                  <span class="gray">=</span>
                                                              `
                                                            : html`
                                                                  <i class="material-icons confirmed-numbers"
                                                                      >keyboard_arrow_down</i
                                                                  >
                                                              `}
                                                    `}
                                          </p>
                                          <p class="recovered-numbers">
                                              Parantuneet: ${this.globalApiData[country].totalRecovered}
                                              ${this.mortalityData.recoveredCount <
                                              this.globalApiData[country].totalRecovered
                                                  ? html`
                                                        <i class="material-icons recovered-numbers"
                                                            >keyboard_arrow_up</i
                                                        >
                                                    `
                                                  : html`
                                                        ${this.mortalityData.recoveredCount ===
                                                        this.globalApiData[country].totalRecovered
                                                            ? html`
                                                                  <span class="gray">=</span>
                                                              `
                                                            : html`
                                                                  <i class="material-icons confirmed-numbers"
                                                                      >keyboard_arrow_down</i
                                                                  >
                                                              `}
                                                    `}
                                          </p>
                                          <p class="deaths-numbers">
                                              Kuolleet: ${this.globalApiData[country].totalDeaths}
                                              ${this.mortalityData.deathCount < this.globalApiData[country].totalDeaths
                                                  ? html`
                                                        <i class="material-icons recovered-numbers"
                                                            >keyboard_arrow_up</i
                                                        >
                                                    `
                                                  : html`
                                                        ${this.mortalityData.deathCount ===
                                                        this.globalApiData[country].totalDeaths
                                                            ? html`
                                                                  <span class="gray">=</span>
                                                              `
                                                            : html`
                                                                  <i class="material-icons confirmed-numbers"
                                                                      >keyboard_arrow_down</i
                                                                  >
                                                              `}
                                                    `}
                                          </p>
                                      </div>
                                  `;
                              })
                            : ''}
                    </div>
                    ${!this.showAllCountriesInList
                        ? html`
                              <div
                                  @click="${() => (this.showAllCountriesInList = true)}"
                                  class="country-infection-numbers-list-show-all-button"
                              >
                                  <p>. . .</p>
                              </div>
                          `
                        : ''}
                </div>
            </div>
            <div class="footer">
                <p>
                    Korona-info sisältää tietoa COVID-19 tartunnoista Suomessa. Korona-info päivittää tietonsa
                    tasatunnein.
                </p>
                <p>
                    Sumen datan lähteenä toimii
                    <a target="_blank" href="https://github.com/HS-Datadesk/koronavirus-avoindata"
                        >Helsingin sanomien avoin data</a
                    >
                </p>
                <p>
                    Globaalin datan lähteenä toimii
                    <a target="_blank" href="https://github.com/CSSEGISandData/COVID-19"
                        >Johns Hopkins University:n tarjoama data</a
                    >
                </p>
                <a target="_blank" href="https://github.com/Matsuuu/finnish-corona-statistics/tree/master">GitHub</a>
                <a target="_blank" href="https://twitter.com/matsutuss">Twitter</a>
                <a target="_blank" href="https://www.linkedin.com/in/matias-huhta-b0b159106">LinkedIn</a>
            </div>
        `;
    }
}

if (!customElements.get('corona-monitor')) {
    customElements.define('corona-monitor', CoronaMonitor);
}
