export class CountryDataService {
    // As per https://kuntaliitto.fi/sites/default/files/media/file/Ervat_Sairaanhoitopiirit2019.pdf
    static getRegionPopulations() {
        return {
            'Etelä-Karjala': 129865,
            'Etelä-Pohjanmaa': 195583,
            'Etelä-Savo': 101518,
            'Itä-Savo': 42221,
            Kainuu: 73959,
            'Kanta-Häme': 172720,
            'Keski-Pohjanmaa': 78124,
            'Keski-Suomi': 252902,
            Kymenlaakso: 168691,
            Lappi: 117447,
            'Länsi-Pohja': 61776,
            Pirkanmaa: 532261,
            'Pohjois-Karjala': 166441,
            'Pohjois-Pohjanmaa': 409043,
            'Pohjois-Savo': 246653,
            'Päijät-Häme': 211957,
            Satakunta: 220398,
            Vaasa: 169741,
            HUS: 1651715,
            'Varsinais-Suomi': 480626,
        };
    }

    static getFinlandsPopulation() {
        return Object.values(CountryDataService.getRegionPopulations()).reduce((a, b) => a + b);
    }
}
