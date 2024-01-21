const API_KEY = 'f9cb5c0856e8459792954125241701';
const BASE_URL = 'https://api.weatherapi.com/v1';

const getWeather = async function getWeatherData(city) {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`, { mode: 'cors' });
  const weatherData = await response.json();

  return weatherData;
}

const parseJson = function parseJsonResponseData(json) {
  const city = json.location.name;
  const country = json.location.country;

  const forecastData = json.forecast.forecastday;
  const forecast = [];

  for (let i = 0; i < forecastData.length; i += 1) {
    const day = forecastData[i];
    forecast[i] = {
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

const form = document.querySelector('#form');
const input = document.querySelector('#input');

let city = 'Rome';

function displayWeather(city) {
  getWeather(city)
    .then((data) => {
      const parsedData = parseJson(data);

      console.log(parsedData);

      return parsedData;
    })
    .catch((response) => {
      console.error('ERROR');
    });
}

displayWeather(city);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const city = input.value;

  displayWeather(city);
});
