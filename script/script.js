let hero = document.querySelector('.hero');
const link = "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&units=metric&appid=ed846c16bc89264f21455235cec96624";
let store = {
    timezone: "america",
    ccurrent: {
      temp: 299.82,
      windSpeed:2.36,
      windDeg: 32,
      windGust: 2,
      pressure: 1024,
      clouds: 30,
      sunrise: 3500,
      sunset: 3500,
      humidity: 35,
      weather: { 0:{ main:"sunny",icon: "icons8-partly-cloudy-day-100.png" } } ,
    },
  };
  const fetchData = async () => {
    const result = await fetch(link);
    const data = await result.json();
    let {timezone, current: { temp, pressure, sunrise, sunset, humidity, wind_speed:windSpeed, wind_deg:windDeg, wind_gust:windGust, clouds, weather: { 0:{ main, icon } }  }} = data;
    store = {
      ...store,
      timezone,
      temp,
      pressure,
      sunrise,
      sunset,
      main,
      icon,
      windSpeed,
      windDeg,
      windGust,
      clouds, 
      humidity,
    };
    elemenEdit();
  }

  const createl = () =>{

    return `<div class="hero__weather">
    <div class="hero__basic">
      <p class="hero__name-town">${store.timezone}</p>
      <img class="feauters" src="./img/${upIcon(store.main)}"></img>
      <p class="hero__weather-name">${store.main}</p>
      <p class="hero__temp">${Math.round(store.temp)}&deg</p>
    </div>
    <div class="hero__weather-addition">
      <ul class="hero__list">
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-скорость-ветра-43-47-64.png"></img>${store.windSpeed} m/s</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-wind-direction-64.png"></img>${tratslateDeg(store.windDeg)}</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-ветер-64.png"></img>${store.windGust}</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-облако-64.png"></img>${store.clouds}%</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-влажность-64.png"></img>${store.humidity}%</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-барометр-64.png"></img>${store.pressure} hPa</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-восход-64.png"></img>${showSunUpTimes(store.sunrise)}</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-закат-солнца-64.png"></img>${showSunDownTimes(store.sunset)}</li>
      </ul>
    </div>
  </div>`;
  }

  let upIcon = (main) =>{
    const value = main.toLowerCase();
    switch(value){
      case 'clouds':
        return 'icons8-partly-cloudy-day-100.png';
      case 'rain':
        return 'icons8-rain-100.png';
      case 'snow':
        return 'icons8-snow-100.png';
      case 'storm':
        return 'icons8-storm-100.png';
      case 'fog':
        return 'icons8-fog-100.png';
      case 'sleet':
        return 'icons8-sleet-day-100.png';
      case 'clear':
        return 'icons8-sun-100.png';
      default:
        return 'the.png';
    }
  };
  function showSunUpTimes(sunriseUnix) {
    const datesunUP = new Date(sunriseUnix*1000);
    let hours = datesunUP.getUTCHours();
    if(hours < 10){
      hours = '0' + hours;
    }
    let minutes = datesunUP.getUTCMinutes();
    if(minutes < 10){
      minutes = '0' + minutes;
    }
    let seconds = datesunUP.getUTCSeconds();
    if(seconds < 10){
      seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}`;
}
function showSunDownTimes(sunsetUnix){
  const datesunDown = new Date(sunsetUnix*1000);
  let hours = datesunDown.getUTCHours();
  if(hours < 10){
    hours = '0' + hours;
  }
  let minutes = datesunDown.getUTCMinutes();
  if(minutes < 10){
    minutes = '0' + minutes;
  }
  let seconds = datesunDown.getUTCSeconds();
  if(seconds < 10){
    seconds = '0' + seconds;
  }
  return `${hours}:${minutes}:${seconds}`;
}
function tratslateDeg(windDeg){
  if(windDeg >= 0 || windDeg === 360){
    if(windDeg === 0 || windDeg === 360){
      return 'N';
    }
    else if(windDeg > 0 && windDeg < 90){
      return 'NE';
    }
  }
  if(windDeg >= 90){
    if (windDeg === 90){
      return 'E';
    }
    else if(windDeg >= 90 && windDeg < 180){
      return 'SE';
    }

  }
  if(windDeg >= 180){
    if(windDeg === 180){
      return 'S';
    }
    else if(windDeg > 180 && windDeg < 270){
      return 'SW';
    }
  }
  if(windDeg >= 270){
    if(windDeg === 270){
      return 'W';
    }
    else if(windDeg > 270 && windDeg < 360){
      return 'NW';
    }
  }
}

  const elemenEdit = () => {
    hero.innerHTML = createl();
  }

fetchData();