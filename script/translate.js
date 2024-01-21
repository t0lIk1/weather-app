async function translateTown() {
  let link = `http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=1&appid=${apikey}`;
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

function translateDate(utcDate) {
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

function translateDay(utcDate){
  

  const daysOfWeek = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];
  const date = new Date(utcDate * 1000);
  const dayOfMonth = date.getUTCDate();
  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  return `${dayOfWeek}, ${dayOfMonth} `;
}
