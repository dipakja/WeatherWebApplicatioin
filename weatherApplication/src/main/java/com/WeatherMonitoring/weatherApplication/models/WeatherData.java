package com.WeatherMonitoring.weatherApplication.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class WeatherData {

    @JsonProperty("main")
    private MainWeather main;

    @JsonProperty("weather")
    private List<WeatherCondition> weather;

    @JsonProperty("wind")
    private Wind wind;

    @JsonProperty("clouds")  // Add this field for cloud cover
    private Clouds clouds;

    @JsonProperty("dt")
    private long timestamp;

    // Getters and setters
    public MainWeather getMain() {
        return main;
    }

    public void setMain(MainWeather main) {
        this.main = main;
    }

    public List<WeatherCondition> getWeather() {
        return weather;
    }

    public void setWeather(List<WeatherCondition> weather) {
        this.weather = weather;
    }

    public Wind getWind() {
        return wind;
    }

    public void setWind(Wind wind) {
        this.wind = wind;
    }

    public Clouds getClouds() {  // Add getter for clouds
        return clouds;
    }

    public void setClouds(Clouds clouds) {  // Add setter for clouds
        this.clouds = clouds;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    // Inner class to handle 'main' field
    public static class MainWeather {
        @JsonProperty("temp")
        private double temperature;

        @JsonProperty("feels_like")
        private double feelsLike;

        @JsonProperty("humidity")
        private double humidity;

        // Getters and setters
        public double getTemperature() {
            return temperature;
        }

        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }

        public double getFeelsLike() {
            return feelsLike;
        }

        public void setFeelsLike(double feelsLike) {
            this.feelsLike = feelsLike;
        }

        public double getHumidity() {
            return humidity;
        }

        public void setHumidity(double humidity) {
            this.humidity = humidity;
        }
    }

    // Inner class to handle 'weather' field
    public static class WeatherCondition {
        @JsonProperty("description")
        private String description;

        @JsonProperty("icon")  // Add this field for weather icon
        private String icon;

        // Getters and setters
        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getIcon() {  // Add getter for icon
            return icon;
        }

        public void setIcon(String icon) {  // Add setter for icon
            this.icon = icon;
        }
    }

    // Inner class to handle 'wind' field
    public static class Wind {
        @JsonProperty("speed")
        private double speed;

        @JsonProperty("gust")  // Add this field for wind gust
        private double gust;

        // Getters and setters
        public double getSpeed() {
            return speed;
        }

        public void setSpeed(double speed) {
            this.speed = speed;
        }

        public double getGust() {  // Add getter for gust
            return gust;
        }

        public void setGust(double gust) {  // Add setter for gust
            this.gust = gust;
        }
    }

    // Inner class to handle 'clouds' field
    public static class Clouds {
        @JsonProperty("all")  // Cloud cover percentage
        private int all;

        // Getter and setter
        public int getAll() {
            return all;
        }

        public void setAll(int all) {
            this.all = all;
        }
    }
}
