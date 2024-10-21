package com.WeatherMonitoring.weatherApplication.services;

import com.WeatherMonitoring.weatherApplication.models.DailyWeatherSummary;
import com.WeatherMonitoring.weatherApplication.models.WeatherData;
import com.WeatherMonitoring.weatherApplication.repositories.DailyWeatherSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final String baseUrl = "http://api.openweathermap.org/data/2.5/weather";

    @Autowired
    private DailyWeatherSummaryRepository summaryRepository;

    private Map<String, List<Double>> temperatureData = new HashMap<>(); // To store temperatures for each city

    private boolean summarySavedToday = false; // to track the  summary saved today or not

    // Method to fetch weather data for a city
    public WeatherData fetchWeatherData(String city) {
        String url = baseUrl + "?q=" + city + "&appid=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, WeatherData.class); // Mapping to WeatherData model
    }

    // Method to convert temperature from Kelvin to Celsius
    public double convertToCelsius(double kelvin) {
        return kelvin - 273.15;
    }

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

                System.out.println("Current temperature in " + city + " is " + formattedTemp + "°C");


                // Calculate and save daily summary if it's the end of the day
                if (isEndOfDay()) {
                    if (!summarySavedToday) { // Check if today's summary has not been saved
                        saveDailySummary(city, weatherCondition);
                        summarySavedToday = true; // Set the flag to true after saving
                    }
                } else {
                    // Reset the flag at the start of a new day
                    summarySavedToday = false;
                }
            }
        }
    }

    private void saveDailySummary(String city, String weatherCondition) {
        List<Double> temperatures = temperatureData.get(city);
        if (temperatures != null && !temperatures.isEmpty()) {
            DailyWeatherSummary summary = new DailyWeatherSummary();
            summary.setCity(city);
            summary.setAverageTemperature(calculateAverage(temperatures));
            summary.setMaximumTemperature(Collections.max(temperatures));
            summary.setMinimumTemperature(Collections.min(temperatures));
            summary.setDominantWeatherCondition(determineDominantWeather(weatherCondition)); // Pass the weather condition
            summary.setDate(getCurrentDate()); // Get the current date as a string
            System.out.println("Date: " + summary.getDate());
            summaryRepository.save(summary); // Save the summary to the database
            temperatureData.get(city).clear(); // Clear the data for the next day
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
