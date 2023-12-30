

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

async function getTownDate(latitude, longitude) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=ed846c16bc89264f21455235cec96624`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const townName = data[0].name;
    const country = data[0].country;

    nameTown.textContent = `${townName}, ${country}`;
    country.textContent = country;

    translateTown();
  } catch (error) {
    console.error('Error fetching data for the town:', error);
  }
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


