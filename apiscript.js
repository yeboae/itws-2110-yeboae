// API Configuration
const WEATHER_API_KEY = 'e49c6326c052ca6388d8bebdeb5bf9a2';
const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Programming,Pun?type=twopart';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    loadWeatherData('Troy,NY,US');
    loadJokeData();
    updateTime();
});

// Enhanced Weather Functions
async function loadWeatherData(location) {
    try {
        let url;
        if (typeof location === 'string') {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=imperial`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=imperial`;
        }

        console.log('Fetching weather data from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather API failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        displayEnhancedWeatherData(data);
        loadForecastData(data.coord.lat, data.coord.lon);
        
    } catch (error) {
        console.error('Error loading weather data:', error);
        displayMockWeatherData();
    }
}

function displayEnhancedWeatherData(data) {
    document.getElementById('main-temp').textContent = Math.round(data.main.temp);
    document.getElementById('weather-condition').textContent = data.weather[0].description;
    document.getElementById('feels-like').textContent = `Feels like ${Math.round(data.main.feels_like)}°F`;
    document.getElementById('current-location').textContent = data.name;
    
    // Update weather stats
    document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed)} mph`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1609.34).toFixed(1)} mi`;
    
    if (data.sys && data.sys.sunrise) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    updateWeatherIcon(data.weather[0].main);
    
    updateWeatherTip(data.weather[0].main, data.main.temp);
    
    console.log('Weather display updated successfully');
}

function updateWeatherIcon(weatherMain) {
    const iconElement = document.getElementById('main-weather-icon');
    const iconMap = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Drizzle': 'fas fa-cloud-drizzle',
        'Thunderstorm': 'fas fa-bolt',
        'Snow': 'fas fa-snowflake',
        'Mist': 'fas fa-smog',
        'Fog': 'fas fa-smog'
    };
    
    const iconClass = iconMap[weatherMain] || 'fas fa-cloud';
    iconElement.innerHTML = `<i class="${iconClass}"></i>`;
    console.log('Weather icon updated to:', iconClass);
}

function updateWeatherTip(weather, temp) {
    const tipElement = document.getElementById('weather-tip');
    let tip = '';
    
    if (temp > 80) {
        tip = 'Hot day! Stay hydrated and wear light clothing.';
    } else if (temp > 60) {
        tip = 'Perfect weather for outdoor activities!';
    } else if (temp > 40) {
        tip = 'Cool day, a light jacket would be comfortable.';
    } else {
        tip = 'Cold weather! Bundle up and stay warm.';
    }
    
    if (weather === 'Rain') {
        tip += ' Don\'t forget your umbrella!';
    } else if (weather === 'Snow') {
        tip += ' Perfect day for hot chocolate!';
    } else if (weather === 'Clear') {
        tip += ' Great day for a walk!';
    }
    
    tipElement.textContent = tip;
}

async function loadForecastData(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Forecast API failed');
        
        const data = await response.json();
        displayForecastData(data);
        
    } catch (error) {
        console.error('Error loading forecast:', error);
        displayMockForecast();
    }
}

function displayForecastData(data) {
    const forecastItems = document.getElementById('forecast-items');
    
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });
    
    const forecastArray = Object.values(dailyForecasts).slice(0, 5);
    
    forecastItems.innerHTML = forecastArray.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return `
            <div class="forecast-item">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-temp">${Math.round(day.main.temp)}°F</div>
                <div class="forecast-desc">${day.weather[0].description}</div>
            </div>
        `;
    }).join('');
    
    console.log('Forecast data displayed');
}

