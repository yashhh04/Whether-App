/* ==========================================
   WEATHER APP
========================================== */

// Replace with your OpenWeatherMap API key
const API_KEY = "280fbafc34dca5183947679c549933eb";

/* ==========================================
   DOM ELEMENTS
========================================== */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");
const favoriteBtn = document.getElementById("favoriteBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const clouds = document.getElementById("clouds");
const pressure = document.getElementById("pressure");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecast = document.getElementById("forecast");
const favorites = document.getElementById("favorites");
const history = document.getElementById("history");

let currentCity = "";

/* ==========================================
   LOADING
========================================== */

function showLoading() {
    loading.style.display = "flex";
}

function hideLoading() {
    loading.style.display = "none";
}

/* ==========================================
   DATE & TIME
========================================== */

function formatDate() {

    return new Date().toLocaleDateString("en-IN", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

}

function formatTime(time) {

    return new Date(time * 1000).toLocaleTimeString("en-IN", {

        hour: "2-digit",
        minute: "2-digit"

    });

}

/* ==========================================
   DYNAMIC BACKGROUND
========================================== */

function updateBackground(weather){

    document.body.classList.remove(
        "clear",
        "clouds",
        "rain",
        "snow",
        "thunder",
        "mist"
    );

    switch(weather.toLowerCase()){

        case "clear":
            document.body.classList.add("clear");
            break;

        case "clouds":
            document.body.classList.add("clouds");
            break;

        case "rain":
        case "drizzle":
            document.body.classList.add("rain");
            break;

        case "snow":
            document.body.classList.add("snow");
            break;

        case "thunderstorm":
            document.body.classList.add("thunder");
            break;

        default:
            document.body.classList.add("mist");

    }

}

/* ==========================================
   GET WEATHER
========================================== */

async function getWeather(city){

    showLoading();

    error.innerText = "";

    weatherResult.style.display = "none";

    try{

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        if(!response.ok){

            throw new Error("City not found");

        }

        const data = await response.json();

        currentCity = data.name;

        cityName.innerText =
        `${data.name}, ${data.sys.country}`;

        currentDate.innerText =
        formatDate();

        weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        temperature.innerText =
        `${Math.round(data.main.temp)}°`;

        description.innerText =
        data.weather[0].description;

        feelsLike.innerText =
        `${Math.round(data.main.feels_like)}°C`;

        humidity.innerText =
        `${data.main.humidity}%`;

        wind.innerText =
        `${data.wind.speed} m/s`;

        visibility.innerText =
        `${data.visibility/1000} km`;

        pressure.innerText =
        `${data.main.pressure} hPa`;

        clouds.innerText =
        `${data.clouds.all}%`;

        minTemp.innerText =
        `${Math.round(data.main.temp_min)}°C`;

        maxTemp.innerText =
        `${Math.round(data.main.temp_max)}°C`;

        sunrise.innerText =
        formatTime(data.sys.sunrise);

        sunset.innerText =
        formatTime(data.sys.sunset);

        updateBackground(data.weather[0].main);

        weatherResult.style.display = "block";

        weatherResult.classList.add("show");

    }

    catch(err){

        error.innerText =
        "❌ City not found.";

    }

    finally{

        hideLoading();

    }

}

/* ==========================================
   SEARCH
========================================== */

searchBtn.addEventListener("click",()=>{

    const city = cityInput.value.trim();

    if(city===""){

        error.innerText="Please enter a city.";

        return;

    }

    getWeather(city);

});

cityInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});

/* ==========================================
   DARK MODE
========================================== */

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.checked = true;

}

themeToggle.addEventListener("change",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        themeToggle.checked ? "dark" : "light"

    );

});

/* ==========================================
   DEFAULT CITY
========================================== */

getWeather("Surat");
/* ==========================================
   CURRENT LOCATION (GPS)
========================================== */

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        error.innerText = "Geolocation is not supported.";

        return;

    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error();
                }

                const data = await response.json();

                getWeather(data.name);

            } catch {

                hideLoading();

                error.innerText = "Unable to fetch your location weather.";

            }

        },

        () => {

            hideLoading();

            error.innerText = "Location permission denied.";

        }

    );

});

/* ==========================================
   SEARCH HISTORY
========================================== */

function saveHistory(city){

    let cities = JSON.parse(localStorage.getItem("history")) || [];

    cities = cities.filter(item => item !== city);

    cities.unshift(city);

    if(cities.length > 5){

        cities = cities.slice(0,5);

    }

    localStorage.setItem("history", JSON.stringify(cities));

}

function displayHistory(){

    const cities = JSON.parse(localStorage.getItem("history")) || [];

    history.innerHTML = "";

    if(cities.length === 0){

        history.innerHTML = "No recent searches.";

        return;

    }

    cities.forEach(city => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.innerHTML = city;

        div.onclick = () => getWeather(city);

        history.appendChild(div);

    });

}

/* ==========================================
   FAVORITES
========================================== */

favoriteBtn.addEventListener("click",()=>{

    if(currentCity==="") return;

    let fav = JSON.parse(localStorage.getItem("favorites")) || [];

    if(!fav.includes(currentCity)){

        fav.push(currentCity);

        localStorage.setItem("favorites",JSON.stringify(fav));

    }

    displayFavorites();

});

function displayFavorites(){

    const fav = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.innerHTML="";

    if(fav.length===0){

        favorites.innerHTML="No favorite cities yet.";

        return;

    }

    fav.forEach(city=>{

        const div=document.createElement("div");

        div.className="favorite-item";

        div.innerHTML=city;

        div.onclick=()=>getWeather(city);

        favorites.appendChild(div);

    });

}

/* ==========================================
   UPDATE HISTORY AFTER EVERY SEARCH
========================================== */

const originalGetWeather = getWeather;

getWeather = async function(city){

    await originalGetWeather(city);

    if(currentCity){

        saveHistory(currentCity);

        displayHistory();

    }

}

/* ==========================================
   INITIAL LOAD
========================================== */

displayFavorites();

displayHistory();
