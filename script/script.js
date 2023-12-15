var swiper = new Swiper('.swiper',  {
  slidesPerView: 5, // Set the number of slides to display
  spaceBetween: 10, // Adjust the space between slides if needed
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    clickable: true,
    el: '.swiper-pagination',
    type: 'bullets',
  },
});

let loadScreen = document.querySelector(".loadbg");
let main = document.querySelector(".main");
let errorScreen = document.querySelector(".errorbg");
let dropmenu = document.querySelector(".dropdown");
let searchResult = document.querySelector(".main__form-input");
let nameTown = document.querySelector(".info-town");
let displayedResults = [];
let town = "Shanghai";
let selectedResult = null;
let isCoordsObtained = false;
let isPermissionGranted = false;
let storage = {
  timezone: "",
  current: {
    temp: 299.82,
    feelsLike: 33,
    windSpeed: 2.36,
    windDeg: 32,
    uvi: 2,
    pressure: 1024,
    clouds: 30,
    sunrise: 3500,
    sunset: 3500,
    humidity: 35,
    dt: 3600,
    visibility: 36,
    weather: {
      0: {
        main: "sunny",
        icon: "icons8-partly-cloudy-day-100.png"
      }
    },
  },
};

const debouncedUpdateSearchResults = debounce(updateSearchResults, 1000);

