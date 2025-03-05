package com.laura.taskmanager.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.laura.taskmanager.model.Tasks;
import com.laura.taskmanager.model.User;

public interface TaskRepo extends JpaRepository<Tasks, Long> {
	List<Tasks> findByuserId(User user);
}
