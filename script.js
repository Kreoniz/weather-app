const API_KEY = 'f9cb5c0856e8459792954125241701';
const BASE_URL = 'https://api.weatherapi.com/v1';

const parseJson = function parseJsonResponseData(json) {
  const city = json.location.name;
  const country = json.location.country;

  const forecastData = json.forecast.forecastday;
  const forecast = [];

  for (let i = 1; i < forecastData.length; i += 1) {
    const day = forecastData[i];
    forecast[i - 1] = {
      date: day.date,
      condition: day.day.condition,
      celcius: {
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
    current: {
      celcius: { current: json.current.temp_c, feelslike: json.current.feelslike_c },
      fahrenheit: { current: json.current.temp_f, feelslike: json.current.feelslike_f },
      condition: json.current.condition,
    },
    forecast,
  };
}

const getWeather = async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`, { mode: 'cors' });
  const weatherData = await response.json();

  const parsedData = parseJson(weatherData);

  return parsedData;
}

const displayWeather = function displayWeather(city) {
  document.querySelectorAll('img').forEach((img) => {
    img.src = './loading.gif';
  });

  getWeather(city)
    .then((data) => {
      console.log(data);

      const input = document.querySelector('#input');
      input.value = `${data.location.city}, ${data.location.country}`;

      const currentIcon = document.querySelector('#current-icon');
      currentIcon.src = 'https:' + data.current.condition.icon.replaceAll('64', '128');

      const forecastBlock = document.querySelector('#forecasts');
      const forecasts = forecastBlock.querySelectorAll('.forecast');
      console.log(forecasts);

      for (let i = 0; i < 2; i += 1) {
        forecasts[i].querySelector('img').src = 'https:' + data.forecast[i].condition.icon;
      }

      return data;
    })
    .catch((response) => {
      console.error('ERROR:', response);
    });
}

const form = document.querySelector('#form');
const input = document.querySelector('#input');

let city = 'Rome';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const city = input.value;

  displayWeather(city);
});