const coordsTown = {
  0: {
    lat: 15,
    lon: 10,
    local_names: {
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

searchResult.addEventListener('input', () => {
  const searchTerm = searchResult.value;
  debouncedUpdateSearchResults(searchTerm)
});

function updateSearchResults(searchTerm) {
  dropmenu.innerHTML = '';

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=ed846c16bc89264f21455235cec96624`)
    .then(response => response.json())
    .then(data => {
      if (searchTerm.trim() !== '' && data.length > 0) {
        // Если введенный термин поиска не пустой и есть результаты, добавляем класс 'active'
        searchResult.classList.add('active');
      } else {
        // Если введенный термин поиска пустой или результатов нет, убираем класс 'active'
        searchResult.classList.remove('active');
      }
      data.forEach(result => {
        const resultElement = document.createElement('p');
        resultElement.textContent = result.name + ', ' + result.country;
        if (!displayedResults.includes(resultElement.textContent)) {
          dropmenu.appendChild(resultElement);
          displayedResults.push(resultElement.textContent);
          resultElement.addEventListener('click', () => {
            searchResult.value = result.name + ", " + result.country;
            nameTown.innerHTML = result.name + ", " + result.country;
            searchResult.classList.remove('active');
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
    
}

async function searchCity() {
  let link = `https://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=ed846c16bc89264f21455235cec96624`;
  try {
    const response = await fetch(link);
    const data = await response.json();
    const cities = data.map(city => city.name);
    cities.forEach(city => {
      const result = document.querySelector('.dropmenu');
      
      result.textContent = city;
      document.body.appendChild(result);
    });
  } catch (error) {
    console.log('Error:', error);
  }
};



navigator.geolocation.watchPosition(
  (position) => {
    if (!isCoordsObtained ) {
      const { latitude, longitude } = position.coords;
      coords(latitude, longitude);
      translateCoordToTownAPI(latitude, longitude);
    }
    isCoordsObtained = true;
  },
  (error) => {
    if (!isCoordsObtained) {

      nameTown.textContent = town;
      translateTown();
      
    }

    // Handle other geolocation errors here
  }
);

function translateCoordToTownAPI(latitude, longitude) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=ed846c16bc89264f21455235cec96624`;
  console.log(url);
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      town = data[0].name;
      const country = data[0].country;
      nameTown.textContent = data[0].name + ', ' + data[0].country;
      country.textContent = data[0].country;
      translateTown();
    })
    .catch(function (error) {
      console.error('Error fetching data for the town:', error);
    });
}

function coords(latitude, longitude) {
  const link = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=ed846c16bc89264f21455235cec96624`;
  console.log(link);
  updateSwiper(link);
  weatherDay(link);
  const linkData = async () => {
    try {
      const res = await fetch(link);
      const data = await res.json();
      let {
        timezone,
        current: {
          temp,
          pressure,
          sunrise,
          sunset,
          humidity,
          wind_speed: windSpeed,
          wind_deg: windDeg,
          feels_like:feelsLike,
          uvi,
          clouds,
          dt,
          visibility,
          weather: {
            0: {
              main,
              icon
            }
          }
        }
      } = data;
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
        feelsLike,
        uvi,
        clouds,
        humidity,
        dt,
        visibility,
      };
      updateAllInfo();
    } catch (error) {
      errorScreen.classList.toggle('active');
    }
  };
  linkData()
    .then(() => {
      loadScreen.style.display = "none";
    });
}

let translateTown = async () => {
  let link = `http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=1&appid=ed846c16bc89264f21455235cec96624`
  console.log(link);
  const linkData = async () => {
    try {
      const res = await fetch(link);
      const data = await res.json();
      let {
        0: {
          lat,
          lon,
          local_names: {
            en
          }
        }
      } = data;
      if (!isCoordsObtained) {
      coords(lat, lon);
      }
      coordsTown = {
        ...coordsTown,
        lat,
        lon,
        en,
      };
    } catch {}
  }
  linkData();
};

let weatherIco = (main) => {
  const value = main.toLowerCase();
  switch (value) {
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
    case 'fog':
      return 'fog.png';
    case 'mist':
      return 'fog.png';
    case 'sleet':
      return 'sleet.png';
    case 'clear':
      return 'day_clear.png';
    default:
      return 'the.png';
  }
};

function translateTime(utcTimestamp) {
  const date = new Date(utcTimestamp * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function tratslateDeg(windDeg) {
  let direction = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  if (windDeg === 360) {
    return direction[0];
  }
  significance = Math.round(windDeg / 45);
  return direction[significance];
};

function formatDate(utcDate) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysOfWeek = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];

  

  const date = new Date(utcDate * 1000);
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  return `${dayOfWeek}, ${month} ${dayOfMonth} `;
}


function updateAllInfo() {
  let nameWeather = document.querySelector(".weather-info__name");
  nameWeather.innerHTML = storage.main;

  let date = document.querySelector(".info-date");
  date.innerHTML = formatDate(storage.dt);
  
  let temp = document.getElementById("temp");
  temp.innerHTML = Math.round(storage.temp) ;

  let feelsLikes = document.getElementById("feelslike");
  feelsLikes.innerHTML = 'feelslike: ' + Math.round(storage.feelsLike) + '°C';
  
  let weatherIcon = document.querySelector(".weather-info__img");
  weatherIcon.src = './img/' + weatherIco(storage.main);

  let speedWind = document.getElementById("windspeed");
  speedWind.innerHTML = storage.windSpeed + ' m/s';

  let uv = document.getElementById("UV");
  uv.innerHTML = storage.uvi ;

  let windDirection = document.getElementById("windDeg");
  windDirection.innerHTML = tratslateDeg(storage.windDeg);

  let Humidity = document.getElementById("humadility");
  Humidity.innerHTML = storage.humidity + '%';

  let clouds = document.getElementById("clouds");
  clouds.innerHTML = storage.clouds + '%';

  let Pressure = document.getElementById("pressure");
  Pressure.innerHTML = storage.pressure + ' hPa';

  let Sunrise = document.getElementById("sunrise");
  Sunrise.innerHTML = translateTime(storage.sunrise);

  let Sunset = document.getElementById("sunset");
  Sunset.innerHTML = translateTime(storage.sunset);
}




async function weatherDay(url) {
  const daily = document.querySelector('.daily');
  try {
    const res = await fetch(url);
    const data = await res.json();

    daily.innerHTML = '';

    for (let i = 0; i < 5; i++) {
      const dayData = data.daily[i];

      const dayOfWeek = formatDate(dayData.dt);

      const newDayElement = document.createElement('div');
      newDayElement.classList.add('daily-Weather');

      const dayContent = document.createElement('div');
      dayContent.classList.add('day-content');

      const dayText = document.createElement('p');
      const temp = document.createElement('p');
      const img = document.createElement('img');
      img.setAttribute('src', `./img/${weatherIco(dayData.weather[0].main)}`);

      dayText.textContent = `${dayOfWeek}`;
      temp.textContent = `${Math.round(dayData.temp.day)}°C`
      temp.classList.add('daily-Weather__temp');


      dayContent.appendChild(img);
      dayContent.appendChild(temp);
      dayContent.appendChild(dayText);
      newDayElement.appendChild(dayContent);
      daily.appendChild(newDayElement);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}



async function updateSwiper(url) {
  const swiperContainer = document.querySelector('.swiper-wrapper');

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Clear existing slides
    swiperContainer.innerHTML = '';

    for (let i = 0; i < 47; i++) {
      const slideData = {
        dt: data.hourly[i].dt,
        day: data.hourly[i].temp,
        main: data.hourly[i].weather[0].main,
      };

      const newSlide = document.createElement('div');
      newSlide.classList.add('swiper-slide');

      const slideContent = document.createElement('div');
      slideContent.classList.add('slide-content');

      const weather = document.createElement('p');
      weather.textContent = slideData.main;
      const dayText = document.createElement('p');
      dayText.textContent = translateTime(slideData.dt);
      const temp = document.createElement('p');
      temp.textContent = Math.round(slideData.day) + '°C';
      const img = document.createElement('img');
      img.setAttribute( 'src', `${ './img/' + weatherIco(slideData.main)}` );
      
      newSlide.appendChild(dayText);
      newSlide.appendChild(img); 
      newSlide.appendChild(weather);
      newSlide.appendChild(temp);
      // newSlide.appendChild(slideContent);
      swiperContainer.appendChild(newSlide);
    }

    // Update Swiper after modifying the slides
    swiper.update();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
