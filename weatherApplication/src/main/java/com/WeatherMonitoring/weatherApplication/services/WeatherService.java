package com.WeatherMonitoring.weatherApplication.services;

import com.WeatherMonitoring.weatherApplication.models.WeatherData;
import com.WeatherMonitoring.weatherApplication.models.WeatherReading;
import com.WeatherMonitoring.weatherApplication.models.WeatherSummary;
import com.WeatherMonitoring.weatherApplication.repositories.DailyWeatherReadingRepository;
import com.WeatherMonitoring.weatherApplication.repositories.WeatherSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final String baseUrl = "http://api.openweathermap.org/data/2.5/weather";

    @Autowired
    private WeatherSummaryRepository summaryRepository;
    @Autowired
    private  DailyWeatherReadingRepository readingRepository;

    private Map<String, List<Double>> temperatureData = new HashMap<>(); // To store temperatures for each city

    private boolean summarySavedToday = false; // to track the  summary saved today or not

    public WeatherData fetchWeatherData(String city) {
        String url = baseUrl + "?q=" + city + "&appid=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, WeatherData.class); // Mapping to WeatherData model
    }

    public double convertToCelsius(double kelvin) {
        return kelvin - 273.15;
    }
    // Method to fetch weather data for a city
    @Scheduled(fixedRate = 300000)  // 300000 milliseconds = 5 minutes
    public void fetchWeatherDataAtIntervals() {
        String[] cities = {"Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"};

        for (String city : cities) {
            WeatherData weatherData = fetchWeatherData(city);
            if (weatherData != null) {
                double tempInCelsius = convertToCelsius(weatherData.getMain().getTemperature());
                double formattedTemp = new BigDecimal(tempInCelsius)
                        .setScale(2, RoundingMode.HALF_UP)
                        .doubleValue();
                String weatherCondition = weatherData.getWeather().get(0).getDescription(); // Ensure this method exists in your WeatherData model
                temperatureData.computeIfAbsent(city, k -> new ArrayList<>()).add(formattedTemp);

//                System.out.println("Current temperature in " + city + " is " + formattedTemp + "°C");

                // Save the weather data to the database
                saveWeatherData(weatherData, city); // Add this line to save the fetched weather data

                // After saving the data, call updateWeatherSummary
                WeatherSummary newSummary = new WeatherSummary();
                newSummary.setCity(city);
                newSummary.setDominantWeatherCondition(weatherCondition);
                updateWeatherSummary(newSummary); // Call the update method here
            }
        }
    }


    // saving the daily Reading data


    public void saveWeatherData(WeatherData weatherData,String city) {
        WeatherReading reading = new WeatherReading();

        double temperatureInCelsius = convertToCelsius(weatherData.getMain().getTemperature());

        double formattedTemp = new BigDecimal(temperatureInCelsius)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        reading.setTemperature(formattedTemp);


        reading.setWeatherCondition(weatherData.getWeather().get(0).getDescription());
        reading.setHumidity(weatherData.getMain().getHumidity());
        reading.setWindSpeed(weatherData.getWind().getSpeed());
        reading.setCloudCover(weatherData.getClouds().getAll());
        reading.setTimestamp(LocalDateTime.now()); // Set current time as timestamp
        reading.setCity(city); // setting the city name

        try {
            readingRepository.save(reading);
        } catch (Exception e) {
            System.out.println("Error saving weather reading: " + e.getMessage());
        }

    }




    private void updateWeatherSummary(WeatherSummary newSummary) {
        String city = newSummary.getCity();
        List<WeatherReading> readings = readingRepository.findByCity(city); // Implement this method to fetch readings for the city

        if (readings.isEmpty()) {
            return; // No readings for this city
        }

        double averageTemp = readings.stream().mapToDouble(WeatherReading::getTemperature).average().orElse(0);
        double maxTemp = readings.stream().mapToDouble(WeatherReading::getTemperature).max().orElse(0);
        double minTemp = readings.stream().mapToDouble(WeatherReading::getTemperature).min().orElse(0);

        // Use HashMap to find the most frequent weather condition
        HashMap<String, Integer> conditionCount = new HashMap<>();
        for (WeatherReading reading : readings) {
            String condition = reading.getWeatherCondition();
            conditionCount.put(condition, conditionCount.getOrDefault(condition, 0) + 1);
        }

        // Find the condition with the maximum frequency
        String dominantCondition = conditionCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");

        double averageHumidity = readings.stream().mapToDouble(WeatherReading::getHumidity).average().orElse(0);
        double averageWindSpeed = readings.stream().mapToDouble(WeatherReading::getWindSpeed).average().orElse(0);

        WeatherSummary summary = new WeatherSummary();
        summary.setCity(city);
        summary.setAverageTemperature(averageTemp);
        summary.setMaximumTemperature(maxTemp);
        summary.setMinimumTemperature(minTemp);
        summary.setDominantWeatherCondition(dominantCondition);
        summary.setAverageHumidity(averageHumidity);
        summary.setAverageWindSpeed(averageWindSpeed);

        // Check if summary exists
        Optional<WeatherSummary> existingSummary = summaryRepository.findByCity(city); // Implement this method

        if (existingSummary.isPresent()) {
            // Update existing summary
            WeatherSummary existing = existingSummary.get();
            existing.setAverageTemperature(averageTemp);
            existing.setMaximumTemperature(maxTemp);
            existing.setMinimumTemperature(minTemp);
            existing.setDominantWeatherCondition(dominantCondition);
            existing.setAverageHumidity(averageHumidity);
            existing.setAverageWindSpeed(averageWindSpeed);
            existing.setLastUpdated(Timestamp.valueOf(LocalDateTime.now()).toLocalDateTime());
            summaryRepository.save(existing);
        } else {
            // Save new summary
            summary.setLastUpdated(Timestamp.valueOf(LocalDateTime.now()).toLocalDateTime());
            summaryRepository.save(summary);
        }
    }



    private double calculateAverage(List<Double> temperatures) {
        if (temperatures.isEmpty()) {
            return 0;
        }
        double sum = 0;
        for (double temp : temperatures) {
            sum += temp;
        }
        return sum / temperatures.size();
    }


    private boolean isEndOfDay() {
        LocalTime now = LocalTime.now();
        return now.getHour() == 23 && now.getMinute() == 59; // Checks if it's 11:59 PM
    }

    private String determineDominantWeather(String weatherCondition) {
        return weatherCondition; // Implement your logic for dominant weather here
    }

    private String getCurrentDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // Adjust the format as needed
    }
}
