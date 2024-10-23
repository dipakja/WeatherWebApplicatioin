package com.WeatherMonitoring.weatherApplication.repositories;

import com.WeatherMonitoring.weatherApplication.models.WeatherSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeatherSummaryRepository extends JpaRepository<WeatherSummary, Long> {
    Optional<WeatherSummary> findByCity(String city);
    // You can define custom query methods here if needed
    
}