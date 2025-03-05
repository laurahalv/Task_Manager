package com.laura.taskmanager.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.laura.taskmanager.model.User;

public interface UserRepo extends JpaRepository<User, Long>{
	Optional<User> findByuserEmail(String userEmail);
}
