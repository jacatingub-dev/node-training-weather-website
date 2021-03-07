// DOCS: https://docs.mapbox.com/api/search/geocoding/
const request = require('postman-request');

const getCoords = (searchQuery, callback) => {
    const HOST = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    const API_KEY = 'pk.eyJ1IjoiamFjYXRpbmd1YmRldiIsImEiOiJja2xjaHNmNmUwaHZnMm9vYjdjZzljYjZjIn0.25yew-G1luL1Q2GIlrqaBw';
    const LIMIT = '1';
    const REQ_OPTIONS = {
        url: `${HOST}/${encodeURIComponent(searchQuery)}.json?access_token=${API_KEY}&limit=${LIMIT}`,
        json: true
    }
    request(REQ_OPTIONS, (err, resp, { features: data } = {}) => {
        if (err) {
            callback(null, 'Unable to connect to mapbox-geocoding service');
        }
        else if (!data) {
            callback(null, 'No location indicated in parameter');
        }
        else if (data.length === 0) {
            callback(null, 'No such location found');
        }
        else {
            const { [0]: long, [1]: lat } = data[0].center;
            callback({
                latitude: lat,
                longitude: long,
                coords: `${lat},${long}`,
                location: data[0].place_name
            }, null);
        }
    });
};

module.exports = {
    getCoords: getCoords
};