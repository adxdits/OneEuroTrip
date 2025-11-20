package com.myapp.resources.dto;

public class HistoryCheckRequest {
    public Long userId;

    // Ticket unique-identifying fields
    public Long poiId; // optional if client already knows poi id
    public String poiName; // fallback
    public String poiLocation;

    public Double price;
    public String transportMode;
    public String startDate;
    public String endDate;
}
