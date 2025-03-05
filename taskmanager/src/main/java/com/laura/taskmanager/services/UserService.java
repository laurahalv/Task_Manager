package com.laura.taskmanager.services;

import org.springframework.stereotype.Service;

import com.laura.taskmanager.Repository.UserRepo;
import com.laura.taskmanager.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private UserRepo userRepo;
	public void registerUser(User user) {
		userRepo.save(user);
	}
}
