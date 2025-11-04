package com.campuswalk.repositories;

import com.campuswalk.models.VerticalLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VerticalLinkRepository extends JpaRepository<VerticalLink, Long> {
    List<VerticalLink> findByFromLocationId(Long locationId);
}
