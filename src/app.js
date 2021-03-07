const path = require('path');
const express = require('express');
const hbs = require('hbs');

const mapbox = require('./utils/mapbox-geocoding');
const weatherstack = require('./utils/weatherstack-forecast');

const app = express();

// Define paths for Express CONFIG
const PUBLIC_DIR = path.join(__dirname, '../public');
const VIEWS_DIR = path.join(__dirname, '../templates/views');
const PARTIALS_DIR = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', VIEWS_DIR);
hbs.registerPartials(PARTIALS_DIR);

// Setup static directory to serve
app.use(express.static(PUBLIC_DIR));

// ========== PAGES & PARTIALS ==========
// -- INDEX --
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        msg: null,
        footerMsg: 'Created by Aspen'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        msg: 'This is me',
        footerMsg: 'Created by Aspen'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        msg: 'Helpful Text',
        footerMsg: 'Created by Aspen'
    });
});

// ========== JSON DATA ==========
app.get('/weather', (req, res) => {
    // Error Handling
    const addressQuery = req.query.address;
    if (!addressQuery) {
        return res.send({ 'error': 'No address indicated' });
    }
    // Success Query -- Logic Handling
    mapbox.getCoords(addressQuery, (data, error) => {
        const { latitude = null, longitude = null, location = 'No location' } = data || {}; //IMPORTANT IN DESTRUCTING. ADD || {}
        if (error) { return res.send({ error }); }

        weatherstack.getForecast(latitude, longitude, (forecastData, error) => {
            if (error) { return res.send({ error }) }; 
            res.send({
                location: location,
                forecast: forecastData,
                address: req.query.address
            });
        });
    });
    // Success Query -- END
});

// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: 'Search term required'
//         });
//     }
//     console.log(req.query.search);
//     res.send({
//         products: []
//     })
// });

// ========== 404 Handlers ==========
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Help article not found',
        footerMsg: 'Created by Aspen'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Page not found',
        footerMsg: 'Created by Aspen'
    });
});

// ========== EXECUTE ==========
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});