package com.laura.taskmanager.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks", schema = "task_manager")
public class Tasks {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "task_id")
private Long taskId;

@Column(name = "task_title", length = 100, nullable = false)
private String taskTitle;

@Column(name = "task_description")
private String taskDescription;

@Column(name = "task_create_date")
private LocalDate taskCreateDate;

@Column(name = "task_conclusion_date")
private LocalDate taskConclusionDate;

@Column(name = "task_completed")
private boolean taskCompleted;

@ManyToOne
@JoinColumn(name = "user_id")
private User userId;

public Long getTaskId() {
	return taskId;
}

public void setTaskId(Long taskId) {
	this.taskId = taskId;
}

public String getTaskTitle() {
	return taskTitle;
}

public void setTaskTitle(String taskTitle) {
	this.taskTitle = taskTitle;
}

public String getTaskDescription() {
	return taskDescription;
}

public void setTaskDescription(String taskDescription) {
	this.taskDescription = taskDescription;
}

public LocalDate getTaskCreateDate() {
	return taskCreateDate;
}

public void setTaskCreateDate(LocalDate taskCreateDate) {
	this.taskCreateDate = taskCreateDate;
}

public LocalDate getTaskConclusionDate() {
	return taskConclusionDate;
}

public void setTaskConclusionDate(LocalDate taskConclusionDate) {
	this.taskConclusionDate = taskConclusionDate;
}

public boolean isTaskCompleted() {
	return taskCompleted;
}

public void setTaskCompleted(boolean taskCompleted) {
	this.taskCompleted = taskCompleted;
}

public User getUserId() {
	return userId;
}

public void setUserId(User userId) {
	this.userId = userId;
}

}

