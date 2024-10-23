package com.WeatherMonitoring.weatherApplication.repositories;

import com.WeatherMonitoring.weatherApplication.models.WeatherReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyWeatherReadingRepository extends JpaRepository<WeatherReading, Long> {


    List<WeatherReading> findByCity(String city);
}
