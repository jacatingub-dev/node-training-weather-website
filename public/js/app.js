// console.log('Client side JS file is loaded');

const getForecast = (address) => {
    const URL = `http://localhost:3000/weather?address=${address}`;
    fetch(URL).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                setErrorMessage(data.error);
            }
            else {
                let {
                    location = 'Location not found',
                    forecast = 'No address indicated',
                    address = 'Address not found'
                } = data || {};
                setUIData(location, forecast);
            } 
        });
    });
};

// UI Data Manipulation
const headerElem = document.querySelector('#HeaderTitle');
const errElem = document.querySelector('#ErrorMessage');
const msgElem = document.querySelector('#DataMessage');
const setErrorMessage = (err) => {
    headerElem.textContent = 'Error';
    errElem.textContent = err;
    msgElem.textContent = 'Try searching for another location';
};

const setUIData = (location, forecast) => {
    headerElem.textContent = location;
    errElem.textContent = '';
    msgElem.textContent = forecast;
}

// Listeners
const weatherForm = document.querySelector('form');
const searchElem = document.querySelector('input');
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = searchElem.value;
    msgElem.textContent = 'Loading...';
    getForecast(location);
});

