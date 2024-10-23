let temperatureChart, humidityChart, windSpeedChart, cloudCoverChart;

// Function to fetch weather data from the API
async function getCityWeatherData(city) {
    const response = await fetch('/api/weather-data'); // Fetch all weather data from your API
    const data = await response.json();

    // Filter data for the selected city
    return data.filter(entry => entry.city === city);
}

// Function to create charts for the selected city's weather data
function createCharts(data, city) {
    const timestamps = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
    const temperatures = data.map(entry => entry.temperature);
    const humidities = data.map(entry => entry.humidity);
    const windSpeeds = data.map(entry => entry.windSpeed);
    const cloudCovers = data.map(entry => entry.cloudCover);

    // Create Temperature chart
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: `${city} Temperature (°C)`,
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });

    // Create Humidity chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: `${city} Humidity (%)`,
                data: humidities,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });

    // Create Wind Speed chart
    const windSpeedCtx = document.getElementById('windSpeedChart').getContext('2d');
    windSpeedChart = new Chart(windSpeedCtx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: `${city} Wind Speed (m/s)`,
                data: windSpeeds,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });

    // Create Cloud Cover chart
    const cloudCoverCtx = document.getElementById('cloudCoverChart').getContext('2d');
    cloudCoverChart = new Chart(cloudCoverCtx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: `${city} Cloud Cover (%)`,
                data: cloudCovers,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });
}

// Function to update existing charts when a new city is selected
function updateCharts(data, city) {
    const timestamps = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
    const temperatures = data.map(entry => entry.temperature);
    const humidities = data.map(entry => entry.humidity);
    const windSpeeds = data.map(entry => entry.windSpeed);
    const cloudCovers = data.map(entry => entry.cloudCover);

    // Update Temperature chart
    temperatureChart.data.labels = timestamps;
    temperatureChart.data.datasets[0].data = temperatures;
    temperatureChart.data.datasets[0].label = `${city} Temperature (°C)`;
    temperatureChart.update();

    // Update Humidity chart
    humidityChart.data.labels = timestamps;
    humidityChart.data.datasets[0].data = humidities;
    humidityChart.data.datasets[0].label = `${city} Humidity (%)`;
    humidityChart.update();

    // Update Wind Speed chart
    windSpeedChart.data.labels = timestamps;
    windSpeedChart.data.datasets[0].data = windSpeeds;
    windSpeedChart.data.datasets[0].label = `${city} Wind Speed (m/s)`;
    windSpeedChart.update();

    // Update Cloud Cover chart
    cloudCoverChart.data.labels = timestamps;
    cloudCoverChart.data.datasets[0].data = cloudCovers;
    cloudCoverChart.data.datasets[0].label = `${city} Cloud Cover (%)`;
    cloudCoverChart.update();
}

// Initial setup when the page loads
window.onload = async function() {
    const defaultCity = 'Delhi';
    const cityData = await getCityWeatherData(defaultCity);
    createCharts(cityData, defaultCity); // Create charts for the default city
    document.getElementById('cityDropdown').value = defaultCity;
};

// Event listener for dropdown change
document.getElementById('cityDropdown').addEventListener('change', async function() {
    const selectedCity = this.value;
    const cityData = await getCityWeatherData(selectedCity);
    updateCharts(cityData, selectedCity); // Update charts when a new city is selected
});
