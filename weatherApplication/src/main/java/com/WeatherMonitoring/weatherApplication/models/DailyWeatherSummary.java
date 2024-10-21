package com.WeatherMonitoring.weatherApplication.models;

import jakarta.persistence.*;

@Entity
@Table(name = "weather_summary")
public class DailyWeatherSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private double averageTemperature;
    private double maximumTemperature;
    private double minimumTemperature;
    private String dominantWeatherCondition;
    private String date; // To store the date of the summary

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public double getAverageTemperature() {
        return averageTemperature;
    }

    public void setAverageTemperature(double averageTemperature) {
        this.averageTemperature = averageTemperature;
    }

    public double getMaximumTemperature() {
        return maximumTemperature;
    }

    public void setMaximumTemperature(double maximumTemperature) {
        this.maximumTemperature = maximumTemperature;
    }

    public double getMinimumTemperature() {
        return minimumTemperature;
    }

    public void setMinimumTemperature(double minimumTemperature) {
        this.minimumTemperature = minimumTemperature;
    }

    public String getDominantWeatherCondition() {
        return dominantWeatherCondition;
    }

    public void setDominantWeatherCondition(String dominantWeatherCondition) {
        this.dominantWeatherCondition = dominantWeatherCondition;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
