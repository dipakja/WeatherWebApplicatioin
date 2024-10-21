// Function to fetch weather data for multiple cities
const fetchTemperatureData = async () => {
    try {
        const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
        const weatherDataPromises = cities.map(city => fetch(`/api/weather?city=${city}`).then(res => res.json()));
        const allWeatherData = await Promise.all(weatherDataPromises);

        const formattedData = {
            temperature: [],
            humidity: [],
            windSpeed: [],
            cloudCover: [],
            cities: []
        };

        allWeatherData.forEach((data, index) => {
            formattedData.cities.push(cities[index]);
            formattedData.temperature.push(data.temperature); // Store raw temperature values for conversion
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

// Function to update the weather cards dynamically
const updateWeatherCards = (data, formattedData) => {
    const weatherCardsContainer = document.getElementById('weather-cards');
    weatherCardsContainer.innerHTML = '';

    data.forEach((cityData, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        const cityName = formattedData.cities[index];
        const temperature = cityData.temperature; // Use the raw temperature value

        card.innerHTML = `
            <div class="card mb-3 weather-card ${getWeatherClass(cityData.weather)}">
                <div class="card-body text-center">
                    <h5 class="card-title">${cityName}</h5>
                    <i class="weather-icon ${getWeatherClass(cityData.weather)}"></i>
                    <p class="card-text temperature-value" data-unit="C">Temperature: ${temperature.toFixed(2)}°C</p>
                    <p class="card-text">Weather: ${cityData.weather || 'Unknown'}</p>
                    <p class="card-text">Humidity: ${cityData.humidity || 'N/A'}%</p>
                    <p class="card-text">Wind Speed: ${cityData.windSpeed || 'N/A'} m/s</p>
                    <p class="card-text">Cloud Cover: ${cityData.cloudCover || 'N/A'}%</p>
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

// Function to render the charts
const renderCharts = (data) => {
    const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    const ctxWindSpeed = document.getElementById('windSpeedChart').getContext('2d');
    const ctxCloudCover = document.getElementById('cloudCoverChart').getContext('2d');

    // Temperature chart
    new Chart(ctxTemperature, {
        type: 'line',
        data: {
            labels: data.cities,
            datasets: [{
                label: 'Temperature (°C)',
                data: data.temperature.map(temp => temp.toFixed(2)), // Convert temperatures for chart
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Humidity chart
    new Chart(ctxHumidity, {
        type: 'bar',
        data: {
            labels: data.cities,
            datasets: [{
                label: 'Humidity (%)',
                data: data.humidity,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Wind Speed chart
    new Chart(ctxWindSpeed, {
        type: 'bar',
        data: {
            labels: data.cities,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: data.windSpeed,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Cloud Cover chart
    new Chart(ctxCloudCover, {
        type: 'bar',
        data: {
            labels: data.cities,
            datasets: [{
                label: 'Cloud Cover (%)',
                data: data.cloudCover,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

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
