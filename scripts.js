const apikey = "2340b7228e0b4c378a0164337252805";
        const apiUrl = "https://api.weatherapi.com/v1/current.json";

        async function checkWeather(city) {
            const cityInput = document.getElementById('cityInput');
            const loading = document.getElementById('loading');
            const weatherData = document.getElementById('weatherData');
            const error = document.getElementById('error');
            
            const searchCity = city || cityInput.value.trim();
            
            if (!searchCity) {
                showError("Please enter a city name");
                return;
            }

            // Show loading state
            loading.classList.add('show');
            weatherData.style.display = 'none';
            error.style.display = 'none';

            try {
                const response = await fetch(`${apiUrl}?key=${apikey}&q=${searchCity}&aqi=no`);
                
                if (!response.ok) {
                    throw new Error('City not found');
                }
                
                const data = await response.json();
                updateWeatherDisplay(data);
                
            } catch (err) {
                showError("City not found. Please check the spelling and try again.");
            } finally {
                loading.classList.remove('show');
            }
        }

        function updateWeatherDisplay(data) {
            const weatherData = document.getElementById('weatherData');
            const tempElement = weatherData.querySelector('.temp');
            const cityElement = weatherData.querySelector('.city');
            const humidityElement = weatherData.querySelector('.humidity');
            const windElement = weatherData.querySelector('.wind');
            const weatherIcon = weatherData.querySelector('.weather-icon');

            tempElement.textContent = `${Math.round(data.current.temp_c)}°C`;
            cityElement.textContent = data.location.name;
            humidityElement.textContent = `${data.current.humidity}%`;
            windElement.textContent = `${data.current.wind_kph} km/h`;

            // Update weather icon based on condition
            updateWeatherIcon(weatherIcon, data.current.condition.text);
            
            // Update additional details
            updateAdditionalDetails(data);
            updateLocationInfo(data);
            
            weatherData.style.display = 'block';
            document.getElementById('error').style.display = 'none';
        }

        function updateAdditionalDetails(data) {
            const additionalDetails = document.getElementById('additionalDetails');
            const current = data.current;
            
            additionalDetails.innerHTML = `
                <div class="detail-card">
                    <h4>Feels Like</h4>
                    <div class="value">${Math.round(current.feelslike_c)}°</div>
                    <div class="unit">Celsius</div>
                </div>
                <div class="detail-card">
                    <h4>Pressure</h4>
                    <div class="value">${current.pressure_mb}</div>
                    <div class="unit">mb</div>
                </div>
                <div class="detail-card">
                    <h4>Visibility</h4>
                    <div class="value">${current.vis_km}</div>
                    <div class="unit">km</div>
                </div>
                <div class="detail-card">
                    <h4>UV Index</h4>
                    <div class="value">${current.uv}</div>
                    <div class="unit">${getUVLevel(current.uv)}</div>
                </div>
                <div class="detail-card">
                    <h4>Wind Direction</h4>
                    <div class="value">${current.wind_dir}</div>
                    <div class="unit">${current.wind_degree}°</div>
                </div>
                <div class="detail-card">
                    <h4>Condition</h4>
                    <div class="value" style="font-size: 1rem;">${current.condition.text}</div>
                    <div class="unit">Current Weather</div>
                </div>
            `;
        }

        function updateLocationInfo(data) {
            const locationGrid = document.getElementById('locationGrid');
            const location = data.location;
            
            locationGrid.innerHTML = `
                <div class="location-item">
                    <div class="label">Region</div>
                    <div class="value">${location.region || 'N/A'}</div>
                </div>
                <div class="location-item">
                    <div class="label">Country</div>
                    <div class="value">${location.country}</div>
                </div>
                <div class="location-item">
                    <div class="label">Timezone</div>
                    <div class="value">${location.tz_id}</div>
                </div>
                <div class="location-item">
                    <div class="label">Local Time</div>
                    <div class="value">${new Date(location.localtime).toLocaleTimeString()}</div>
                </div>
                <div class="location-item">
                    <div class="label">Coordinates</div>
                    <div class="value">${location.lat}°, ${location.lon}°</div>
                </div>
                <div class="location-item">
                    <div class="label">Last Updated</div>
                    <div class="value">${new Date(data.current.last_updated).toLocaleTimeString()}</div>
                </div>
            `;
        }

        function getUVLevel(uv) {
            if (uv <= 2) return 'Low';
            if (uv <= 5) return 'Moderate';
            if (uv <= 7) return 'High';
            if (uv <= 10) return 'Very High';
            return 'Extreme';
        }

        function updateWeatherIcon(iconElement, condition) {
            const lowerCondition = condition.toLowerCase();
            
            if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
                iconElement.innerHTML = `
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                    <polyline points="13,16 13,20 16,20 16,16"></polyline>
                    <polyline points="8,16 8,20 11,20 11,16"></polyline>
                `;
            } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
                iconElement.innerHTML = `
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                `;
            } else if (lowerCondition.includes('cloud')) {
                iconElement.innerHTML = `
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                `;
            } else if (lowerCondition.includes('snow')) {
                iconElement.innerHTML = `
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                    <polyline points="10,16 10,20"></polyline>
                    <polyline points="14,16 14,20"></polyline>
                    <circle cx="10" cy="18" r="1"></circle>
                    <circle cx="14" cy="18" r="1"></circle>
                `;
            }
        }

        function showError(message) {
            const error = document.getElementById('error');
            const weatherData = document.getElementById('weatherData');
            
            error.textContent = message;
            error.style.display = 'block';
            weatherData.style.display = 'none';
        }

        // Allow Enter key to trigger search
        document.getElementById('cityInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkWeather();
            }
        });

        // Load default city on page load
        window.addEventListener('load', () => {
            checkWeather('New York');
        });