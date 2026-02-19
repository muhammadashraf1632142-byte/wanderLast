let countriesList = [];
let names = [];
let holidaysList = [];
let eventsList = [];
let longWeekendsList = [];
let capitalEvents = "";
const dashboardSwaper = document.getElementById("dashboard-view");
const holidaysSwaper = document.getElementById("holidays-view");
const eventsSwaper = document.getElementById("events-view");
const weatherSwaper = document.getElementById("weather-view");
const longWeekendsSwaper = document.getElementById("long-weekends-view");
const currencySwaper = document.getElementById("currency-view");
const sunTimeSwaper = document.getElementById("sun-times-view");
const myPlansSwaper = document.getElementById("my-plans-view");

let favoriteHolidays =
  JSON.parse(localStorage.getItem("favoriteHolidays")) || [];
let longWeekendsGlobal = [];
let favoriteWeekends =
  JSON.parse(localStorage.getItem("favoriteWeekends")) || [];
// local storage  for my plans section

//fetching country names and codes from api
async function GetCountryName() {
  let countryName = await fetch(
    "https://date.nager.at/api/v3/AvailableCountries",
  );
  let countryData = await countryName.json();
  countriesList = countryData;
  allCountries();
}

async function fetchgOfficialName(countryCode) {
  let officialName = await fetch(
    `https://restcountries.com/v3.1/alpha/${countryCode}`,
  );
  let officialNameData = await officialName.json();
  names = officialNameData[0];
  return {
    officialName: names.name.official,
    region: names.region,
    subregion: names.subregion,
    continents: names.continents,
    timezones: names.timezones,
    capital: names.capital,
    population: names.population,
    callingCodes: names.idd.root + names.idd.suffixes[0],
    drivingSide: names.car.side,
    area: names.area,
    weekStartsOn: names.startOfWeek,
    currencyName: names.currencies[Object.keys(names.currencies)[0]].name,
    currencySymbol: names.currencies[Object.keys(names.currencies)[0]].symbol,
    languages: Object.values(names.languages).join(", "),
    neibghbors: names.borders,
    maps: names.maps.googleMaps,
    code: names.cca2,
    lat: names.latlng[0],
    lng: names.latlng[1],
  };
}

function allCountries() {
  const select = document.getElementById("global-country");
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a country";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);
  //populate the select dropdown with country options
  for (let i = 0; i < countriesList.length; i++) {
    const option = document.createElement("option");
    option.value = countriesList[i].countryCode;
    option.textContent = countriesList[i].name;
    select.appendChild(option);
  }
}

function showCountry(country) {
  const container = document.getElementById("selected-destination");

  container.innerHTML = `
    <img
      src="https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png"
      alt="${country.name}"
    />
    <span>${country.name}</span>
  `;
}
//the second part before the explore button
document
  .getElementById("global-country")
  .addEventListener("change", async function (e) {
    const selectedCode = e.target.value;

    const selectedCountry = countriesList.find(
      (country) => country.countryCode === selectedCode,
    );

    showCountry(selectedCountry);
    fetchHolidays(selectedCode);
  });

