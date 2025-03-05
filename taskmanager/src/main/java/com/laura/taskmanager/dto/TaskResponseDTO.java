package com.laura.taskmanager.dto;

import java.time.LocalDate;

public record TaskResponseDTO
(String title, String description, LocalDate conclusionDate, boolean completed) {

}
