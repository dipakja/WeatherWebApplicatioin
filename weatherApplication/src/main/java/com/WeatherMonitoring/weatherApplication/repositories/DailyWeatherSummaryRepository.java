package com.WeatherMonitoring.weatherApplication.repositories;

import com.WeatherMonitoring.weatherApplication.models.DailyWeatherSummary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyWeatherSummaryRepository extends JpaRepository<DailyWeatherSummary, Long> {
    // You can define custom query methods here if needed
}
