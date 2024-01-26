const API_KEY = 'f9cb5c0856e8459792954125241701';
const BASE_URL = 'https://api.weatherapi.com/v1';

let mode = 'celsius';

const modeSymbols = {
  'celsius': '°C',
  'fahrenheit': '°F',
}

const parseJson = function parseJsonResponseData(json) {
  try {
    const city = json.location.name;
    const country = json.location.country;

    const forecastData = json.forecast.forecastday;
    const forecast = [];

    for (let i = 1; i < forecastData.length; i += 1) {
      const day = forecastData[i];
      forecast[i - 1] = {
        date: day.date,
        condition: day.day.condition,
        celsius: {
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c,
          average: day.day.avgtemp_c,
        },
        fahrenheit: {
          min: day.day.mintemp_f,
          max: day.day.maxtemp_f,
          average: day.day.avgtemp_f,
        },
      };
    }

    return {
      location: { city, country },
      today: {
        celsius: {
          current: json.current.temp_c,
          feelslike: json.current.feelslike_c,
          min: forecastData[0].day.mintemp_c,
          max: forecastData[0].day.maxtemp_c,
        },
        fahrenheit: {
          current: json.current.temp_f,
          feelslike: json.current.feelslike_f,
          min: forecastData[0].day.mintemp_f,
          max: forecastData[0].day.maxtemp_f,
        },
        condition: json.current.condition,
      },
      forecast,
    };
  } catch {
    return false;
  }
}

const getWeather = async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`, { mode: 'cors' });
  const weatherData = await response.json();

  const parsedData = parseJson(weatherData);

  return parsedData;
}

const displayWeather = function displayWeather(city) {
  document.querySelectorAll('img').forEach((img) => {
    img.src = './src/loading.gif';
  });

  getWeather(city)
    .then((data) => {
      if (!data) {
        return Promise.reject('No response');
      }

      const input = document.querySelector('#input');
      input.value = '';
      input.placeholder = `${data.location.city}, ${data.location.country}`;

      const todayIcon = document.querySelector('#today-icon');
      const todayStatus = document.querySelector('#today-status');
      todayIcon.src = 'https:' + data.today.condition.icon.replaceAll('64', '128');
      todayStatus.textContent = data.today.condition.text;

      const symbol = modeSymbols[mode];
      const weatherToday = data.today[mode];

      const todayInfo = document.querySelector('#today-info');
      const todayCurrent = todayInfo.querySelector('.today-current');
      const todayFeelsLike = todayInfo.querySelector('.today-feels-like');
      const todayMin = todayInfo.querySelector('.today-min');
      const todayMax = todayInfo.querySelector('.today-max');

      todayCurrent.textContent = weatherToday.current + symbol;
      todayFeelsLike.textContent = weatherToday.feelslike + symbol;
      todayMin.textContent = weatherToday.min + symbol;
      todayMax.textContent = weatherToday.max + symbol;

      const forecastBlock = document.querySelector('#forecasts');
      const forecasts = forecastBlock.querySelectorAll('.forecast');

      for (let i = 0; i < 2; i += 1) {
        const forecastImg = forecasts[i].querySelector('img');
        const forecastStatus = forecasts[i].querySelector('.forecast-status');
        const forecastMin = forecasts[i].querySelector('.forecast-min');
        const forecastMax = forecasts[i].querySelector('.forecast-max');
        const forecastAvg = forecasts[i].querySelector('.forecast-avg');

        const weatherForecast = data.forecast[i];

        forecastImg.src = 'https:' + weatherForecast.condition.icon;
        forecastStatus.textContent = weatherForecast.condition.text;

        forecastMin.textContent = weatherForecast[mode].min + symbol;
        forecastMax.textContent = weatherForecast[mode].max + symbol;
        forecastAvg.textContent = weatherForecast[mode].average + symbol;
      }

      return data;
    })
    .catch((response) => {
      console.error('ERROR:', response);
    });
}

const tempModeBtn = document.querySelector('.temp-mode-btn');
tempModeBtn.textContent = modeSymbols[mode];

tempModeBtn.addEventListener('click', (event) => {
  mode = (mode === 'celsius') ? 'fahrenheit' : 'celsius';
  tempModeBtn.textContent = modeSymbols[mode];

  const city = input.value ? input.value : input.placeholder;
  displayWeather(city);
});

const form = document.querySelector('#form');
const input = document.querySelector('#input');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const city = input.value ? input.value : input.placeholder;

  displayWeather(city);
});

displayWeather('Greenwich, United Kingdom');
