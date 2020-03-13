import dayjs from 'dayjs';
import Translator from '../util/translator';

let colorArray = [
    '#ff6384aa',
    '#ff9f40aa',
    '#9966ffaa',
    '#4bc0c0aa',
    '#dbf2f2',
    '#ffcd56',
    '#109618aa',
    '#990099aa',
    '#0099c6aa',
    '#dd4477aa',
    '#66aa00aa',
    '#b82e2eaa',
    '#316395aa',
    '#3366ccaa',
    '#994499aa',
    '#22aa99aa',
    '#aaaa11aa',
    '#6633ccaa',
    '#e67300aa',
    '#8b0707aa',
    '#651067aa',
    '#329262aa',
    '#5574a6aa',
    '#3b3eacaa',
    '#b77322aa',
    '#16d620aa',
    '#b91383aa',
    '#f4359eaa',
    '#9c5935aa',
    '#a9c413aa',
    '#2a778daa',
    '#668d1caa',
    '#bea413aa',
    '#0c5922aa',
    '#743411aa',
];

export default class ChartDataBuilder {
    static getInfectionByRegionConfig(infectionsByRegion) {
        // Remove empty entries
        let labelsWithCounts = [];
        for (let region of infectionsByRegion) {
            if (region.count === 0) {
                continue;
            }
            labelsWithCounts.push(`${region.region} ${region.count} kpl`);
        }
        return {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: infectionsByRegion.map(reg => reg.count),
                        backgroundColor: infectionsByRegion.map((_ignore, i) => colorArray[i]),
                    },
                ],
                labels: labelsWithCounts,
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 1.25 : 0.5,
                title: {
                    fontSize: 18,
                    display: true,
                    text: Translator.get('infections_by_health_case_district'),
                },
                legend: {
                    position: window.innerWidth > 720 ? 'right' : 'bottom',
                    align: 'start',
                    labels: {
                        fontSize: 18,
                    },
                },
            },
        };
    }
    static getInfectionSourceCountryChart(sourceCountries) {
        let labelsWithCounts = [];
        for (let country of sourceCountries) {
            labelsWithCounts.push(
                `${country.name != null && country.name.length > 0 ? country.name : Translator.get('unknown')} ${
                    country.count
                } ${Translator.get('pcs')}`
            );
        }
        return {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: sourceCountries.map(country => country.count),
                        backgroundColor: [...new Array(Object.keys(sourceCountries).length)].map(
                            (_ignore, i) => colorArray[i]
                        ),
                    },
                ],
                labels: labelsWithCounts,
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 2 : 0.75,
                title: {
                    fontSize: 18,
                    display: true,
                    text: Translator.get('infection_source_countries'),
                },
                legend: {
                    position: window.innerWidth > 720 ? 'right' : 'bottom',
                    labels: {
                        fontSize: 18,
                    },
                },
            },
        };
    }

    static getInfectionsByDayChart(infectionByDay, deathsByDay) {
        let dates = [...new Set([...Object.keys(infectionByDay), ...Object.keys(deathsByDay)])];
        let firstDay = dates[0];
        let lastDay = Date.now() / 1000 - 86400;
        let lastAddedDate = firstDay - 86400; // Reduce on day
        let labels = [];
        while (lastAddedDate <= lastDay) {
            lastAddedDate += 86400;
            labels.push(lastAddedDate);
        }
        let infectionsByDayData = [];
        let deathsByDayData = [];
        for (let label of labels) {
            infectionsByDayData.push(infectionByDay[label] ? infectionByDay[label] : 0);
            deathsByDayData.push(deathsByDay[label] ? deathsByDay[label] : 0);
        }
        return {
            type: 'bar',
            data: {
                labels: labels.map(label => dayjs(label * 1000).format('DD-MM-YYYY')),
                datasets: [
                    {
                        label: Translator.get('infected'),
                        data: infectionsByDayData,
                        backgroundColor: colorArray[0],
                    },
                    {
                        label: Translator.get('death_cases'),
                        data: Object.values(deathsByDay),
                        backgroundColor: colorArray[1],
                    },
                ],
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 1.5 : 0.75,
                title: {
                    display: true,
                    text: Translator.get('infections_and_death_cases_by_day'),
                    fontSize: 18,
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        fontSize: 18,
                    },
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            stacked: true,
                            ticks: {
                                maxTicksLimit: 10,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            stacked: true,
                        },
                    ],
                },
            },
        };
    }

    static getInfectionsSourcePercentage(infectionsBySourceCountry) {
        let finnishSources = 0;
        let foreignSources = 0;
        let unknownSource = 0;
        for (let source of infectionsBySourceCountry) {
            switch (source.name) {
                case 'FIN':
                    finnishSources += source.count;
                    break;
                case null:
                    unknownSource += source.count;
                    break;
                default:
                    foreignSources += source.count;
                    break;
            }
        }
        return {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [finnishSources, foreignSources, unknownSource],
                        backgroundColor: [colorArray[0], colorArray[1], colorArray[2]],
                    },
                ],
                labels: [
                    Translator.get('infections_originated_from_finland'),
                    Translator.get('infections_originated_from_foreign_countries'),
                    Translator.get('infections_originated_from_unknown_sources'),
                ],
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 2 : 0.75,
                title: {
                    fontSize: 18,
                    display: true,
                    text: Translator.get('infections_originated_from_finland_vs_other_sources'),
                },
                legend: {
                    position: window.innerWidth > 720 ? 'right' : 'bottom',
                    labels: {
                        fontSize: window.innerWidth > 720 ? 18 : 14,
                    },
                },
            },
        };
    }

    static getInfectionsByDayChartCumulative(infectionsByDay, recoveriesByDay, setDate) {
        let dates = [...new Set([...Object.keys(infectionsByDay)])];
        let firstDay = setDate ? setDate : dates[0];
        let lastDay = Date.now() / 1000 - 86400;
        let lastAddedDate = firstDay - 86400; // Reduce on day
        let labels = [];
        while (lastAddedDate <= lastDay) {
            lastAddedDate += 86400;
            labels.push(lastAddedDate);
        }
        let infectionsByDayData = [];
        let recoveriesByDayData = [];

        let totalInfected = 0;
        let totalRecovered = 0;
        if (setDate) {
            let datesBeforeFirstDay = [...Object.keys(infectionsByDay), ...Object.keys(recoveriesByDay)].filter(
                date => date < firstDay
            );
            for (let date of datesBeforeFirstDay) {
                totalInfected += infectionsByDay[date] ? infectionsByDay[date] : 0;
                totalRecovered += recoveriesByDay[date] ? recoveriesByDay[date] : 0;
            }
        }
        for (let label of labels) {
            totalInfected += infectionsByDay[label] ? infectionsByDay[label] : 0;
            totalRecovered += recoveriesByDay[label] ? recoveriesByDay[label] : 0;

            let currentInfectedCount = totalInfected - totalRecovered;
            if (currentInfectedCount < 0) {
                currentInfectedCount = 0;
            }
            infectionsByDayData.push(currentInfectedCount);
            recoveriesByDayData.push(totalRecovered);
        }
        return {
            type: 'line',
            data: {
                labels: labels.map(label => dayjs(label * 1000).format('DD-MM-YYYY')),
                datasets: [
                    {
                        label: Translator.get('infection_count_cumulative'),
                        data: infectionsByDayData,
                        backgroundColor: colorArray[0],
                        fill: 'start',
                    },
                    {
                        label: Translator.get('recovered_count_cumulative'),
                        data: recoveriesByDayData,
                        backgroundColor: colorArray[25],
                        fill: '-1',
                    },
                ],
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 2.5 : 1,
                title: {
                    display: true,
                    text: [Translator.get('infection_count_cumulative'), Translator.get('recovered_count_cumulative')],
                    fontSize: 16,
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: window.innerWidth > 720 ? 40 : 30,
                        fontSize: window.innerWidth > 720 ? 18 : 14,
                    },
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            stacked: false,
                            ticks: {
                                maxTicksLimit: 10,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            stacked: true,
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: totalInfected * 1.2,
                            },
                        },
                    ],
                },
            },
        };
    }
}