async function loadJokeData() {
    try {
        showJokeLoading();
        console.log('Fetching joke from JokeAPI...');
        
        const response = await fetch(JOKE_API_URL);
        
        if (!response.ok) {
            throw new Error(`Joke API failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Joke data received:', data);
        displayEnhancedJokeData(data);
        
    } catch (error) {
        console.error('Error loading joke:', error);
        displayFallbackJoke();
    }
}

function showJokeLoading() {
    const jokeInfo = document.getElementById('joke-info');
    jokeInfo.innerHTML = `
        <div class="loading-joke">
            <i class="fas fa-smile-wink fa-spin"></i>
            <p>Loading a funny joke...</p>
        </div>
    `;
}

function displayEnhancedJokeData(jokeData) {
    const jokeInfo = document.getElementById('joke-info');
    let jokeHTML = '';
    
    if (jokeData.type === 'single') {
        // One-part joke
        jokeHTML = `
            <div class="joke-content">
                <div class="joke-text">"${jokeData.joke}"</div>
                <div class="joke-category mt-3">Category: ${jokeData.category}</div>
                <button class="btn btn-refresh-joke mt-3" onclick="loadJokeData()">
                    <i class="fas fa-sync-alt me-2"></i>Get New Joke
                </button>
            </div>
        `;
    } else {
        // Two-part joke
        jokeHTML = `
            <div class="joke-content">
                <div class="joke-setup">${jokeData.setup}</div>
                <div class="joke-delivery">"${jokeData.delivery}"</div>
                <div class="joke-category mt-3">Category: ${jokeData.category}</div>
                <button class="btn btn-refresh-joke mt-3" onclick="loadJokeData()">
                    <i class="fas fa-sync-alt me-2"></i>Get New Joke
                </button>
            </div>
        `;
    }
    
    jokeInfo.innerHTML = jokeHTML;
    console.log('Joke displayed successfully');
}

function displayFallbackJoke() {
    const jokeInfo = document.getElementById('joke-info');
    const fallbackJokes = [
        {
            setup: "Why did the cloud break up with the fog?",
            delivery: "Because it needed some space!",
            category: "Weather"
        },
        {
            setup: "What do you call a fake weather forecast?",
            delivery: "A sham-cast!",
            category: "Weather"
        },
        {
            setup: "Why don't weathermen ever get hungry?",
            delivery: "Because they're always full of forecasts!",
            category: "Weather"
        },
        {
            setup: "What's a tornado's favorite game?",
            delivery: "Twister!",
            category: "Weather"
        },
        {
            joke: "I told my friend it was chilly outside. He said, 'I know, I just saw a politician with his hands in his own pockets!'",
            category: "Puns"
        }
    ];
    
    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    let jokeHTML = '';
    
    if (randomJoke.setup) {
        jokeHTML = `
            <div class="joke-content">
                <div class="joke-setup">${randomJoke.setup}</div>
                <div class="joke-delivery">"${randomJoke.delivery}"</div>
                <div class="joke-category mt-3">Category: ${randomJoke.category}</div>
                <button class="btn btn-refresh-joke mt-3" onclick="loadJokeData()">
                    <i class="fas fa-sync-alt me-2"></i>Get New Joke
                </button>
            </div>
        `;
    } else {
        jokeHTML = `
            <div class="joke-content">
                <div class="joke-text">"${randomJoke.joke}"</div>
                <div class="joke-category mt-3">Category: ${randomJoke.category}</div>
                <button class="btn btn-refresh-joke mt-3" onclick="loadJokeData()">
                    <i class="fas fa-sync-alt me-2"></i>Get New Joke
                </button>
            </div>
        `;
    }
    
    jokeInfo.innerHTML = jokeHTML;
    console.log('Fallback joke displayed');
}

function displayMockWeatherData() {
    console.log('Displaying mock weather data');
    const mockWeather = {
        name: "Troy",
        main: {
            temp: 68,
            feels_like: 70,
            humidity: 65,
            pressure: 1012
        },
        weather: [
            {
                main: "Clouds",
                description: "partly cloudy"
            }
        ],
        wind: {
            speed: 8
        },
        visibility: 10000,
        sys: {
            sunrise: Math.floor(Date.now() / 1000),
            sunset: Math.floor(Date.now() / 1000) + 43200
        }
    };
    
    displayEnhancedWeatherData(mockWeather);
    displayMockForecast();
}

function displayMockForecast() {
    const forecastItems = document.getElementById('forecast-items');
    const forecastData = [
        { day: 'Mon', temp: 72, desc: 'Sunny' },
        { day: 'Tue', temp: 68, desc: 'Partly Cloudy' },
        { day: 'Wed', temp: 65, desc: 'Light Rain' },
        { day: 'Thu', temp: 70, desc: 'Sunny' },
        { day: 'Fri', temp: 75, desc: 'Sunny' }
    ];
    
    forecastItems.innerHTML = forecastData.map(day => `
        <div class="forecast-item">
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-temp">${day.temp}°F</div>
            <div class="forecast-desc">${day.desc}</div>
        </div>
    `).join('');
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('update-time').textContent = timeString;
}

setInterval(updateTime, 60000);

document.getElementById('geolocation-btn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                loadWeatherData(coords);
                this.innerHTML = '<i class="fas fa-check me-2"></i>Using Your Location';
                this.classList.add('btn-success');
            },
            error => {
                alert('Unable to retrieve your location. Using Troy, NY.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation not supported. Using Troy, NY.');
    }
});

console.log('Weather & Jokes Dashboard loaded successfully!');