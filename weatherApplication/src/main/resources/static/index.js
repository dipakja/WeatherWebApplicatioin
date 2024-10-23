// Function to fetch weather data for multiple cities
const fetchTemperatureData = async () => {
    try {
        const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
        const weatherDataPromises = cities.map(city => fetch(`/api/weather?city=${city}`).then(res => res.json()));
        const allWeatherData = await Promise.all(weatherDataPromises);

        // Inject city names directly into the weather data
        allWeatherData.forEach((data, index) => {
            data.city = cities[index]; // Adding the city name to the data object
        });

        // Prepare data for rendering charts (optional)
        const formattedData = {
            temperature: [],
            humidity: [],
            windSpeed: [],
            cloudCover: [],
            cities: []
        };

        allWeatherData.forEach((data, index) => {
            formattedData.cities.push(cities[index]);
            formattedData.temperature.push(data.temperature);
            formattedData.humidity.push(data.humidity);
            formattedData.windSpeed.push(data.windSpeed);
            formattedData.cloudCover.push(data.cloudCover);
        });

        // Update the weather cards with fetched data
        updateWeatherCards(allWeatherData, formattedData);

        // Render charts for the weather data
        renderCharts(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};


// Function to get weather icon class based on weather condition
const getWeatherIconClass = (weatherCondition) => {
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
        case 'clear':
            return { icon: 'fas fa-sun', color: '#FFD700;' };  // Yellow for clear weather
        case 'clouds':
        case 'overcast clouds':
            return { icon: 'fas fa-cloud', color: '#B0C4DE' };  // Gray for cloudy weather
        case 'light rain':
            return { icon: 'fas fa-cloud-showers-heavy', color: '#00BFFF' };  // Light blue for light rain
        case 'moderate rain':
            return { icon: 'fas fa-cloud-rain', color: '#4682B4' };  // Dark blue for moderate rain
        case 'smoke':
        case 'haze':
        case 'mist':
        return { icon: 'fas fa-cloud', color: '#4682B4' };
        case 'broken clouds':
            return{icon:'fas fa-solid fa-cloud',color:'#74C0FC'}
        case 'fog':
            return { icon: 'fas fa-smog', color: '#D3D3D3' };  // Light gray or brown for haze, mist, smoke
        case 'snow':
            return { icon: 'fas fa-snowflake', color: '#ADD8E6' };  // White for snow
        case 'thunderstorm':
            return { icon: 'fas fa-bolt', color: '#FF4500' };  // Dark gray with lightning for thunderstorm
        default:
            return { icon: 'fas fa-question', color: '#A9A9A9' };  // Red for unknown conditions
    }
};

// Function to update the weather cards dynamically
const updateWeatherCards = (data) => {
    const weatherCardsContainer = document.getElementById('weather-cards');
    weatherCardsContainer.innerHTML = '';

    // Log the data to see what is being passed
//    console.log("Weather Data:", data);

    data.forEach((cityData) => {
        // Log each cityData object to inspect its properties
//        console.log("City Data:", cityData);

        const card = document.createElement('div');
        card.className = 'col-md-4';

        // Access city, temperature, weatherCondition, etc.
        const cityName = cityData.city || 'Unknown City';
        const temperature = cityData.temperature || 0;
        const weatherCondition = cityData.weather || 'Unknown';
        const humidity = cityData.humidity || 'N/A';
        const windSpeed = cityData.windSpeed || 'N/A';
        const cloudCover = cityData.cloudCover || 'N/A';

        // Log the values being used
//        console.log("City Name:", cityName);
//        console.log("Weather Condition:", weatherCondition);

        // Get the correct weather icon class based on weatherCondition
      // Get both the icon and the color class for the weather condition
            const { icon: weatherIconClass, color: weatherColorClass } = getWeatherIconClass(weatherCondition);


        card.innerHTML = `
            <div class="card mb-3 weather-card">
                <div class="card-body text-center">
                    <h5 class="card-title">${cityName}</h5>
                    <i class="${weatherIconClass}" style="font-size: 40px;color: ${weatherColorClass};"></i> <!-- Weather icon -->
                    <p class="card-text temperature-value" data-unit="C">Temperature: ${temperature.toFixed(2)}°C</p>
                    <p class="card-text">Weather: ${weatherCondition}</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                    <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                    <p class="card-text">Cloud Cover: ${cloudCover}%</p>
                </div>
            </div>
        `;
        weatherCardsContainer.appendChild(card);
    });
};





// Function to return appropriate class based on weather condition
const getWeatherClass = (weatherCondition) => {
    if (!weatherCondition) return 'cloudy';

    switch (weatherCondition.toLowerCase()) {
        case 'rain':
            return 'rainy';
        case 'clear':
            return 'sunny';
        case 'clouds':
            return 'cloudy';
        default:
            return 'cloudy';
    }
};

// Function to fetch weather summary data
const fetchWeatherSummary = async () => {
    try {
        const response = await fetch('/api/weather-summary');
        const weatherSummaryData = await response.json();

        // Update the summary section with the fetched data
        updateWeatherSummary(weatherSummaryData);
    } catch (error) {
        console.error('Error fetching weather summary data:', error);
    }
};

// Function to update the weather summary section

const updateWeatherSummary = (summaries) => {
    const summaryContainer = document.getElementById('dailySummary');
    summaryContainer.innerHTML = ''; // Clear existing content

    summaries.forEach((summary) => {
        const weatherIconClass = getWeatherIconClass(summary.dominantWeatherCondition);
        const summaryCard = `
            <div class="city-summary card" style="background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h5 style="display: flex; align-items: center;">
                    <i class="${weatherIconClass}" style="font-size: 24px; margin-right: 8px;"></i>
                    <strong>${summary.city}</strong>
                </h5>
                <p style="margin: 0;">
                    <strong>Avg Temp:</strong> ${summary.averageTemperature.toFixed(2)}°C |
                    <strong>Max Temp:</strong> ${summary.maximumTemperature.toFixed(2)}°C |
                    <strong>Min Temp:</strong> ${summary.minimumTemperature.toFixed(2)}°C
                </p>
                <p style="margin: 0;">
                    <strong>Condition:</strong> ${summary.dominantWeatherCondition} |
                    <strong>Avg Humidity:</strong> ${summary.averageHumidity.toFixed(2)}% |
                    <strong>Avg Wind Speed:</strong> ${summary.averageWindSpeed.toFixed(2)} m/s
                </p>
                <p style="margin: 0;">
                    <strong>Last Updated:</strong> ${new Date(summary.lastUpdated).toLocaleString()}
                </p>
            </div>
        `;

        summaryContainer.innerHTML += summaryCard;
    });
};

// Call the fetchWeatherSummary function to fetch and display the data
fetchWeatherSummary();

// Function to toggle temperature units
const toggleTemperatureUnits = () => {
    const tempElements = document.querySelectorAll('.temperature-value');
    tempElements.forEach(el => {
        // Extract the current temperature value and unit
        const currentTempText = el.textContent.match(/[-+]?[0-9]*\.?[0-9]+/)[0]; // Matches the numerical value
        const currentTemp = parseFloat(currentTempText); // Convert to float
        const currentUnit = el.dataset.unit;

        if (currentUnit === 'C') {
            // Convert to Kelvin
            const kelvinTemp = currentTemp + 273.15;
            el.textContent = `Temperature: ${kelvinTemp.toFixed(2)}°K`;
            el.dataset.unit = 'K'; // Update the unit
        } else {
            // Convert to Celsius
            const celsiusTemp = currentTemp - 273.15;
            el.textContent = `Temperature: ${celsiusTemp.toFixed(2)}°C`;
            el.dataset.unit = 'C'; // Update the unit
        }
    });
};

// Event listener for temperature toggle
document.getElementById('tempToggle').addEventListener('click', toggleTemperatureUnits);

// Initial data fetch
fetchTemperatureData();
