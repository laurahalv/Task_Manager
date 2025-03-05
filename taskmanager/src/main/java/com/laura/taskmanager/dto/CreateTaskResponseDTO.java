package com.laura.taskmanager.dto;


import java.time.LocalDate;

public record CreateTaskResponseDTO
(Long taskId, String title, String description, Long userId, LocalDate createDate) {

}
