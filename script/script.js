let loadScreen = document.querySelector(".loadbg")
let hero = document.querySelector(".hero")
let errorScrean = document.querySelector(".errorbg")
let form = document.querySelector(".weather-form")
let search = document.querySelector(".weather-form__button");
let dropmenu = document.querySelector(".dropdown");
let searchResult = document.querySelector(".weather-form__input");
let town = "Shanghai";
let selectedResult = null;


let isCoordsObtained = false; // Флаг для отслеживания состояния получения координат
let storage = {
  timezone: "",
  current: {
    temp: 299.82,
    windSpeed:2.36,
    windDeg: 32,
    uvi: 2,
    pressure: 1024,
    clouds: 30,
    sunrise: 3500,
    sunset: 3500,
    humidity: 35,
    weather: { 0:{ main:"sunny",icon: "icons8-partly-cloudy-day-100.png" } } ,
  },
};
const coordsTown = {
  0:{
    lat: 15,
    lon: 10,
    local_names:{
      en: "Moscow",
    }
  }
};
loadScreen.style.display = "flex";

function submitForm(event) {
  event.preventDefault();
  town = searchResult.value;
  translateTown(town);
}
search.addEventListener("click", submitForm);

searchResult.addEventListener('input', () => {
  const searchTerm = searchResult.value;
  updateSearchResults(searchTerm);
});


function updateSearchResults(searchTerm) {
  // Очистка контейнера с результатами поиска
  dropmenu.innerHTML = '';
  // Выполнение запроса к API
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=ed846c16bc89264f21455235cec96624`)
    .then(response => response.json())
    .then(data => {
      // Обработка полученных данных и отображение результатов поиска
      data.forEach(result => {
        const resultElement = document.createElement('p');
        resultElement.textContent = result.name + ", " + result.country;
        dropmenu.appendChild(resultElement);

        // Добавьте обработчик события для выбора элемента
        resultElement.addEventListener('click', () => {
          // Заполните поле ввода выбранным результатом
          searchResult.value = result.name ;
          // Сохраните выбранный результат
          selectedResult = result;
          coords(result.lat , result.lon);
          // Очистите контейнер с результатами
          dropmenu.innerHTML = '';

          console.log(selectedResult);
        });
      });
    })
    .catch(error => {
      console.error('Произошла ошибка:', error);
    });
}



async function searchCity() {
  let link = `http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=ed846c16bc89264f21455235cec96624`;
  try {
    const response = await fetch(link);
    const data = await response.json();
    // Обработка полученных данных
    const cities = data.map(city => city.name);
    // Отображение результатов
    cities.forEach(city => {
      const result = document.querySelector('dropdown');
      result.textContent = city;
      document.body.appendChild(result);
    });
  } catch (error) {
    console.log('Ошибка:', error);
  }
  
}
searchCity();
navigator.geolocation.watchPosition(position => {
  if (!isCoordsObtained) {
  const { latitude, longitude } = position.coords;
  coords(latitude, longitude);
  isCoordsObtained = true; // Устанавливаем флаг в значение true после первого успешного получения координат
}
  },
  error => {
    translateTown();  
  },

);
function coords(latitude, longitude){
      const link = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=ed846c16bc89264f21455235cec96624`;
      console.log(link);
      const linkData = async () => {
      try{
        const res = await fetch(link);
        const data = await res.json();
        let {timezone, current: { temp, pressure, sunrise, sunset, humidity, wind_speed:windSpeed, wind_deg:windDeg, uvi, clouds, weather: { 0:{ main, icon } }  }} = data;
        storage = {
          ...storage,
          timezone,
          temp,
          pressure,
          sunrise,
          sunset,
          main,
          icon,
          windSpeed,
          windDeg,
          uvi,
          clouds, 
          humidity,
        };
        changeEl();
      }
      catch{
        errorScrean.classList.toggle('active');
      }
      }
      linkData()
      .then(() => {
        loadScreen.style.display = "none";
      });
};  
let translateTown = async () => {
  let link = `http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=ed846c16bc89264f21455235cec96624`
  console.log(link);  
  const linkData = async () => {
    try{
      const res = await fetch(link);
      const data = await res.json();   
      let { 0:{lat, lon, local_names:{en}} } = data;
      coords(lat , lon);
      coordsTown = {
        ...coordsTown,
        lat,
        lon,
        en,
      };
    }
    catch{
    }
  }
  
  linkData();
};
let weatherIco = (main) =>{
    const value = main.toLowerCase();
    switch(value){
    case 'clouds':
      return 'overcast.png';
    case 'rain':
      return 'rain.png';
    case 'drizzle':
      return 'rain.png';
    case 'snow':
      return 'snow.png';
    case 'thunderstorm':
      return 'thunder.png';
    case 'storm':
      return 'rain_thunder.png';
    case 'fog' :
      return 'fog.png';
    case 'mist' :
      return 'fog.png';
    case 'sleet':
      return 'sleet.png';
    case 'clear':
      return 'day_clear.png';
    default:
      return 'the.png';
  }
};
function translateTime(Time) {
    const date = new Date(Time*1000);
    let hours = date.getUTCHours();
    if(hours < 10){
      hours = '0' + hours;
    }
    let minutes = date.getUTCMinutes();
    if(minutes < 10){
      minutes = '0' + minutes;
    }
    return `${hours}:${minutes}`;
}
function tratslateDeg(windDeg){
  let direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    if (windDeg === 360 ){
      return direction[0];
    }
  significance = Math.round(windDeg / 45);
  return direction[significance];
} 
let changeEl  = (e) =>{
// Обновляем название города  
let town = document.getElementById("timezone");
town.textContent = storage.timezone;

// Обновляем название погоды
let nameWeather = document.getElementById("weather-name");
nameWeather.innerHTML = storage.main;

// Обновляем температуру
let Temp = document.getElementById("temp");
Temp.innerHTML = Math.round(storage.temp) + '&deg;';

// Обновляем иконку погоды
let weatherIcon = document.getElementById("weather-icon");
weatherIcon.src = './img/' + weatherIco(storage.main);

// Обновляем скорость ветра
let speedWind = document.getElementById("windSpeed");
speedWind.innerHTML = storage.windSpeed + ' m/s';

// Обновляем направление ветра
let windDirection = document.getElementById("winddirection");
windDirection.innerHTML = tratslateDeg(storage.windDeg);

// Обновляем порывы ветра
let uviIndex = document.getElementById("uvi");
uviIndex.innerHTML = storage.uvi;

// Обновляем облачность
let Clouds = document.getElementById("clouds");
Clouds.innerHTML = storage.clouds + '%';

// Обновляем влажность
let Humidity = document.getElementById("humidity");
Humidity.innerHTML = storage.humidity + '%';

// Обновляем давление
let Pressure = document.getElementById("pressure");
Pressure.innerHTML = storage.pressure + ' hPa';

// Обновляем время восхода солнца
let Sunrise = document.getElementById("sunrise");
Sunrise.innerHTML = translateTime(storage.sunrise);

// Обновляем время заката солнца
let Sunset = document.getElementById("sunset");
Sunset.innerHTML = translateTime(storage.sunset);
}