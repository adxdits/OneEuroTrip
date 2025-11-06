package com.myapp.entities;


import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "poi_image")
public class PoiImage extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    public Poi poi;

    @Lob
    public byte[] embedding;

    public String image_url;
}