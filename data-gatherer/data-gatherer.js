const fetch = require('node-fetch');
const fs = require('fs');
const dayjs = require('dayjs');

const apiUrl = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';
const fileName = 'corona-data.json';
const filePath = '../';

const globalDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{date}.csv';
const globalFileName = 'global-corona-data.json';
const globalFilePath = '../';

class DataGatherer {
    static async gatherFinnishData() {
        let data = await fetch(apiUrl).then(res => res.json());
        fs.writeFile(filePath + fileName, JSON.stringify(data), err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(data);
        });
    }

    static async gatherGlobalData() {
        let today = dayjs(new Date()).format('MM-DD-YYYY');
        let response = await fetch(globalDataUrl.replace('{date}', today));
        if (!response.ok) {
            console.log('No post for today yet, exiting...');
            return;
        }
        let data = await response.text();
        let jsonData = DataGatherer.csvToJson(data);

        fs.writeFile(globalFilePath + globalFileName, JSON.stringify(jsonData), err => {
            if (err) {
                console.log(err);
                return;
            }
            //console.log(jsonData);
        });
    }

    static csvToJson(data) {
        let headers = [];
        let jsonData = {};
        let rowSeperatedData = data.split('\n');
        for (let header of rowSeperatedData[0].split(',')) {
            header = header
                .toLowerCase()
                .replace('/', '_or_')
                .replace(' ', '_');
            headers.push(header);
        }
        for (let row = 1; row < rowSeperatedData.length - 1; row++) {
            let jsonDataObject = {};
            let commaSeperatedData = rowSeperatedData[row].split(',');
            for (let h = 0; h < headers.length; h++) {
                jsonDataObject[headers[h]] = commaSeperatedData[h];
            }
            let country = jsonDataObject.country_or_region;
            if (!jsonData[country]) {
                jsonData[country] = {};
                jsonData[country].reports = [];
                jsonData[country].totalConfirmed = 0;
                jsonData[country].totalDeaths = 0;
                jsonData[country].totalRecovered = 0;
            }
            jsonData[country].reports.push(jsonDataObject);
            jsonData[country].totalConfirmed += Number(jsonDataObject.confirmed);
            jsonData[country].totalDeaths += Number(jsonDataObject.deaths);
            jsonData[country].totalRecovered += Number(jsonDataObject.recovered);
        }
        return jsonData;
    }
}

//DataGatherer.gatherFinnishData();
DataGatherer.gatherGlobalData();
