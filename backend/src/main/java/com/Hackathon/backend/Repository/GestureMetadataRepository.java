package com.Hackathon.backend.Repository;

import com.Hackathon.backend.Model.GestureMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GestureMetadataRepository extends JpaRepository<GestureMetadata, String> {
}