///////////////////////////////////////////////////////////////////////////////////////////
//when u press explore button it will send the data to the dashboard (in the next section)
function Explore() {
  let exploreBtn = document.getElementById("explore-btn");
  exploreBtn.addEventListener("click", async function () {
    const selectedCode = document.getElementById("global-country").value;
    const countryDetails = await fetchgOfficialName(selectedCode);

    const selectedCountry = countriesList.find(
      (country) => country.countryCode === selectedCode,
    );

    // now we need to change the country info in the dashboard section
    const countryInfo = document.getElementById("country-info");

    countryInfo.innerHTML = "";

    countryInfo.innerHTML = `
                <img src="https://flagcdn.com/w160/${selectedCountry.countryCode.toLowerCase()}.png" alt="${selectedCountry.name}" class="dashboard-country-flag">
                <div class="dashboard-country-title">
                  <h3>${selectedCountry.name}</h3>
                  <p class="official-name">${countryDetails.officialName}</p>
                  <span class="region"><i class="fa-solid fa-location-dot"></i> ${countryDetails.region} • ${countryDetails.subregion}</span>
                </div>
  `;
    //now we need to change the rest of the data in the dashboard section
    const localTime = document.getElementById("country-local-time");
    localTime.innerHTML = `
                  <i class="fa-solid fa-clock"></i>
                  <span class="local-time-value">--:--:-- --</span>
                  <span class="local-time-zone">${countryDetails.timezones[0]}</span>
    `;
    //capital, population, calling codes, driving side, area, week starts on
    const capital = document.getElementById("Capital");
    capital.innerHTML = `
                  <i class="fa-solid fa-building-columns"></i>
                  <span class="label">Capital</span>
                  <span class="value">${countryDetails.capital[0]}</span>
    `;
    const population = document.getElementById("Population");
    population.innerHTML = `
                  <i class="fa-solid fa-users"></i>
                  <span class="label">Population</span>
                  <span class="value">${countryDetails.population.toLocaleString()}</span>
    `;
    const area = document.getElementById("Area");
    area.innerHTML = `
                  <i class="fa-solid fa-ruler-combined"></i>
                  <span class="label">Area</span>
                  <span class="value">${countryDetails.area.toLocaleString()} km²</span>
    `;
    const continent = document.getElementById("Continent");
    continent.innerHTML = `
                  <i class="fa-solid fa-globe"></i>
                  <span class="label">Continent</span>
                  <span class="value">${countryDetails.continents[0]}</span>
    `;
    const timezone = document.getElementById("Timezone");
    timezone.innerHTML = `
                  <i class="fa-solid fa-clock"></i>
                  <span class="label">Timezone</span>
                  <span class="value">${countryDetails.timezones[0]}</span>
    `;
    const drivingSide = document.getElementById("DrivingSide");
    drivingSide.innerHTML = `
                  <i class="fa-solid fa-car"></i>
                  <span class="label">Driving Side</span>
                  <span class="value">${countryDetails.drivingSide}</span>
    `;
    const weekStartsOn = document.getElementById("WeekStartsOn");
    weekStartsOn.innerHTML = `
                  <i class="fa-solid fa-calendar-week"></i>
                  <span class="label">Week Starts</span>
                  <span class="value">${countryDetails.weekStartsOn}</span>
    `;
    const currency = document.getElementById("Currency");
    currency.innerHTML = `
                   <h4><i class="fa-solid fa-coins"></i> Currency</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${countryDetails.currencyName} (${countryDetails.currencySymbol})</span>
                  </div>
    `;
    const languages = document.getElementById("Languages");
    languages.innerHTML = `  <h4><i class="fa-solid fa-language"></i> Languages</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${countryDetails.languages}</span>
                  </div>`;

    const neibghbors = document.getElementById("Neighbors");
    neibghbors.innerHTML = `    <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
                  <div class="extra-tags">
                    ${countryDetails.neibghbors ? countryDetails.neibghbors.map((neighbor) => `<span class="extra-tag border-tag">${neighbor}</span>`).join("") : '<span class="extra-tag border-tag">No neighboring countries</span>'}
                   
                  </div>`;
    const maps = document.getElementById("Maps");
    maps.innerHTML = `                <a href="${countryDetails.maps}" target="_blank" class="btn-map-link">
                   <i class="fa-solid fa-map"></i> View on Google Maps
                 </a>`;
  });
}

Explore();
// now the Holiday part startg here
// when u press on dashboard link it swaps to dashboard section
function Dashboardpress() {
  const DashboardLink = document.getElementById("Dashboard-link");
  DashboardLink.addEventListener("click", function () {
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");
    dashboardSwaper.classList.add("active");
  });
}
Dashboardpress();
///////////////////////////////////////////////////////////////////////////////////////////

