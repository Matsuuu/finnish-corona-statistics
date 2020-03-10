const fetch = require('node-fetch');
const fs = require('fs');

const apiUrl = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';
const fileName = 'corona-data.json';
const filePath = '../';

class DataGatherer {
    static async gatherData() {
        let data = await fetch(apiUrl).then(res => res.json());
        fs.writeFile(filePath + fileName, JSON.stringify(data), err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(data);
        });
    }
}

DataGatherer.gatherData();
