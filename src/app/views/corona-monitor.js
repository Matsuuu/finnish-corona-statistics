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
            apiData: { type: Object },
        };
    }

    static get styles() {
        return [styles];
    }

    constructor() {
        super();
        this.apiUrl = '/corona-data.json';
    }

    firstUpdated(_changedProperties) {
        this.getApiData();
    }

    async getApiData() {
        this.apiData = await fetch(this.apiUrl).then(res => res.json());
        console.log(this.apiData);

        this.renderElements();
    }

    renderElements() {
        let infectionsByRegion = ChartDataParser.getInfectionsByRegion(this.apiData);
        let infectionsBySourceCountry = ChartDataParser.getInfectionsBySourceCountry(this.apiData);
        let infectionsByDay = ChartDataParser.getInfectionsByDay(this.apiData);
        let recoveredByDay = ChartDataParser.getRecoveriesByDay(this.apiData);
        let deathsByDay = ChartDataParser.getDeathsByDay(this.apiData);
        let mortalityData = ChartDataParser.getMortalityRate(this.apiData);
        this.createRegionalInfectionChart(infectionsByRegion);
        this.createSourceCountryChart(infectionsBySourceCountry);
        this.createInfectionsCumulativeChart(infectionsByDay, recoveredByDay);
        this.createInfectionsByDayChart(infectionsByDay, deathsByDay);
        this.createMortalityRateNumber(mortalityData);
        this.createInfectionsSourcePercentageChart(infectionsBySourceCountry);
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
        ).toFixed(5)} %`;
        mortalityRateDiv.querySelector('h2').innerText = mortalityData.mortalityRate + '%';
    }

    createInfectionsSourcePercentageChart(infectionsBySourceCountry) {
        let chartConfig = ChartDataBuilder.getInfectionsSourcePercentage(infectionsBySourceCountry);
        let ctx = this.shadowRoot.querySelector('#infections-source-country-percentages-chart-area').getContext('2d');
        new Chart(ctx, chartConfig);
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
                    <h2></h2>
                </div>
                <div class="numbers" id="recovered-count">
                    <p>Parantuneiden määrä</p>
                    <h2></h2>
                </div>
                <div class="numbers" id="infection-percentage">
                    <p>Tartunnan saaneiden %</p>
                    <h2></h2>
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
            </div>
            <div class="footer">
                <p>
                    Korona-info sisältää tietoa COVID-19 tartunnoista Suomessa. Korona-info päivittää tietonsa
                    tasatunnein.
                </p>
                <p>
                    Datan lähteenä toimii
                    <a href="https://github.com/HS-Datadesk/koronavirus-avoindata">Helsingin sanomien avoin data</a>
                </p>
                <a href="https://github.com/Matsuuu/finnish-corona-statistics/tree/master">GitHub</a>
                <a href="https://twitter.com/matsutuss">Twitter</a>
                <a href="https://www.linkedin.com/in/matias-huhta-b0b159106">LinkedIn</a>
            </div>
        `;
    }
}

if (!customElements.get('corona-monitor')) {
    customElements.define('corona-monitor', CoronaMonitor);
}
