import { CountryDataService } from './country-data-service';
import dayjs from 'dayjs';

export default class ChartDataParser {
    static getInfectionsByRegion(apiData) {
        let regions = CountryDataService.getRegionPopulations();
        let infectionsByRegion = [];
        for (let region of Object.keys(regions)) {
            infectionsByRegion.push({
                region,
                count: apiData.confirmed.filter(confirmedCase => confirmedCase.healthCareDistrict === region).length,
            });
        }
        infectionsByRegion.sort((a, b) => b.count - a.count);
        return infectionsByRegion;
    }

    static getInfectionsBySourceCountry(apiData) {
        let infectionsBySourceCountry = [];
        let infectionCountries = new Set(apiData.confirmed.map(confirmedCase => confirmedCase.infectionSourceCountry));
        for (let infectionCountry of infectionCountries) {
            infectionsBySourceCountry.push({
                name: infectionCountry,
                count: apiData.confirmed.filter(
                    confirmedCase => confirmedCase.infectionSourceCountry === infectionCountry
                ).length,
            });
        }
        infectionsBySourceCountry.sort((a, b) => b.count - a.count);
        return infectionsBySourceCountry;
    }

    static getInfectionsByDay(apiData) {
        let infectionsByDay = {};
        let infectionDates = new Set(apiData.confirmed.map(confirmedCase => confirmedCase.date));
        for (let infectionDate of infectionDates) {
            let formattedDate = dayjs(infectionDate)
                .set('hour', 0)
                .set('minute', 0)
                .set('second', 0)
                .unix();
            if (!infectionsByDay[formattedDate]) {
                infectionsByDay[formattedDate] = 0;
            }
            infectionsByDay[formattedDate] += apiData.confirmed.filter(
                confirmedCase => confirmedCase.date === infectionDate
            ).length;
        }
        return infectionsByDay;
    }

    static getRecoveriesByDay(apiData) {
        let recoveriesByDay = {};
        let recoveryDates = new Set(apiData.recovered.map(recoveryCase => recoveryCase.date));
        for (let recoveryDate of recoveryDates) {
            let formattedDate = dayjs(recoveryDate)
                .set('hour', 0)
                .set('minute', 0)
                .set('second', 0)
                .unix();
            if (!recoveriesByDay[formattedDate]) {
                recoveriesByDay[formattedDate] = 0;
            }
            recoveriesByDay[formattedDate] += apiData.recovered.filter(
                recoveryCase => recoveryCase.date === recoveryDate
            ).length;
        }
        return recoveriesByDay;
    }

    static getDeathsByDay(apiData) {
        let deathsByDay = {};
        let deathDates = new Set(apiData.deaths.map(deathCase => deathCase.date));
        for (let infectionDate of deathDates) {
            let formattedDate = dayjs(infectionDate)
                .set('hour', 0)
                .set('minute', 0)
                .set('second', 0)
                .unix();
            if (!deathsByDay[formattedDate]) {
                deathsByDay[formattedDate] = 0;
            }
            deathsByDay[formattedDate] += apiData.deaths.filter(deathCase => deathCase.date === infectionDate).length;
        }
        return deathsByDay;
    }

    static getMortalityRate(apiData) {
        let confirmedCount = apiData.confirmed.length;
        let deathCount = apiData.deaths.length;
        let mortalityRate = confirmedCount > 0 && deathCount == 0 ? 0 : confirmedCount / deathCount;
        let recoveredCount = apiData.recovered.length;

        let todayMidnight = dayjs(new Date())
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0);
        let yesterdayMidnight = todayMidnight.subtract(1, 'day');
        let increaseToday = apiData.confirmed.filter(confirmedCase => dayjs(confirmedCase.date).isAfter(todayMidnight))
            .length;
        let increaseYesterday = apiData.confirmed.filter(confirmedCase => {
            let dateObj = dayjs(confirmedCase.date);
            return dateObj.isAfter(yesterdayMidnight) && dateObj.isBefore(todayMidnight);
        }).length;
        return { confirmedCount, deathCount, mortalityRate, recoveredCount, increaseToday, increaseYesterday };
    }
}
