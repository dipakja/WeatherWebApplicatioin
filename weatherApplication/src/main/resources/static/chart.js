const createCharts = (weatherData) => {
    const cities = Object.keys(weatherData);
    const temperatures = cities.map(city => weatherData[city].temperature);
    const humidity = cities.map(city => weatherData[city].humidity);
    const windSpeeds = cities.map(city => weatherData[city].windSpeed);
    const cloudCovers = cities.map(city => weatherData[city].cloudCover);

    // Define color sets for the charts
    const tempColor = 'rgba(255, 99, 132, 1)'; // Red
    const humidityColors = [
        'rgba(54, 162, 235, 1)',  // Blue
        'rgba(255, 206, 86, 1)',  // Yellow
        'rgba(75, 192, 192, 1)',  // Teal
        'rgba(153, 102, 255, 1)', // Purple
        'rgba(255, 159, 64, 1)',  // Orange
        'rgba(255, 99, 132, 1)'   // Red
    ];
    const windColor = 'rgba(75, 192, 192, 1)'; // Teal
    const cloudColors = [
        'rgba(153, 102, 255, 1)', // Purple
        'rgba(255, 159, 64, 1)',  // Orange
        'rgba(54, 162, 235, 1)',  // Blue
        'rgba(255, 206, 86, 1)',  // Yellow
        'rgba(75, 192, 192, 1)',  // Teal
        'rgba(255, 99, 132, 1)'   // Red
    ];

    // Temperature chart
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    new Chart(ctxTemp, {
        type: 'bar',
        data: {
            labels: cities,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: tempColor,
                borderColor: tempColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { display: true, labels: { color: '#333' } },
                tooltip: { backgroundColor: '#fff', bodyColor: '#333', titleColor: '#333' }
            }
        }
    });

    // Humidity chart
    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    new Chart(ctxHumidity, {
        type: 'pie',
        data: {
            labels: cities,
            datasets: [{
                label: 'Humidity (%)',
                data: humidity,
                backgroundColor: humidityColors,
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { color: '#333' } },
                tooltip: { backgroundColor: '#fff', bodyColor: '#333', titleColor: '#333' }
            }
        }
    });

    // Wind speed chart
    const ctxWind = document.getElementById('windSpeedChart').getContext('2d');
    new Chart(ctxWind, {
        type: 'line',
        data: {
            labels: cities,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: windSpeeds,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: windColor,
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { display: true, labels: { color: '#333' } },
                tooltip: { backgroundColor: '#fff', bodyColor: '#333', titleColor: '#333' }
            }
        }
    });

    // Cloud cover chart
    const ctxCloud = document.getElementById('cloudCoverChart').getContext('2d');
    new Chart(ctxCloud, {
        type: 'doughnut',
        data: {
            labels: cities,
            datasets: [{
                label: 'Cloud Cover (%)',
                data: cloudCovers,
                backgroundColor: cloudColors,
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { color: '#333' } },
                tooltip: { backgroundColor: '#fff', bodyColor: '#333', titleColor: '#333' }
            }
        }
    });
};

// Assuming this is called after the data is fetched
fetchTemperatureData().then(weatherData => createCharts(weatherData));
