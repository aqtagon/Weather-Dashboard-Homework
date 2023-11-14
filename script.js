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

            updateSearchHistoryUi(searchHistoryList);
        } else {
            console.error('Local storage is not supported in this browser.');
        }
    }

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
            cityInput.value = '';
        }
    });

    searchHistory.addEventListener('click', function (e) {
        if (e.target.classList.contains('list-group-item')) {
            const city = e.target.textContent;
            getWeatherData(city);
        }
    });

    

    async function  getWeatherData(city) {

    try {

        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
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

    function displayForecast(data) {
        forecast.innerHTML = '';
        const dailyForecasts = data.list.filter((entry) => entry.dt_txt.includes('15:00:00'));
        dailyForecasts.slice(0, 5).forEach((forecastEntry) => {
           const card = document.createElement('div');
           card.classList.add('forecast-card');

            
             
           const weatherIcon = document.createElement('i');
           weatherIcon.classList.add('fas', getWeatherIcon(forecastEntry.weather[0].icon));
           card.appendChild(weatherIcon);

           


           card.innerHTML += `
               <h5>${new Date(forecastEntry.dt * 1000).toLocaleDateString()}</h5>
               <p>Temperature: ${forecastEntry.main.temp} &#8451;</p>
               <p>Humidity: ${forecastEntry.main.humidity}%</p>
               <p>Wind Speed: ${forecastEntry.wind.speed} m/s</p>
           `;

           forecast.appendChild(card);  
        });

      
    }

    function addToSearchHistory(city) {
        const searchItem = document.createElement('li');
        searchItem.textContent = city;
        searchItem.classList.add('list-group-item');
        searchHistory.appendChild(searchItem);
    }

    function getWeatherIcon(iconCode) {
        const iconMapping = {
            '01d': 'fa-sun',
            '01n': 'fa-moon',
            '02d': 'fa-cloud-sun',
            '02n': 'fa-cloud-moon',
            '03d': 'fa-cloud',
            '03n': 'fa-cloud',
            '04d': 'fa-cloud',
            '04n': 'fa-cloud',
            '09d': 'fa-cloud-showers-heavy',
            '09n': 'fa-cloud-showers-heavy',
            '10d': 'fa-cloud-sun-rain',
            '10n': 'fa-cloud-moon-rain',
            '11d': 'fa-bolt',
            '11n': 'fa-bolt',
            '13d': 'fa-snowflake',
            '13n': 'fa-snowflake',
            '50d': 'fa-smog',
            '50n': 'fa-smog'

        };
        return iconMapping[iconCode] || 'fa-question';
    }
    