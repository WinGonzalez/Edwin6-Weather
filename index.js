class LocationSearch {
    constructor(cityName, latitude, longitude) {
        this.cityName = cityName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}


// Initialize or retrieve search histories from local storage
let savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
localStorage.setItem('savedSearches', JSON.stringify(savedSearches));

let lastSearchItem = JSON.parse(localStorage.getItem('lastSearchItem')) || {};
localStorage.setItem('lastSearchItem', JSON.stringify(lastSearchItem));

// Declare variables for UI elements
let loadingIndicator = false;

const searchContainer = $('#search-container');
const searchHistorySection = $('#search-history');
const emptySearchMessage = $('#empty-search');
const weatherDetailsSection = $('#weather-details');
const weatherForecastSection = $('#weather-forecast');

const cityInputField = $('#city-input');
const searchButton = $('#search-button');
const clearHistoryButton = $('#clear-history-button');

let searchHistory = JSON.parse(localStorage.getItem('savedSearches'));

// Function to handle city search
function handleCitySearch(event) {
    loadingIndicator = true;
    let cityInput = cityInputField.val().trim();

    // Check if city already searched
    if (searchHistory.some(search => search.cityName === cityInput)) {
        loadingIndicator = false;
        return;
    }

    // Construct API request for city search
    let geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid='420c006df726b132282a06990426589b`;

    fetch(geoApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Response not OK');
        }
        return response.json();
    }).then(data => {
        if (!data.length) {
            throw new Error('No data found');
        }
        // Add a new search to history and update the local storage
        let newSearchIndex = searchHistory.push(new LocationSearch(cityInput, data[0].lat, data[0].lon)) - 1;
        localStorage.setItem('savedSearches', JSON.stringify(searchHistory));
        showSearchHistory(newSearchIndex);
        displayWeatherForCity(newSearchIndex);
    }).catch(() => {
        loadingIndicator = false;
    });
}

// Displays weather details for a city
function displayWeatherForCity(index) {
    emptySearchMessage.hide();
    weatherDetailsSection.show();
    weatherForecastSection.show();

    loadingIndicator = true;

    let weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${searchHistory[index].latitude}&lon=${searchHistory[index].longitude}&appid=&units=imperial` = '420c006df726b132282a06990426589b';

    fetch(weatherApiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Response not OK');
        }
        return response.json();
    }).then(data => {
        let forecastItems = weatherForecastSection.children();
        data.list.forEach((item, i) => {

        });
        loadingIndicator = false;
    }).catch(() => {
        loadingIndicator = false;
    });
}

// Clears search history
function clearSearchHistory() {
    localStorage.setItem('savedSearches', JSON.stringify([]));
    searchHistorySection.empty();
}

//Displays History search buttons
function showSearchHistory(index) {
    let historyBtn = $('<button>').addClass('button-class').text(searchHistory[index].cityName);
    historyBtn.on('click', () => displayWeatherForCity(index));
    searchHistorySection.append(historyBtn);
}

// Event listeners for all UI interactions
searchButton.click(handleCitySearch);
clearHistoryButton.click(clearSearchHistory);

// Populates the search history on load
searchHistory.forEach((_, index) => showSearchHistory(index));