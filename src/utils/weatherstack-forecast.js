// DOCS: https://weatherstack.com/documentation
const request = require('postman-request');



const getForecast = (latitude, longitude, callback) => {
    const HOST = 'http://api.weatherstack.com';
    const API_KEY = '78b3f03c6a96dbeae0d9f037a5165954';
    const UNITS = 'm';
    const REQ_OPTIONS = {
        url: `${HOST}/current?access_key=${API_KEY}&units=${UNITS}&query=${latitude},${longitude}`,
        json: true
    }
    request(REQ_OPTIONS, (err, resp, body) => {
        if (err) {
            callback(null, `LOW LEVEL: ${err}`);
        }
        else if (body.error) {
            switch(body.error.code) {
                case 601:
                    callback(null, '404: Location not found!'); break;
                default:
                    callback(null, `503: ${body.error.info}`); break;
            }
        }
        else if (body) {
            const { temperature, feelslike, weather_descriptions: descriptions, humidity, visibility } = body.current;
            const message = `It is currently ${descriptions[0]} with a temperature of ${temperature} degress Celsius. Feels like ${feelslike} out.
            Humidity: ${humidity}
            Visibility: ${visibility} `; 
            callback(message, null);
        }
    });
};

module.exports = {
    getForecast: getForecast
}