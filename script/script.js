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
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-восход-64.png"></img>${transtateTime(store.sunrise)}</li>
      <li class="hero__item"><img class="option-ico" src="./img/option icon/icons8-закат-солнца-64.png"></img>${transtateTime(store.sunset)}</li>
      </ul>
    </div>
  </div>`;
  }

  let upIcon = (main) =>{
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
    case 'fog':
      return 'fog.png';
    case 'sleet':
      return 'sleet.png';
    case 'clear':
      return 'day_clear.png';
    default:
      return 'the.png';
  }
  };
function transtateTime(Time) {
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
      
    }
  significance = Math.round(windDeg / 45);
  return direction[significance];
}

  const elemenEdit = () => {
    hero.innerHTML = createl();
  }

fetchData();