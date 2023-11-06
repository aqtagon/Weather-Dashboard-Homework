    const apiKey = '2b20567b537ed255fc7d03137da7d7a4';
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const searchHistory = document.getElementById('search-history');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
            cityInput.value = '';
        }
    });

    async function  getWeatherData(city) {

    try {

        const currentResponse = await fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric');
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric');
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

        addToSearchHistory(city);
     } catch (error) {
        console.error('An error occured', error);
     }   

    }

    function displayCurrentWeather(data) {
        currentWeather.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>${new Date(data.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp} &#8451;</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

    }
