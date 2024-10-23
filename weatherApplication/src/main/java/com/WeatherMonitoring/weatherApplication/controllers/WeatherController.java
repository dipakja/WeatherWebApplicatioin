package com.WeatherMonitoring.weatherApplication.controllers;

import com.WeatherMonitoring.weatherApplication.models.WeatherData;
import com.WeatherMonitoring.weatherApplication.models.WeatherReading;
import com.WeatherMonitoring.weatherApplication.models.WeatherSummary;
import com.WeatherMonitoring.weatherApplication.repositories.DailyWeatherReadingRepository;
import com.WeatherMonitoring.weatherApplication.repositories.WeatherSummaryRepository;
import com.WeatherMonitoring.weatherApplication.services.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class WeatherController {

    @Autowired
    private final WeatherService weatherService;
    @Autowired
    private WeatherSummaryRepository weatherSummaryRepository;
    @Autowired
    private DailyWeatherReadingRepository weatherReadingRepository;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }


    @GetMapping("/api/weather")
    public Map<String, Object> getWeather(@RequestParam String city) {
        WeatherData weatherData = weatherService.fetchWeatherData(city);
        double celsiusTemp = weatherService.convertToCelsius(weatherData.getMain().getTemperature());
        double humidity = weatherData.getMain().getHumidity();
        double windSpeed = weatherData.getWind().getSpeed();
        double windGust = weatherData.getWind().getGust();  // Get wind gust
        String weatherDescription = weatherData.getWeather().get(0).getDescription();
        String weatherIcon = weatherData.getWeather().get(0).getIcon();  // Get weather icon
        int cloudCover = weatherData.getClouds().getAll();  // Get cloud cover

        // Create a response map
        Map<String, Object> response = new HashMap<>();
        response.put("temperature", celsiusTemp);
        response.put("humidity", humidity);
        response.put("windSpeed", windSpeed);
        response.put("windGust", windGust);
        response.put("weather", weatherDescription);
        response.put("weatherIcon", weatherIcon);  // Add weather icon to response
        response.put("cloudCover", cloudCover);  // Add cloud cover to response

        return response;
    }
    @GetMapping("/api/weather-summary")
    public List<WeatherSummary> getWeatherSummary() {
        return weatherSummaryRepository.findAll();
    }

        // API endpoint to fetch weather data
        @GetMapping("/api/weather-data")
        public List<WeatherReading> getWeatherData() {
            // Fetch weather data from the database and return as a list
            return weatherReadingRepository.findAll(); // Modify as per your database structure or query
        }


}