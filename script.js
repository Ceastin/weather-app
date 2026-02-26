const apiKey = 'fe10db671e8f4773e198a7a7100a48ad'; 

// --- MAP SETUP ---
const map = L.map('map').setView([20, 0], 2); 

// Sleek dark-themed map tiles from CartoDB (looks amazing with glassmorphism)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap & CARTO'
}).addTo(map);

let currentMarker = null;

// Allow "Enter" key to trigger search
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeatherByCity();
    }
});

// Geolocation Feature (Current Location)
document.getElementById('locationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                updateMapAndFetch(lat, lon);
            },
            () => alert("Unable to retrieve your location.")
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Map click event
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    updateMapAndFetch(lat, lon);
});

// Centralized function to update map marker and fetch data
function updateMapAndFetch(lat, lon, flyTo = true) {
    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker([lat, lon]).addTo(map);
    
    if (flyTo) {
        map.flyTo([lat, lon], 10, { duration: 1.5 });
    }
    
    getWeatherByCoords(lat, lon);
}

// --- WEATHER FUNCTIONS ---

async function getWeatherByCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;
    
    showLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        
        // Sync map to the searched city
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        updateMapAndFetch(lat, lon, true);
        
        displayCurrentWeather(data);
        fetchForecastData(lat, lon);
        
    } catch (error) {
        showError();
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        
        displayCurrentWeather(data);
        fetchForecastData(lat, lon);
    } catch (error) {
        showError();
    }
}

// Fetch 5-Day Forecast
async function fetchForecastData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Filter to get 1 reading per day (around noon)
        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = ''; // Clear old data
        
        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000);
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = days[date.getDay()];
            const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            const temp = Math.round(day.main.temp);
            
            const card = `
                <div class="forecast-card">
                    <p class="f-day">${dayName}</p>
                    <img src="${iconUrl}" alt="icon">
                    <p class="f-temp">${temp}°</p>
                </div>
            `;
            forecastContainer.innerHTML += card;
        });

    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// --- UI UPDATER FUNCTIONS ---

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.name || (data.sys.country ? `Region in ${data.sys.country}` : "Unknown Location");
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    
    const desc = data.weather[0].description;
    document.getElementById('description').textContent = desc;
    
    // High-Res Icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    
    // Extra Details
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;

    showLoading(false);
}

function showLoading(isLoading) {
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('weatherResult');
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden');
    
    if (isLoading) {
        loader.classList.remove('hidden');
        resultDiv.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }
}

function showError() {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('weatherResult').classList.add('hidden');
    document.getElementById('errorMessage').classList.remove('hidden');
}

// Initialize on page load with a cool default location (e.g., London)
window.onload = () => {
    updateMapAndFetch(51.5074, -0.1278, true); 
};