// when u press on holidays link it swaps to holidays section
function Holidayspress() {
  const HolidayLink = document.getElementById("Holidays-link");
  HolidayLink.addEventListener("click", function () {
    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.add("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");
  });
}
Holidayspress();

// fetching holiday data from api

async function fetchHolidays(countryCode) {
  let holidays = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/2026/${countryCode}`,
  );
  let holidaysData = await holidays.json();
  holidaysList = holidaysData;
  holidaysPresention(holidaysList);
  return holidaysList;
}

// loading holidays data into holidays section
//  <div class="holiday-card" id="${holiday.date}">
//               <div class="holiday-card-header">
//                 <div class="holiday-date-box"><span class="day">${holiday.date}</span></div>
//                 <button class="holiday-action-btn" data-index="${i}"><i class="fa-regular fa-heart" id="${holiday.date}"></i></button>
//               </div>
//               <h3>${holiday.localName}</h3>
//               <p class="holiday-name">${holiday.name}</p>
//               <div class="holiday-card-footer">
//                 <span class="holiday-type-badge">${holiday.types}</span>
//               </div>
//             </div>
function holidaysPresention(list) {
  holidaysList = list;

  let html = "";

  for (let i = 0; i < list.length; i++) {
    const holiday = list[i];

    const isFav = favoriteHolidays.some((h) => h.date === holiday.date);

    html += `
      <div class="holiday-card" id="${holiday.date}">
              <div class="holiday-card-header">
                <div class="holiday-date-box"><span class="day">${holiday.date}</span></div>
 <button class="holiday-action-btn" data-index="${i}">
            <i class="${isFav ? "fa-solid text-danger " : "fa-regular"} fa-heart"></i>
          </button>              </div>
              <h3>${holiday.localName}</h3>
              <p class="holiday-name">${holiday.name}</p>
              <div class="holiday-card-footer">
                <span class="holiday-type-badge">${holiday.types}</span>
              </div>
            </div>
    `;
  }

  document.getElementById("holidays-content").innerHTML = html;
}
document
  .getElementById("holidays-content")
  .addEventListener("click", function (e) {
    const button = e.target.closest(".holiday-action-btn");
    if (!button) return;

    const index = button.dataset.index;
    const holiday = holidaysList[index];
    const icon = button.querySelector("i");

    const exists = favoriteHolidays.find((h) => h.date === holiday.date);

    if (!exists) {
      favoriteHolidays.push(holiday);
      icon.classList.replace("fa-regular", "fa-solid");
      icon.classList.add("text-danger");
    } else {
      favoriteHolidays = favoriteHolidays.filter(
        (h) => h.date !== holiday.date,
      );
      icon.classList.replace("fa-solid", "fa-regular");
      icon.classList.remove("text-danger");
    }

    localStorage.setItem("favoriteHolidays", JSON.stringify(favoriteHolidays));
    console.log(favoriteHolidays);
  });
///////////////////////////////////////////////////////////////////////////////////////////

// fetching events from api and loading them into events section
///////////////////////////////////////////////////////////////////////////////////////////

// fetching events from api and loading them into events section
async function fetchEvents(city, countryCode) {
  let events = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${encodeURIComponent(
      city,
    )}&countryCode=${countryCode}&size=20`,
  );

  let eventsData = await events.json();
  let eventsList = eventsData._embedded ? eventsData._embedded.events : [];
  return eventsList;
}

