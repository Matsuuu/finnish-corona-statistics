import dayjs from 'dayjs';

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
            labelsWithCounts.push(`${region.region} ${region.count}`);
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
                aspectRatio: window.innerWidth > 720 ? 1.5 : 0.75,
                title: {
                    fontSize: 18,
                    display: true,
                    text: 'Tartuntojen määrä sairaanhoitopiireittäin',
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
        for (let country of Object.keys(sourceCountries)) {
            labelsWithCounts.push(`${country} ${sourceCountries[country]}`);
        }
        return {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: Object.values(sourceCountries),
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
                    text: 'Tartuntojen lähdemaat',
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
                        label: 'Sairastumiset',
                        data: infectionsByDayData,
                        backgroundColor: colorArray[0],
                    },
                    {
                        label: 'Kuolemantapaukset',
                        data: Object.values(deathsByDay),
                        backgroundColor: colorArray[1],
                    },
                ],
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 1.5 : 0.75,
                title: {
                    display: true,
                    text: 'Sairastumiset ja kuolontapaukset päivittäin',
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
        for (let source of Object.keys(infectionsBySourceCountry)) {
            if (source === 'FIN') {
                finnishSources += infectionsBySourceCountry[source];
            } else {
                foreignSources += infectionsBySourceCountry[source];
            }
        }
        return {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [finnishSources, foreignSources],
                        backgroundColor: [colorArray[0], colorArray[1]],
                    },
                ],
                labels: ['Suomesta lähtöisin olevat tartunnat', 'Ulkomailta lähtöisin olevat tartunnat'],
            },
            options: {
                aspectRatio: window.innerWidth > 720 ? 2 : 0.75,
                title: {
                    fontSize: 18,
                    display: true,
                    text: 'Suomesta vs Ulkomailta lähtöisin olleet tartunnat',
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
}
