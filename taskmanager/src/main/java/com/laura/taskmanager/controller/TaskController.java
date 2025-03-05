package com.laura.taskmanager.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.laura.taskmanager.Repository.TaskRepo;
import com.laura.taskmanager.Repository.UserRepo;
import com.laura.taskmanager.dto.CreateTaskResponseDTO;
import com.laura.taskmanager.model.Tasks;
import com.laura.taskmanager.model.User;

@RestController
@RequestMapping("/task")
public class TaskController {
	private final TaskRepo taskRepository;
	private final UserRepo userRepository;

	@Autowired
	public TaskController(TaskRepo taskRepository, UserRepo userRepository) {
		super();
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
	}

	@GetMapping("{userId}")
	public ResponseEntity<List<Tasks>> getTasksByUserId(@PathVariable Long userId) {
	    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
	    
	    List<Tasks> tasks = taskRepository.findByuserId(user);
	    
	    return ResponseEntity.ok(tasks);
	}
	
	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody CreateTaskResponseDTO body) {
	    var authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication == null || authentication.getName() == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
	    }

	    String email = authentication.getName(); 

	    Optional<User> user = this.userRepository.findByuserEmail(email);
	    if (user.isPresent()) {
	        Tasks task = new Tasks();
	        task.setTaskTitle(body.title());
	        task.setTaskDescription(body.description());
	        task.setTaskCompleted(false);
	        task.setUserId(user.get());
	        task.setTaskCreateDate(LocalDate.now());

	        this.taskRepository.save(task);

	        return ResponseEntity.ok(new CreateTaskResponseDTO(task.getTaskId(), task.getTaskTitle(),
	                task.getTaskDescription(), task.getUserId().getUserId(), task.getTaskCreateDate()));
	    }
	    return ResponseEntity.badRequest().body("User not found with email: " + email);
	}


	@PatchMapping("{taskId}")
	public ResponseEntity<Tasks> updateTask(@PathVariable Long taskId, @RequestBody Tasks taskDetails) {
		Optional<Tasks> task = taskRepository.findById(taskId);
		if (task.isPresent()) {
			Tasks taskToUpdate = task.get();
			taskToUpdate.setTaskTitle(taskDetails.getTaskTitle());
			taskToUpdate.setTaskDescription(taskDetails.getTaskDescription());

			if (taskDetails.isTaskCompleted()) {
				taskToUpdate.setTaskCompleted(true);
				taskToUpdate.setTaskConclusionDate(LocalDate.now());
			}else {
				taskToUpdate.setTaskCompleted(taskDetails.isTaskCompleted());
				taskToUpdate.setTaskConclusionDate(null);
			}
			
			Tasks updatedTask = taskRepository.save(taskToUpdate);
			return ResponseEntity.ok(updatedTask);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/delete/{taskId}")
	public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
		Optional<Tasks> task = taskRepository.findById(taskId);
		if (task.isPresent()) {
			taskRepository.deleteById(taskId);
			return ResponseEntity.ok("Task '" + task.get().getTaskTitle() + "' with id '" + task.get().getTaskId()
					+ "' has been deleted");
		} else {
			return ResponseEntity.status(404).body("Task with ID " + taskId + " doesn't exist");
		}
	}
}
