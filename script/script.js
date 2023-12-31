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
let apiKey = document.querySelector(".api-key");
let screen = document.querySelector(".api-screen");
let ertext = document.querySelector(".errortext");
let but = document.querySelector(".api-key__send");
let main = document.querySelector(".main");
let errorScreen = document.querySelector(".errorbg");
let dropmenu = document.querySelector(".dropdown");
let searchResult = document.querySelector(".main__form-input");
let nameTown = document.querySelector(".info-town");
let apikey = " ";
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

apikey = localStorage.getItem('api-key');

async function getTownDate(latitude, longitude) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apikey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const townName = data[0].name;
        const country = data[0].country;
        nameTown.textContent = `${townName}, ${country}`;
        // country.textContent = country;  // Removed this line, as it seemed redundant.
        translateTown();
    } catch (error) {
        console.error('Error fetching data for the town:', error);
    }
}

function coords(latitude, longitude) {
    const link = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
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
                    feels_like: feelsLike,
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
if (apikey) {
    yourPosition();
} else {
    screen.style.display = "flex";
}

function apitest(event) {
    event.preventDefault();
    let key = apiKey.value.trim();
    if (key) {
        localStorage.setItem('api-key', key);
    } else {
        console.error("Поле ввода API-ключа пустое.");
        return;
    }

    apikey = key;

    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=52.0944791&lon=23.759782&units=metric&appid=${apikey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            screen.style.display = "none";
            yourPosition();
        })
        .catch(error => {
            failure();
            console.error('Fetch error:', error);
            localStorage.removeItem('api-key');
        });
}

but.addEventListener('click', (event) => {
    apitest(event);
});

function failure() {
    ertext.classList.add('active');
    apiKey.classList.toggle('red');
    but.classList.toggle('red');
    setTimeout(
        () => {
            ertext.classList.remove('active'); // Corrected this line to remove the 'active' class
            apiKey.classList.toggle('red');
            but.classList.toggle('red');
        },
        8 * 1000
    );
}

function yourPosition() {
  loadScreen.style.display = "flex";
  navigator.geolocation.watchPosition(
      (position) => {
          if (!isCoordsObtained) {
              const { latitude, longitude } = position.coords;
              coords(latitude, longitude);
              getTownDate(latitude, longitude);
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
}
