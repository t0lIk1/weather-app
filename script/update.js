let updateIco = (main) => {
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
    case 'haze':
      return 'fog.png';
    case 'sleet':
      return 'sleet.png';
    case 'clear':
      return 'day_clear.png';
    default:
      return 'the.png';
  }
};

function updateAllInfo() {
  let nameWeather = document.querySelector(".weather-info__name");
  nameWeather.innerHTML = storage.main;

  let date = document.querySelector(".info-date");
  date.innerHTML = translateDate(storage.dt);
  
  let temp = document.getElementById("temp");
  temp.innerHTML = Math.round(storage.temp) ;

  let feelsLikes = document.getElementById("feelslike");
  feelsLikes.innerHTML = 'feelslike: ' + Math.round(storage.feelsLike) + '°C';
  
  let weatherIcon = document.querySelector(".weather-info__img");
  weatherIcon.src = './img/' + updateIco(storage.main);

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

      const dayOfWeek = translateDate(dayData.dt);

      const newDayElement = document.createElement('div');
      newDayElement.classList.add('daily-Weather');

      const dayContent = document.createElement('div');
      dayContent.classList.add('day-content');

      const dayText = document.createElement('p');
      const temp = document.createElement('p');
      const img = document.createElement('img');
      img.setAttribute('src', `./img/${updateIco(dayData.weather[0].main)}`);

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
      const blockSlide = document.createElement('div');
      blockSlide.classList.add('swiper-block');

      const slideContent = document.createElement('div');
      slideContent.classList.add('slide-content');


      const day = document.createElement('p');
      day.textContent = (translateDay(slideData.dt));


      const weather = document.createElement('p');
      weather.textContent = slideData.main;

      const dayText = document.createElement('p');
      dayText.textContent = translateTime(slideData.dt);

      const temp = document.createElement('p');
      temp.textContent = Math.round(slideData.day) + '°C';

      const img = document.createElement('img');
      img.setAttribute( 'src', `${ './img/' + updateIco(slideData.main)}` );
      
      blockSlide.appendChild(day);
      blockSlide.appendChild(dayText);
      blockSlide.appendChild(img); 
      blockSlide.appendChild(weather);
      blockSlide.appendChild(temp);
      newSlide.appendChild(blockSlide);

      // newSlide.appendChild(slideContent);
      swiperContainer.appendChild(newSlide);
    }

    // Update Swiper after modifying the slides
    swiper.update();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