// loading events into events section
function eventsPresentation(eventsList) {
  const container = document.getElementById("events-content");

  if (!eventsList.length) {
    container.innerHTML = `<p class="empty-state">No events found</p>`;
    return;
  }

  let html = "";

  for (let i = 0; i < eventsList.length; i++) {
    const event = eventsList[i];

    const image = event.images?.[0]?.url || "";
    const category = event.classifications?.[0]?.segment?.name || "Event";

    const date = event.dates?.start?.localDate || "TBA";
    const time = event.dates?.start?.localTime || "";
    const venue = event._embedded?.venues?.[0]?.name || "";
    const city = event._embedded?.venues?.[0]?.city?.name || "";
    const url = event.url || "#";

    html += `
      <div class="event-card">
        <div class="event-card-image">
          <img src="${image}" alt="${event.name}">
          <span class="event-card-category">${category}</span>
          <button class="event-card-save">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <div class="event-card-body">
          <h3>${event.name}</h3>

          <div class="event-card-info">
            <div>
              <i class="fa-regular fa-calendar"></i>
              ${date}${time ? " at " + time : ""}
            </div>
            <div>
              <i class="fa-solid fa-location-dot"></i>
              ${venue}${city ? ", " + city : ""}
            </div>
          </div>

          <div class="event-card-footer">
            <button class="btn-event">
              <i class="fa-regular fa-heart"></i> Save
            </button>
            <a href="${url}" target="_blank" class="btn-buy-ticket">
              <i class="fa-solid fa-ticket"></i> Buy Tickets
            </a>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// when u press on events link it swaps to events section + fetches events
function Eventspress() {
  const EventsLink = document.getElementById("Events-link");

  EventsLink.addEventListener("click", async function () {
    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.add("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");

    const selectedCode = document.getElementById("global-country").value;
    if (!selectedCode) return;

    const countryDetails = await fetchgOfficialName(selectedCode);

    const city = countryDetails.capital[0];
    const countryCode = countryDetails.code;

    document.querySelector(".selection-flag").src =
      `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

    document.querySelector(".selection-city").textContent = `- ${city}`;

    const eventsList = await fetchEvents(city, countryCode);
    eventsPresentation(eventsList);
  });
}
Eventspress();
///////////////////////////////////////////////////////////////////////////////////////////

// fetching weather from api and loading them into weather section
async function fetchWeather(latitude, longitude) {
  const weatherData = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
  );
  const weatherInfo = await weatherData.json();
  weatherPresentation(weatherInfo);
  return weatherInfo;
}

