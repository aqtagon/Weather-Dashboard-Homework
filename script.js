    const apiKey = '2b20567b537ed255fc7d03137da7d7a4';
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const searchHistory = document.getElementById('search-history');

    function fetchCurrentWeather(city){
        const apiUrl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        fetch(apiUrl)
          .then((response)=>{
            if(!response.ok) {
               throw new Error('Network response was not ok'); 
            }
            return response.json();
          })
          then((data)=>{
            const cityName = data.name;
            const temperatureCelsius = data.main.temp;
            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

          currentWeather.innerHTML = `
          <h2>${cityName}</h2>
          <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed}ms</p>
          `;

          fetchForecast(data.coord.lat, data.coord.lon);

          storeCityInLocalStorage(city);
          })
          .catch((error)=> {
            console.error('Error fetching current weather:', error);
          });
    }

    function fetchForecast(lat,lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {

            forecast.innerHTML = '';

            const forecastData = data.list;

            const groupedData = {};

            forecastData.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const dateString = date.toDateString();

                if (!groupedData[dateString]) {
                    groupedData[dateString] = item;
                }
            });

            for (const dateString in groupedData) {
                const item = groupedData[dateString];
                const date = new Date(item.dt * 1000);
                const timeString = date.toLocaleTimeString();

                const temperatureCelsius = item.main.temp;
                const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
                const humidity = item.main.humidity;
                const windSpeed = item.wind.speed;
                const weatherIcon = item.weather[0].icon;

                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');

                forecastItem.innerHTML = `
                <h3>${dateString} - ${timeString}</h3>
                <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
               `;

               forecast.appendChild(forecastItem);

            }
          })
          .catch((error) => {
            console.error('Error fetching forecast:', error);
          });

    }

    function storeCityInLocalStorage(city) {
        if (typeof(Storage) !=="undefined") {
            let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

            searchHistoryList.push(city);

            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

            updateSearchHistoryUl(searchHistoryList);
        } else {
            console.error('Local storage is not supported in this browser.');
        }
    }

    function updateSearchHistoryUl(searchHistoryList) {
        searchHistory.innerHTML = '';

        searchHistoryList.forEach((city) => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            searchHistory.appendChild(listItem);

            listItem.addEventListener('click', () => {
                fetchCurrentWeather(city);
            });
        });
    }

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = cityInput.trim();

        if (city) {
            fetchCurrentWeather(city);
            cityInput.value = '';
        }
    });

    function storeCityInLocalStorage(city) {
        if (typeof(Storage) !== "undefined") {
            let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

            searchHistoryList.push(city);

            if (searchHistoryList.length > 5) {
                searchHistoryList.shift();
            }

            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

            updateSearchHistoryUl(searchHistoryList);
        } else {
            console.error('Local storage is not supported in this browser.');
        }
    }