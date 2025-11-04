package com.campuswalk.repositories;

import com.campuswalk.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByFloorId(Long floorId);
    
    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Location> searchLocations(String searchTerm);
    
    List<Location> findByType(String type);
}
