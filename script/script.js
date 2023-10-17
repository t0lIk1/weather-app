let loadScreen = document.querySelector(".loadbg")
let hero = document.querySelector(".hero")
let errorScrean = document.querySelector(".errorbg")
let magnifier = document.querySelector(".magnifier-glass")
let form = document.querySelector(".weather-form")
let search = document.querySelector(".weather-form__button");
loadScreen.style.display = "flex";


function submitForm(event){
  const town = document.querySelector(".weather-form__input").value;
  event.preventDefault();
  console.log(town);
  magnifier.style.display = "block";
  form.classList.toggle('active');
  hero.classList.toggle('active');

}
search.addEventListener("click", submitForm);
magnifier.addEventListener("click", (e) => {
  magnifier.style.display = "none";
  form.classList.toggle('active');
  hero.classList.toggle('active');
});
  navigator.geolocation.watchPosition(position => {
    const { latitude, longitude } = position.coords
    coords(latitude, longitude);
  },
  error => {
    let latitude = 33.44;
    let longitude = 94.04; 
    coords(latitude, longitude);
  }
  );
  function coords(latitude, longitude){
      const link = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=ed846c16bc89264f21455235cec96624`;
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
      
    }
  significance = Math.round(windDeg / 45);
  return direction[significance];
}
let changeEl = (e) =>{
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


