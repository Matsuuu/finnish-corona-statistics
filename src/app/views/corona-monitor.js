import { LitElement, html, css } from 'lit-element';
import { CountryDataService } from '../services/country-data-service';
import dayjs from 'dayjs';
import ChartDataBuilder from '../services/chart-data-builder';
import Chart from 'chart.js';

class CoronaMonitor extends LitElement {
    static get properties() {
        return {
            apiUrl: { type: String },
            apiData: { type: Object },
        };
    }

    static get styles() {
        return [
            css`
                :host {
                    font-family: 'Roboto', sans-serif;
                }
                .data-wrapper {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                .data-wrapper > div {
                    flex-basis: 45%;
                    margin-bottom: 5%;
                }

                .data-wrapper > .numbers {
                    flex-basis: 22.5%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                .data-wrapper > .numbers > h2 {
                    font-size: 4rem;
                }
                .data-wrapper > .numbers > p {
                    font-size: 1.4rem;
                }

                @media only screen and (max-width: 780px) {
                    .data-wrapper > div {
                        flex-basis: 100%;
                        margin-bottom: 5%;
                    }

                    .data-wrapper > .numbers {
                        flex-basis: 100%;
                    }
                }

                @media only screen and (min-width: 1680px) {
                    .data-wrapper {
                        margin: 0 10%;
                    }
                }
            `,
        ];
    }

    constructor() {
        super();
        this.apiUrl = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';
    }

    firstUpdated(_changedProperties) {
        this.getApiData();
    }

    async getApiData() {
        this.apiData = await fetch(this.apiUrl).then(res => res.json());

        let infectionsByRegion = this.getInfectionsByRegion();
        let infectionsBySourceCountry = this.getInfectionsBySourceCountry();
        let infectionsByDay = this.getInfectionsByDay();
        let deathsByDay = this.getDeathsByDay();
        let mortalityData = this.getMortalityRate();
        this.createRegionalInfectionChart(infectionsByRegion);
        this.createSourceCountryChart(infectionsBySourceCountry);
        this.createInfectionsByDayChart(infectionsByDay, deathsByDay);
        this.createMortalityRateNumber(mortalityData);
    }

    getInfectionsByRegion() {
        let regions = CountryDataService.getRegionPopulations();
        let infectionsByRegion = {};
        for (let region of Object.keys(regions)) {
            infectionsByRegion[region] = this.apiData.confirmed.filter(
                confirmedCase => confirmedCase.healthCareDistrict === region
            ).length;
        }
        return infectionsByRegion;
    }

    getInfectionsBySourceCountry() {
        let infectionsBySourceCountry = {};
        let infectionCountries = new Set(
            this.apiData.confirmed.map(confirmedCase => confirmedCase.infectionSourceCountry)
        );
        for (let infectionCountry of infectionCountries) {
            infectionsBySourceCountry[infectionCountry] = this.apiData.confirmed.filter(
                confirmedCase => confirmedCase.infectionSourceCountry === infectionCountry
            ).length;
        }
        return infectionsBySourceCountry;
    }

    getInfectionsByDay() {
        let infectionsByDay = {};
        let infectionDates = new Set(this.apiData.confirmed.map(confirmedCase => confirmedCase.date));
        for (let infectionDate of infectionDates) {
            let formattedDate = dayjs(infectionDate).format('DD-MM-YYYY');
            if (!infectionsByDay[formattedDate]) {
                infectionsByDay[formattedDate] = 0;
            }
            infectionsByDay[formattedDate] += this.apiData.confirmed.filter(
                confirmedCase => confirmedCase.date === infectionDate
            ).length;
        }
        return infectionsByDay;
    }

    getDeathsByDay() {
        let infectionsByDay = {};
        let infectionDates = new Set(this.apiData.deaths.map(deathCase => deathCase.date));
        for (let infectionDate of infectionDates) {
            let formattedDate = dayjs(infectionDate).format('DD-MM-YYYY');
            if (!infectionsByDay[formattedDate]) {
                infectionsByDay[formattedDate] = 0;
            }
            infectionsByDay[formattedDate] += this.apiData.deaths.filter(
                deathCase => deathCase.date === infectionDate
            ).length;
        }
        return infectionsByDay;
    }

    getMortalityRate() {
        let confirmedCount = this.apiData.confirmed.length;
        let deathCount = this.apiData.deaths.length;
        let mortalityRate = confirmedCount > 0 && deathCount == 0 ? 0 : confirmedCount / deathCount;
        return { confirmedCount, deathCount, mortalityRate };
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

    createMortalityRateNumber(mortalityData) {
        let infectionCountDiv = this.shadowRoot.querySelector('#infection-count');
        let mortalityRateDiv = this.shadowRoot.querySelector('#mortality-rate');

        infectionCountDiv.querySelector('h2').innerText = mortalityData.confirmedCount;
        mortalityRateDiv.querySelector('h2').innerText = mortalityData.mortalityRate + '%';
    }

    render() {
        return html`
            <h1>Corona-info</h1>
            <div class="data-wrapper">
                <div id="infections-by-region">
                    <canvas id="infections-by-region-chart-area"></canvas>
                </div>
                <div id="infection-source-countries">
                    <canvas id="infection-source-countries-chart-area"></canvas>
                </div>
                <div id="infections-by-day">
                    <canvas id="infections-by-day-chart-area"></canvas>
                </div>
                <div class="numbers" id="infection-count">
                    <p>Tartuntojen määrä</p>
                    <h2></h2>
                </div>

                <div class="numbers" id="mortality-rate">
                    <p>Kuolleisuusprosentti</p>
                    <h2></h2>
                </div>
            </div>
        `;
    }
}

if (!customElements.get('corona-monitor')) {
    customElements.define('corona-monitor', CoronaMonitor);
}
