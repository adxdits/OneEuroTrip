package entities;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase; // pour Panache
import jakarta.persistence.Entity;       // JPA
import jakarta.persistence.Id;           // JPA
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Trip extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String destination;
    public String startDate;
    public String endDate;
    public double budget;
    public int people;
    public String transport;

    // Pour la géolocalisation
    public Double latitude;
    public Double longitude;
}