// when u press on weather link it swaps to weather section
function Weatherpress() {
  const WeatherLink = document.getElementById("Weather-link");
  WeatherLink.addEventListener("click", async function () {
    let location = await fetchgOfficialName(
      document.getElementById("global-country").value,
    );
    let latitude = location.lat;
    let longitude = location.lng;
    fetchWeather(latitude, longitude);
    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.add("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");
  });
}
Weatherpress();
// time calculation function
function getLocalTime(timezone) {
  try {
    return new Date().toLocaleString("en-US", {
      timeZone: timezone,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    // fallback if timezone is invalid like "UTC-08:00"
    return new Date().toLocaleString("en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}
function renderHourly(weatherInfo) {
  const box = document.getElementById("hourly-cards");
  if (!box) {
    console.error("hourly-cards NOT FOUND in HTML");
    return;
  }

  const times = weatherInfo?.hourly?.time;
  const temps = weatherInfo?.hourly?.temperature_2m;

  if (!times?.length || !temps?.length) {
    console.error("hourly data missing", weatherInfo?.hourly);
    box.innerHTML = "<p>No hourly data.</p>";
    return;
  }

  // try exact match; if not found, fall back to 0
  let start = -1;
  if (weatherInfo?.current?.time) {
    start = times.indexOf(weatherInfo.current.time);
  }
  if (start === -1) start = 0;

  let html = "";
  for (let i = start; i < start + 12 && i < times.length; i++) {
    const code = weatherInfo.hourly.weather_code[i];
    const pop = weatherInfo.hourly.precipitation_probability[i] || 0;

    const meta = getWeatherMeta(code);

    html += `
  <div class="hour-card d-flex flex-column ${i === start ? "now-card" : ""}">
    <div class="hour-time">${hour}</div>

    <div class="hour-icon">
      <i class="fa-solid ${meta.icon}"></i>
    </div>

    <div class="hour-temp">${Math.round(temps[i])}°</div>

    <div class="hour-pop">
      <i class="fa-solid fa-droplet"></i>
      ${pop}%
    </div>
  </div>
`;
  }

  box.innerHTML = html;

  // 🔍 quick debug (remove later)
  console.log("Hourly rendered:", {
    start,
    currentTime: weatherInfo?.current?.time,
    firstHourly: times[0],
  });
}
function getWeatherMeta(code) {
  if (code === 0) return { icon: "fa-sun", text: "Clear" };
  if ([1, 2, 3].includes(code)) return { icon: "fa-cloud-sun", text: "Cloudy" };
  if ([45, 48].includes(code)) return { icon: "fa-smog", text: "Fog" };
  if ([51, 53, 55, 61, 63, 65].includes(code))
    return { icon: "fa-cloud-rain", text: "Rain" };
  if ([71, 73, 75].includes(code))
    return { icon: "fa-snowflake", text: "Snow" };
  return { icon: "fa-cloud", text: "Cloudy" };
}

///////////////////////////////////////////////////////////////////////////////////////////

function weatherPresentation(weatherInfo) {
  let weather = document.getElementById("weather-content");

  const timezone = weatherInfo.timezone;
  const localTime = getLocalTime(timezone);
  var time = getLocalTime(timezone);

  var randomNumber = Math.floor(Math.random() * 100);

  weather.innerHTML = `
    <div class="weather-hero-card ${
      weatherInfo.current.apparent_temperature >= 15
        ? "weather-sunny"
        : weatherInfo.current.apparent_temperature <= 0
          ? "weather-snowy"
          : "weather-cloudy"
    }">
      <div class="weather-location">
        <i class="fa-solid fa-location-dot"></i>
        <span>${document.getElementById("global-country").value}</span>
        <span class="weather-time">${localTime}</span>
      </div>

      <div class="weather-hero-main">
        <div class="weather-hero-left">
          <div class="weather-hero-icon">
            <i class="fa-solid ${
              weatherInfo.current.apparent_temperature >= 15
                ? "fa-sun"
                : weatherInfo.current.apparent_temperature <= 0
                  ? "fa-snowflake"
                  : "fa-cloud"
            }"></i>
          </div>
          <div class="weather-hero-temp">
            <span class="temp-value">${weatherInfo.current.apparent_temperature}</span>
            <span class="temp-unit">°C</span>
          </div>
        </div>

        <div class="weather-hero-right">
          <div class="weather-condition">${
            weatherInfo.current.apparent_temperature >= 15
              ? "Sunny"
              : weatherInfo.current.apparent_temperature <= 0
                ? "Snowy"
                : "Cloudy"
          }</div>
          <div class="weather-feels">
            Feels like ${weatherInfo.current.apparent_temperature - 3}°C
          </div>
          <div class="weather-high-low">
            <span class="high">
              <i class="fa-solid fa-arrow-up"></i>
              ${weatherInfo.current.apparent_temperature + 1}°
            </span>
            <span class="low">
              <i class="fa-solid fa-arrow-down"></i>
              ${weatherInfo.current.apparent_temperature - 1}°
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="weather-details-grid">
      <div class="weather-detail-card">
        <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
        <div class="detail-info">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${weatherInfo.current.relative_humidity_2m}%</span>
        </div>
      </div>

      <div class="weather-detail-card">
        <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
        <div class="detail-info">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${weatherInfo.current.wind_speed_10m} km/h</span>
        </div>
      </div>

      <div class="weather-detail-card">
        <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
        <div class="detail-info">
          <span class="detail-label">UV Index</span>
          <span class="detail-value">${weatherInfo.current.uv_index}</span>
        </div>
      </div>

      <div class="weather-detail-card">
        <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
        <div class="detail-info">
          <span class="detail-label">Precipitation</span>
          <span class="detail-value">${randomNumber}%</span>
        </div>
      </div>
    </div>
  `;

  let hourlyDeg = "";
  const now = new Date();
  const currentHour = now.getHours();

  const currentIndex = weatherInfo.hourly.time.findIndex(
    (t) => new Date(t).getHours() === currentHour,
  );
  // current time in that country

  for (let i = currentIndex; i < currentIndex + 12; i++) {
    if (!weatherInfo.hourly.time[i]) break;

    const hour = new Date(weatherInfo.hourly.time[i]).getHours();
    const temp = weatherInfo.hourly.temperature_2m[i];
    const code = weatherInfo.hourly.weather_code[i];
    const meta = getWeatherMeta(code);

    hourlyDeg += `
    <div class="hour-card hourly-scroll">
      <span>${hour}:00</span>
      <i class="fa-solid ${meta.icon}"></i>
      <span>${temp}°</span>
    </div>
  `;
  }

  document.getElementById("hourly-cards").innerHTML = hourlyDeg;
  // daily weather forecast
  let dailyHTML = "";

  for (let i = 0; i < weatherInfo.daily.time.length; i++) {
    const date = new Date(weatherInfo.daily.time[i]);
    const max = weatherInfo.daily.temperature_2m_max[i];
    const min = weatherInfo.daily.temperature_2m_min[i];
    const code = weatherInfo.daily.weather_code[i];
    const meta = getWeatherMeta(code);

    dailyHTML += `
    <div class="forecast-day">
      <div class="forecast-day-name">
        <span class="day-label">${date.toLocaleDateString("en-US", { weekday: "short" })}</span>
        <span class="day-date">${date.getDate()}</span>
      </div>
      <div class="forecast-icon">
        <i class="fa-solid ${meta.icon}"></i>
      </div>
      <div class="forecast-temps">
        <span class="temp-max">${max}°</span>
        <span class="temp-min">${min}°</span>
      </div>
    </div>
  `;
  }

  document.querySelector(".forecast-list").innerHTML = dailyHTML;

  renderHourly(weatherInfo);
}

///////////////////////////////////////////////////////////////////////////////////////////
// when u press on long weekends link it swaps to long weekends section
function LongWeekendspress() {
  const LongWeekendsLink = document.getElementById("LongWeekends-link");
  LongWeekendsLink.addEventListener("click", async function () {
    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.add("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");
    const selectedCode = document.getElementById("global-country").value;
    if (!selectedCode) return;

    const data = await fetchLongWeekends(selectedCode);
    longWeekendsPresentation(data);
  });
}
LongWeekendspress();
// fetching long weekends from api and loading them into long weekends section
async function fetchLongWeekends(countryCode) {
  let longWeekends = await fetch(
    `https://date.nager.at/api/v3/LongWeekend/2026/${countryCode}`,
  );
  let longWeekendsData = await longWeekends.json();
  longWeekendsList = longWeekendsData;
  return longWeekendsList;
}

function longWeekendsPresentation(longWeekendsList) {
  longWeekendsGlobal = longWeekendsList;

  let longWeekends = ``;
  for (let i = 0; i < longWeekendsList.length; i++) {
    const longWeekend = longWeekendsList[i];

    longWeekends += `              <div class="lw-card">
                <div class="lw-card-header">
                  <span class="lw-badge"
                    ><i class="fa-solid fa-calendar-days"></i> ${longWeekend.dayCount} Days</span
                  >
                 <button class="lw-fav-btn" data-index="${i}">
                    <i class="fa-regular fa-heart"></i>
                </button>

                </div>
                <h3>Long Weekend ${i + 1}</h3>
                <div class="lw-dates">
                  <i class="fa-regular fa-calendar"></i>${longWeekend.startDate} - ${longWeekend.endDate}
                </div>
                <div class="lw-info-box ${longWeekend.needBridgeDay === false ? "success" : "warning"}">
                  <i class="fa-solid fa-check-circle"></i>${longWeekend.needBridgeDay === false ? "No extra days off needed!" : "Extra days off needed!"}
                </div>
                <div class="lw-days-visual">
                  <div class="lw-day">
                    <span class="name">Thu</span><span class="num">1</span>
                  </div>
                  <div class="lw-day weekend">
                    <span class="name">Fri</span><span class="num">2</span>
                  </div>
                  <div class="lw-day weekend">
                    <span class="name">Sat</span><span class="num">3</span>
                  </div>
                  <div class="lw-day weekend">
                    <span class="name">Sun</span><span class="num">4</span>
                  </div>
                </div>
              </div>
`;
  }
  document.getElementById("lw-content").innerHTML = longWeekends;
}
document
  .getElementById("lw-content")
  .addEventListener("click", function (e) {

    const button = e.target.closest(".lw-fav-btn");
    if (!button) return;

    const index = button.dataset.index;
    const weekend = longWeekendsGlobal[index];
    const icon = button.querySelector("i");

    const exists = favoriteWeekends.find(
      w => w.startDate === weekend.startDate &&
           w.endDate === weekend.endDate
    );

    if (!exists) {
      favoriteWeekends.push(weekend);
      icon.classList.replace("fa-regular", "fa-solid");
    } else {
      favoriteWeekends = favoriteWeekends.filter(
        w => !(w.startDate === weekend.startDate &&
               w.endDate === weekend.endDate)
      );
      icon.classList.replace("fa-solid", "fa-regular");
    }

    localStorage.setItem(
      "favoriteWeekends",
      JSON.stringify(favoriteWeekends)
    );
});

///////////////////////////////////////////////////////////////////////////////////////////
// suntimes section and fetching the api data
async function fetchSunTimes(latitude, longitude) {
  const sunTimesData = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=2026&formatted=0`,
  );
  const sunTimesInfo = await sunTimesData.json();
  return sunTimesInfo;
}

// loading sun times into sun times section
// time coverting functions
function formatSunTime(isoString) {
  const date = new Date(isoString);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function formatDayLength(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function sunTimesPresentation(sunTimesInfo, cap) {
  let sunTimes = document.getElementById("sun-times-content");

  let html = `
    <div class="sun-main-card">
      <div class="sun-main-header">
        <div class="sun-location">
          <h2><i class="fa-solid fa-location-dot"></i> ${cap.capital}</h2>
          <p>Sun times for your selected location</p>
        </div>
        <div class="sun-date-display">
          <div class="date">${getLocalTime()}</div>
          <div class="day">Saturday</div>
        </div>
      </div>

      <div class="sun-times-grid">
        <div class="sun-time-card dawn">
          <div class="icon"><i class="fa-solid fa-moon"></i></div>
          <div class="label">Dawn</div>
          <div class="time">${formatSunTime(sunTimesInfo.results.civil_twilight_begin)}</div>
        </div>

        <div class="sun-time-card sunrise">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Sunrise</div>
          <div class="time">${formatSunTime(sunTimesInfo.results.sunrise)}</div>
        </div>

        <div class="sun-time-card noon">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Solar Noon</div>
          <div class="time">${formatSunTime(sunTimesInfo.results.solar_noon)}</div>
        </div>

        <div class="sun-time-card sunset">
          <div class="icon"><i class="fa-solid fa-sun"></i></div>
          <div class="label">Sunset</div>
          <div class="time">${formatSunTime(sunTimesInfo.results.sunset)}</div>
        </div>

        <div class="sun-time-card dusk">
          <div class="icon"><i class="fa-solid fa-moon"></i></div>
          <div class="label">Dusk</div>
          <div class="time">${formatSunTime(sunTimesInfo.results.civil_twilight_end)}</div>
        </div>

        <div class="sun-time-card daylight">
          <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
          <div class="label">Day Length</div>
          <div class="time">${formatDayLength(sunTimesInfo.results.day_length)}</div>
        </div>
      </div>
    </div>
                  <div class="day-length-card">
                <h3>
                  <i class="fa-solid fa-chart-pie"></i> Daylight Distribution
                </h3>
                <div class="day-progress">
                  <div class="day-progress-bar">
                    <div class="day-progress-fill" style="width: 44.6%"></div>
                  </div>
                </div>
                <div class="day-length-stats">
                  <div class="day-stat">
                    <div class="value">10h 42m</div>
                    <div class="label">Daylight</div>
                  </div>
                  <div class="day-stat">
                    <div class="value">44.6%</div>
                    <div class="label">of 24 Hours</div>
                  </div>
                  <div class="day-stat">
                    <div class="value">13h 18m</div>
                    <div class="label">Darkness</div>
                  </div>
                </div>
              </div>

  `;

  sunTimes.innerHTML = html;
}

// when u press on suntimes it swaps to suntimes section
function SunTimespress() {
  const SunTimesLink = document.getElementById("SunTimes-link");

  SunTimesLink.addEventListener("click", async function () {
    const cap = await fetchgOfficialName(
      document.getElementById("global-country").value,
    );

    const sunTimesInfo = await fetchSunTimes(cap.lat, cap.lng);

    sunTimesPresentation(sunTimesInfo, cap);

    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    myPlansSwaper.classList.remove("active");
    sunTimeSwaper.classList.add("active");
  });
}
SunTimespress();
// when u press on my plans link it swaps to my plans section
// my plans section fav holidays and long weekends

function MyPlanspress() {
  const MyPlansLink = document.getElementById("MyPlans-link");
  MyPlansLink.addEventListener("click", function () {
    const favoriteHolidays =
      JSON.parse(localStorage.getItem("favoriteHolidays")) || [];

    dashboardSwaper.classList.remove("active");
    holidaysSwaper.classList.remove("active");
    eventsSwaper.classList.remove("active");
    weatherSwaper.classList.remove("active");
    longWeekendsSwaper.classList.remove("active");
    currencySwaper.classList.remove("active");
    sunTimeSwaper.classList.remove("active");
    myPlansSwaper.classList.add("active");
    // load favorite holidays into my plans section
    let favHolidaysHTML = "";
    if (favoriteHolidays.length === 0) {
      favHolidaysHTML = `<div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
              <h3>No Saved Plans Yet</h3>
              <p>Start exploring and save holidays, events, or long weekends you like!</p>
              <button class="btn-primary" id="start-exploring-btn">
                <i class="fa-solid fa-compass"></i> Start Exploring
              </button>
            </div>`;
    } else {
      for (let i = 0; i < favoriteHolidays.length; i++) {
        const holiday = favoriteHolidays[i];
        favHolidaysHTML += `<div class="plan-card">
        <span class="bg-success position-absolute top-0 end-0 rounded-bottom-end p-1 text-white">Holiday</span>
      <span>${holiday.date}</span>
      <h3>${holiday.localName}</h3>
      <p>${holiday.name}</p>
      <span class="holiday-type-badge">${holiday.types}</span>

      <button class="plan-remover text-danger bg-danger-subtle w-100 mt-2 rounded-2 p-2"
              data-date="${holiday.date}">
        <i class="fa-solid fa-trash"></i> Remove
      </button>
    </div> 
    `;
      }
    }
    document.getElementById("plans-content").innerHTML = favHolidaysHTML;
  });
}
document
  .getElementById("plans-content")
  .addEventListener("click", function (e) {
    const button = e.target.closest(".plan-remover");
    if (!button) return;

    const date = button.dataset.date;

    let favoriteHolidays =
      JSON.parse(localStorage.getItem("favoriteHolidays")) || [];

    favoriteHolidays = favoriteHolidays.filter((h) => h.date !== date);

    localStorage.setItem("favoriteHolidays", JSON.stringify(favoriteHolidays));

    button.closest(".plan-card").remove();
  });
MyPlanspress();
    document.getElementById("plans-content").innerText =
      favoriteHolidays.length;

///////////////////////////////////////////////////////////////////////////////////////////
// when u press on sun times link it swaps to sun times section
SunTimespress();
GetCountryName();
let capi = await fetchgOfficialName(
  document.getElementById("global-country").value,
);
document.getElementById("capitalia").value = `${capi.capital[0]}`;
console.log(favoriteHolidays);
