var swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
});

let loadScreen = document.querySelector(".loadbg");
let hero = document.querySelector(".hero");
let errorScrean = document.querySelector(".errorbg");
let form = document.querySelector(".weather-form");
let dropmenu = document.querySelector(".dropdown");
let searchResult = document.querySelector(".weather-form__input");
let selectedCountry = document.getElementById("selected-country");
let timezone = document.getElementById("timezone");
let displayedResults = [];
let town = "Shanghai, CN";
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
};

searchResult.addEventListener('input', () => {
  const searchTerm = searchResult.value;
  updateSearchResults(searchTerm);
});

function updateSearchResults(searchTerm) {
  // Clear the dropdown
  dropmenu.innerHTML = '';
  // Execute the API request
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=ed846c16bc89264f21455235cec96624`)
    .then(response => response.json())
    .then(data => {
      data.forEach(result => {
        const resultElement = document.createElement('p');
        resultElement.textContent = result.name + ', ' + result.country;
        // Check if the result is already displayed
        if (!displayedResults.includes(resultElement.textContent)) {
          dropmenu.appendChild(resultElement);
          displayedResults.push(resultElement.textContent);
          resultElement.addEventListener('click', () => {
            searchResult.value = result.name + ", " + result.country;
            timezone.textContent = result.name + ", " + result.country;
            selectedResult = result;
            coords(result.lat, result.lon);
            dropmenu.innerHTML = '';
          });
        }
      });
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
};

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
  
};

function translateCoordtoTown(latitude, longitude) {
  // Создаем URL для запроса данных о городе на основе координат
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=ed846c16bc89264f21455235cec96624`;

  // Отправляем запрос
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Получаем данные о городе из ответа
      town = data[0].name;
      const country = data[0].country;

      // Теперь у вас есть название города и страны, которые можно использовать
      // в вашем приложении или вывести их на экран
      timezone.textContent = data[0].name + ', ' + data[0].country;
      country.textContent = data[0].country;
      translateTown();
    })
    .catch(function (error) {
      console.error('Ошибка при запросе данных о городе:', error);
    });
};

navigator.geolocation.watchPosition(position => {
  if (!isCoordsObtained) {
    const { latitude, longitude } = position.coords;
    translateCoordtoTown(latitude, longitude);
    coords(latitude, longitude);
  isCoordsObtained = true; // Устанавливаем флаг в значение true после первого успешного получения координат
}
  },
  error => {
    timezone.textContent = town;
    translateTown();  
  },

);

function coords(latitude, longitude){
      const link = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=ed846c16bc89264f21455235cec96624`;
      updateSwiper(link);
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
};

function tratslateDeg(windDeg){
  let direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    if (windDeg === 360 ){
      return direction[0];
    }
  significance = Math.round(windDeg / 45);
  return direction[significance];
};

let changeEl  = (e) =>{


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
};

function translateDate(Time) {
  const date = new Date(Time*1000);
  let time = date.getUTCDay()+1;
  let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (time === 7){
    time = 0;
  }
  return day[time];
};
searchCity();
async function updateSwiper(url) {
  const swiperContainer = document.querySelector('.swiper-wrapper');

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Clear existing slides
    swiperContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const slideData = {
        dt: data.daily[i].dt,
        day: data.daily[i].temp.day,
        main: data.daily[i].weather[0].main,
      };

      const newSlide = document.createElement('div');
      newSlide.classList.add('swiper-slide');

      const slideContent = document.createElement('div');
      slideContent.classList.add('slide-content');

      const slideText = document.createElement('p');
      const img = document.createElement('img');
      img.setAttribute( 'src', `${ './img/' + weatherIco(slideData.main)}` );
      
      slideText.textContent = `Date: ${translateDate(slideData.dt)}, Weather: ${slideData.main}, Temperature: ${slideData.day}°C`;
      slideContent.appendChild(img); 
      slideContent.appendChild(slideText);
      newSlide.appendChild(slideContent);
      swiperContainer.appendChild(newSlide);
    }

    // Update Swiper after modifying the slides
    swiper.update();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

updateSwiper();